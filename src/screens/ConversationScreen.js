import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; //instead of useEffect for checking isHaven on re-run
import { Ionicons, Entypo } from "@expo/vector-icons"; //entypo for importing happy face emoji and images icon
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; //gesture-tap icon, handshake icon
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "../../utils/hooks/supabase";

import CameraScreen from "./CameraScreen"; //functionality for camera button
import HavenTools from "../components/HavenTools";

//global colors for users
// Color used for the current user's own messages ("ME" label + border).
const ME_COLOR = "#E92754";
// Palette used to color-code other senders (name label + left border).
const SENDER_COLORS = ["#3CB2E2", "#9B55A0", "#03A588"];

function colorForSender(senderId) {
  if (!senderId) return SENDER_COLORS[0];
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SENDER_COLORS[Math.abs(hash) % SENDER_COLORS.length];
}

// small status pill shown under a Haven invite card once it's no longer pending
// (or on the sender's side the whole time)
function HavenInviteStatusPill({ status, isRecipient }) {
  if (status === "accepted") {
    return (
      <View style={[styles.inviteStatusPill, styles.inviteStatusAccepted]}>
        <Text style={styles.inviteStatusTextAccepted}>
          {isRecipient ? "You accepted" : "Accepted"}
        </Text>
      </View>
    );
  }
  if (status === "declined") {
    return (
      <View style={[styles.inviteStatusPill, styles.inviteStatusDeclined]}>
        <Text style={styles.inviteStatusTextDeclined}>
          {isRecipient ? "You declined" : "Declined"}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.inviteStatusPill}>
      <Text style={styles.inviteStatusTextPending}>Awaiting response...</Text>
    </View>
  );
}

export default function ConversationScreen({ route, navigation }) {
  const { conversationId, isHaven: HavenMode } = route.params ?? {};
  const [isHaven, setIsHaven] = useState(HavenMode ?? false); //flag for haven toolkit toggle

  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("Me");
  const [currentUserBitmojiIcon, setCurrentUserBitmojiIcon] = useState(null);

  const [participant, setParticipant] = useState([]);
  const [participantBitmojiIcon, setParticipantBitmojiIcon] = useState(null);
  const [otherUserUsername, setOtherUserUsername] = useState(null);
  const [showPills, setShowPills] = useState(false); //sets feature pills toggle from plus symbol

  const realtimeChannelRef = useRef(null); //so that when returnign to conversation screen, we don't have a duplicate channel
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const listRef = useRef();

  // kept in sync so the realtime callback below (created once per conversationId)
  // always sees the latest currentUserId instead of a stale closure value
  const currentUserIdRef = useRef(currentUserId);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  // prevents navigating to WelcomeToHavenScreen more than once per conversation visit
  const hasNavigatedToWelcomeRef = useRef(false);
  const wasHavenRef = useRef(HavenMode ?? false);

  useEffect(() => {
    hasNavigatedToWelcomeRef.current = false;
    wasHavenRef.current = HavenMode ?? false;
  }, [conversationId]);

  //Haven conditional Rendering logic
  //-----------------------------------------------------
  //check if isHaven is true in supabase
  const fetchHavenStatus = async () => {
    if (!conversationId) {
      setIsHaven(false);
      return;
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("is_haven")
      .eq("conversation_id", conversationId)
      .single();

    if (error) {
      console.error("Error fetching Haven status:", error);
      return;
    }
    const nowHaven = data?.is_haven === true;
    const justBecameHaven = nowHaven && !wasHavenRef.current;
    wasHavenRef.current = nowHaven;
    setIsHaven(nowHaven);

    // Fires for whichever screen (sender or recipient) sees the flip first —
    // covers the sender's side, which only learns Haven turned on via
    // focus/realtime rather than tapping Accept directly.
    if (justBecameHaven && !hasNavigatedToWelcomeRef.current) {
      hasNavigatedToWelcomeRef.current = true;
      navigation.navigate("WelcomeToHavenScreen", { conversationId });
    }
  };

  //checks if isHaven is on when returning to conversation from another screen
  useFocusEffect(
    React.useCallback(() => {
      fetchHavenStatus();
    }, [conversationId]),
  );
  //feature pills persist for only a few seconds and goes away
  const handleTogglePills = () => {
    setShowPills(true);

    setTimeout(() => {
      setShowPills(false);
    }, 8000);
  };

  //onPress handler for navigation to map from Need Help button in HavenTools
  //Resources filter open on navigation
  const handleHelpPress = () => {
    navigation.navigate("Back", {
      screen: "Map",
      params: {
        initialFilter: "resources",
      },
    });
  };

  //--------------------------------------
  //Adding realtime chat functionality
  //--------------------------------------
  // uses hook to store currently logged in users info to database
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser(); //requests authentication data
      if (error) {
        console.error("Error fetching current user:", error);
        return;
      }
      const uid = data?.user?.id ?? null; //extracts the users id or null
      setCurrentUserId(uid);
      console.log("Inside data fetch for current user");

      if (uid) {
        const { data: profile } = await supabase
          .from("profiles")
          .select(
            `
            user_id,
            bitmoji_icon`,
          )
          .eq("user_id", uid)
          .single();
        if (profile?.username) setCurrentUserName(profile.username); //set state for username

        setCurrentUserBitmojiIcon(profile?.bitmoji_icon ?? null); //set state for bitmoji icon on chatscreen
      }
    };
    fetchUser();
  }, []);

  //------------------------------
  //fetch conversation participants from conversation_members
  const fetchParticipants = async () => {
    if (!conversationId || !currentUserId) return;

    const { data, error } = await supabase
      .from("conversation_members")
      .select(
        `
        user_id,
        profiles (username, bitmoji_icon)`,
      )
      .eq("conversation_id", conversationId);

    if (error) {
      console.error("Error fetching participants:", error);
      return;
    }
    console.log("Participants:", JSON.stringify(data, null, 2));
    console.log("Participant error:", error);
    setParticipant(data ?? []);
    const otherParticipant = (data ?? []).find(
      (p) => p.user_id !== currentUserId,
    ); //first participant besides currentUser
    setParticipantBitmojiIcon(otherParticipant?.profiles?.bitmoji_icon ?? null);
    setOtherUserUsername(otherParticipant?.profiles?.username ?? null);
  };

  useEffect(() => {
    fetchParticipants();
  }, [conversationId, currentUserId]);

  //------------------------------
  //fetch messages from messages
  const fetchMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    console.log("Inside message fetch");

    const { data, error } = await supabase
      .from("messages")
      .select(
        `message_id, conversation_id, sender_id, text, created_at, is_prompt,
         is_nudge, is_checkin, is_haven_invite, invite_status,
        profiles (user_id, username, bitmoji_icon)`,
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      setMessages([]);
    } else {
      console.log("Messages fetched:", data);
      setMessages(data ?? []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  //-------------------------------------
  // realtime messaging with channel
  //redesigned to handle duplicate channels (upon navigating between Map and ConversationScreen)
  useEffect(() => {
    if (!conversationId) return;

    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
    const channelName = `conversation-${conversationId}-${Date.now()}`; //more specific channel names to prevent duplicates

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          // picks up invite_status flipping from pending -> accepted/declined
          fetchMessages();
          // picks up is_haven flipping true the moment the other person accepts,
          // without needing to leave and refocus this screen
          fetchHavenStatus();
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current === channel) {
        supabase.removeChannel(channel);
        realtimeChannelRef.current = null;
      }
    };
  }, [conversationId]);
  //--------------------------------
  //sending messages
  const handleSend = async () => {
    const body = draft.trim();
    if (!body || !currentUserId) return;

    setIsSending(true);
    setDraft("");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      text: body,
    });
    if (error) {
      console.error("Error sending message:", error);
      setDraft(body);
    }
    setIsSending(false);
  };

  //send prompts in chat if "prompt" is selected

  const sendPromptAsMessage = async (promptText, conversationId, userId) => {
    const { data, error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      text: promptText,
      is_prompt: true,
    });

    if (error) {
      console.log("Failed to send prompt:", error);
    }
  };

  //-----------------------------------
  //responding to a Haven invite message (accept or decline)
  const handleRespondHavenInvite = async (messageId, response) => {
    // .select() here so we get the updated row back — without it, an update
    // silently blocked by RLS returns no error and no data, which is easy
    // to miss (that's exactly what was happening before the UPDATE policy
    // existed on the messages table).
    const { data, error } = await supabase
      .from("messages")
      .update({ invite_status: response })
      .eq("message_id", messageId)
      .select();

    if (error) {
      console.error("Error responding to Haven invite:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn(
        "Haven invite update affected 0 rows — check that an UPDATE RLS policy exists on messages for conversation members.",
      );
      return;
    }

    // reflect the change immediately rather than waiting on the realtime round trip
    fetchMessages();

    if (response === "accepted") {
      const { error: convError } = await supabase
        .from("conversations")
        .update({ is_haven: true })
        .eq("conversation_id", conversationId);

      if (convError) {
        console.error("Error activating Haven:", convError);
        return;
      }

      wasHavenRef.current = true;
      hasNavigatedToWelcomeRef.current = true;
      setIsHaven(true);
      navigation.navigate("WelcomeToHavenScreen", { conversationId });
    }
  };

  //creating an array to sort the messages for rendering
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  //-----------------------------------
  //rendering messages
  function renderMessage({ item }) {
    const ismMyData = item.sender_id === currentUserId;
    const senderColor = ismMyData ? ME_COLOR : colorForSender(item.sender_id);
    const senderLabel = ismMyData ? "ME" : item.profiles?.username;

    const isHavenInvite = item.is_haven_invite === true;

    // Haven invite gets its own card treatment, distinct from prompt/checkin/nudge bubbles
    if (isHavenInvite) {
      return (
        <View style={styles.messageWrapper}>
          <Text style={styles.inviteSystemLabel}>Haven Invite</Text>
          <Text style={[styles.sender, { color: senderColor }]}>
            {senderLabel}
          </Text>

          <View style={[styles.messageRow, { borderLeftColor: senderColor }]}>
            <View style={styles.inviteCard}>
              <View style={styles.inviteHeaderRow}>
                <View style={styles.inviteIconWrapper}>
                  <Image
                    source={require("../../assets/HavenLogoTransparent.png")}
                    style={{ width: 22, height: 22, resizeMode: "contain" }}
                  />
                </View>
                <Text style={styles.inviteTitleText}>{item.text}</Text>
              </View>

              {ismMyData ? (
                <HavenInviteStatusPill status={item.invite_status} />
              ) : item.invite_status === "pending" ? (
                <View style={styles.inviteActionsRow}>
                  <TouchableOpacity
                    style={styles.inviteAcceptButton}
                    onPress={() =>
                      handleRespondHavenInvite(item.message_id, "accepted")
                    }
                  >
                    <Text style={styles.inviteButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.inviteDeclineButton}
                    onPress={() =>
                      handleRespondHavenInvite(item.message_id, "declined")
                    }
                  >
                    <Text style={styles.inviteButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <HavenInviteStatusPill
                  status={item.invite_status}
                  isRecipient
                />
              )}
            </View>
          </View>
        </View>
      );
    }

    const isPrompt = item.is_prompt === true;
    const isCheckin = item.is_checkin === true;
    const isNudge = item.is_nudge === true;

    return (
      <View style={styles.messageWrapper}>
        <Text style={[styles.sender, { color: senderColor }]}>
          {senderLabel}
        </Text>

        <View
          style={[
            styles.messageRow,
            { borderLeftColor: senderColor },
            isPrompt && styles.promptMessageBubble,
            isCheckin && styles.checkinMessageBubble,
            isNudge && styles.nudgeMessageBubble,
          ]}
        >
          {isPrompt && (
            <View style={styles.promptBadge}>
              <Entypo name="chat" size={12} color="#a5BEA8" />
              <Text style={styles.promptBadgeText}>Prompt</Text>
            </View>
          )}
          {isCheckin && (
            <View style={styles.checkinBadge}>
              <MaterialCommunityIcons
                name="hand-wave"
                size={12}
                color="black"
              />
              <Text style={styles.promptBadgeText}>Mood | Need </Text>
            </View>
          )}
          {isNudge && (
            <View style={styles.nudgeBadge}>
              <MaterialCommunityIcons
                name="gesture-tap"
                size={12}
                color="black"
              />
              <Text style={styles.promptBadgeText}>Nudge</Text>
            </View>
          )}
          <Text
            style={
              isPrompt
                ? styles.promptMessageText
                : isCheckin
                  ? styles.checkinMessageText
                  : isNudge
                    ? styles.nudgeMessageText
                    : styles.messageText
            }
          >
            {item.text}
          </Text>
          <TouchableOpacity
            style={styles.sendUpdateButton}
            onPress={console.log("Pressed")}
          >
            {(isNudge || isCheckin) && (
              <Text style={styles.sendUpdateText}>
                {" "}
                Respond to {otherUserUsername}'s message{" "}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  //-----------------------------------

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Pressable
              onPress={() => navigation?.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="#0b0b0b" />
            </Pressable>

            <TouchableOpacity
              style={styles.profileInfoTouchable}
              onPress={() => {
                navigation.navigate(
                  isHaven
                    ? "ConversationHavenProfileScreen"
                    : "ConversationProfileScreen",
                  { conversationId },
                );
              }}
            >
              {/* dynamic avatar rendering */}
              <Image
                source={{ uri: participantBitmojiIcon }}
                style={styles.avatarImage}
              />

              <View style={styles.nameContainer}>
                <Text style={styles.username}>
                  {participant
                    .filter((p) => p.user_id !== currentUserId)
                    .map((p) => p.profiles?.username)
                    .join(" and ")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.rightSection}>
            <Pressable style={styles.iconCircle}>
              <Ionicons name="call" size={18} color="#000" />
            </Pressable>

            <Pressable style={[styles.iconCircle, styles.iconCircleDisabled]}>
              <Ionicons name="videocam" size={20} color="#000" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Chat area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={listRef}
          data={sortedMessages}
          renderItem={renderMessage}
          keyExtractor={(item, index) =>
            item.message_id?.toString() ?? index.toString()
          }
          contentContainerStyle={styles.messages}
          keyboardShouldPersistTaps="always"
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
        />
        {/* feature pills from plus symbol Haven */}
        {/* only renders if showPills is true */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
          {showPills && (
            <HavenTools
              onHelpPress={handleHelpPress}
              onPromptSelect={(promptText) =>
                sendPromptAsMessage(promptText, conversationId, currentUserId)
              }
            />
          )}

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity>
              <Pressable onPress={() => navigation.navigate("Camera")}>
                <Ionicons name="camera" size={27} color="#000" />
              </Pressable>
            </TouchableOpacity>
            {/* moved arrow up send and mic into textinput */}
            <View style={[styles.defaultPill, isHaven && styles.havenPill]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Chat"
                style={[styles.input, isHaven && styles.havenInput]}
                onSubmitEditing={handleSend}
              />
              {draft.trim().length > 0 ? (
                <TouchableOpacity
                  onPress={handleSend}
                  style={styles.sendButton}
                >
                  <Ionicons name="arrow-up" size={22} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Ionicons name="mic" size={24} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity>
              <Entypo name="emoji-happy" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="images" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              {/* show haven plus symbol or regular game controller, setShowPills*/}
              {isHaven ? (
                <Pressable
                  style={styles.iconCircle}
                  onPress={handleTogglePills}
                >
                  <AntDesign name="plus-circle" size={28} />
                </Pressable>
              ) : (
                <Pressable style={styles.iconCircle}>
                  <Ionicons name="game-controller-outline" size={28} />
                </Pressable>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 4,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 18,
    marginRight: 10,
  },
  nameContainer: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  userStatus: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleDisabled: {
    backgroundColor: "#F7F7F9",
  },
  // message list
  messages: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
  },
  dayDivider: {
    alignSelf: "center",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#A9A9AE",
    marginVertical: 10,
  },
  messageWrapper: {
    marginVertical: 10,
  },
  sender: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  messageRow: {
    borderLeftWidth: 3,
    paddingLeft: 10,
  },

  messageText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#222",
  },

  //bottom half wrapper
  inputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    zIndex: 100,
    elevation: 100,
    position: "relative",
  },
  //input bar
  inputBar: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
  },
  defaultPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#F1F1F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#000",
  },
  //icons and buttons
  emoji: {
    fontSize: 25,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0A84FF",
    justifyContent: "center",
    alignItems: "center",
  },
  sendUpdateButton: {
    marginTop: 10,
    width: "75%",
    borderRadius: 30,
    backgroundColor: "#F8F3E6",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  sendUpdateText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#808080",
  },
  profileInfoTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  //haven coloring
  havenPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#a5BEA8",
    borderRadius: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  //haven prompt message ui
  promptMessageBubble: {
    backgroundColor: "#2E5A44",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#a5BEA8",
  },
  promptBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  promptBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#a5BEA8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  promptMessageText: {
    fontSize: 15,
    color: "#F8F3E6",
    fontWeight: "600",
  },
  checkinMessageText: {
    fontSize: 15,
    color: "#F8F3E6",
    fontWeight: "600",
  },
  //mood need nudges
  checkinMessageBubble: {
    backgroundColor: "#B47100",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2793C",
  },
  checkinBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  checkinBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#a5BEA8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  checkinMessageText: {
    fontSize: 15,
    color: "#F8F3E6",
    fontWeight: "600",
  },
  nudgeMessageBubble: {
    backgroundColor: "#2E5A44",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#2E5A44",
  },
  nudgeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  nudgeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#a5BEA8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nudgeMessageText: {
    fontSize: 15,
    color: "#F8F3E6",
    fontWeight: "600",
  },
  //haven invite card
  inviteSystemLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  inviteCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 16,
    padding: 14,
    maxWidth: 300,
  },
  inviteHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  inviteIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#fefefe",
    justifyContent: "center",
    alignItems: "center",
  },
  inviteTitleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#0b0b0b",
    lineHeight: 21,
  },
  inviteActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  inviteAcceptButton: {
    flex: 1,
    backgroundColor: "#2E5A44",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  inviteDeclineButton: {
    flex: 1,
    backgroundColor: "#B47100",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  inviteButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  inviteStatusPill: {
    backgroundColor: "#F1F1F5",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  inviteStatusAccepted: {
    backgroundColor: "#DDEFE1",
  },
  inviteStatusDeclined: {
    backgroundColor: "#F7E4D3",
  },
  inviteStatusTextPending: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  inviteStatusTextAccepted: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E5A44",
  },
  inviteStatusTextDeclined: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B47100",
  },
});
