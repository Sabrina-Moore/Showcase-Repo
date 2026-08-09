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
import { Ionicons, Entypo } from "@expo/vector-icons"; //entypo for importing happy face emoji and images icon
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "../../utils/hooks/supabase";

import CameraScreen from "./CameraScreen"; //functionality for camera button
import HavenTools from "../components/HavenTools";

//global colors for users
// Color used for the current user's own messages ("ME" label + border).
const ME_COLOR = "#FF375F";
// Palette used to color-code other senders (name label + left border).
const SENDER_COLORS = [
  "#0A84FF",
  "#34C759",
  "#FF9500",
  "#AF52DE",
  "#00C7BE",
  "#FFD60A",
];

function colorForSender(senderId) {
  if (!senderId) return SENDER_COLORS[0];
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SENDER_COLORS[Math.abs(hash) % SENDER_COLORS.length];
}


export default function ConversationScreen({ route, navigation }) {
  const { conversationId , isHaven: HavenMode } = route.params ?? {};
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("Me");
  const [userBitmoji, setUserBitmoji] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [profiles, setProfiles] = useState(null);

  const [isHaven, setIsHaven] = useState(HavenMode ?? false); //flag for haven toolkit toggle
  const [showPills, setShowPills] = useState(false); //sets feature pills toggle from plus symbol


  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const listRef = useRef();

//feature pills persist for only a few seconds and goes away
  const handleTogglePills = () => {
  setShowPills(true);

  setTimeout(() => {
    setShowPills(false);
  }, 6000);
};

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
          .select(`
            username
            user_id,
            avatar_url`)
          .eq("user_id", uid)
          .single();
        if (profile?.username) setCurrentUserName(profile.username); //set state for username

        setUserBitmoji(profiles?.avatar_url ?? null); //set state for avatar_url
      }
    };
    fetchUser();
  }, []);

  //------------------------------
  //fetch conversation participants
  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from("conversation_members")
      .select(`
        user_id,
        profiles (username, avatar_url)`,)
      .eq("conversation_id", conversationId);

    if (error) {
      console.error("Error fetching participants:", error);
      return;
    }
    console.log("Participants:", JSON.stringify(data, null, 2));
    console.log("Participant error:", error);
    setParticipants(data ?? []);
  };

  useEffect(() => {
    fetchParticipants();
  }, [conversationId]);

  //------------------------------
  //getting messages from database
  const fetchMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    console.log("Inside message fetch");

    const { data, error } = await supabase
      .from("messages")
      .select(
        `message_id, conversation_id, sender_id, text, created_at,
        profiles (user_id, username, avatar_url)`,
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
  // realtime messaging
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation-${conversationId}`)
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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

    return (
      <View style={styles.messageWrapper}>
        <Text style={[styles.sender, { color: senderColor }]}>
          {senderLabel}
        </Text>

        <View style={[styles.messageRow, { borderLeftColor: senderColor }]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  }
  //-----------------------------------
  //fetching profile avatar
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id) // if profiles.id matches auth.users.id
        .single();
      if (!error) {
        setProfiles(data);
      }
    };
    fetchProfile();
  }, []);

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
              onPress={() =>
                navigation.navigate("ConversationProfileScreen", {
                  chatbotName:
                    participants
                      .map((p) => p.profiles?.username)
                      .filter(Boolean)
                      .join(", ") || "Best Friend",
                })
              }
            >
              {/* dynamic avatar rendering */}
              <Image
              source={ {uri: userBitmoji }}
                style={styles.avatarImage}
              />

              <View style={styles.nameContainer}>
                <Text style={styles.username}>
                  {participants.map((p) => p.profiles?.username).join(", ")}
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={listRef}
          data={sortedMessages}
          renderItem={renderMessage}
          keyExtractor={(item, index) =>
            item.message_id?.toString() ?? index.toString()
          }
          contentContainerStyle={styles.messages}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
        />
        {/* feature pills from plus symbol Haven */}
        {/* only renders if showPills is true */}
        <View style={styles.inputContainer}>
          {showPills && <HavenTools />}

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity>
              <Pressable onPress={() => navigation.navigate("Camera")}>
                <Ionicons name="camera" size={27} color="#000" />
              </Pressable>
            </TouchableOpacity>
            {/* moved arrow up send and mic into textinput */}
            <View style={[styles.inputPill, isHaven && styles.havenInputPill]}>
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
    overflow: "visible",
    backgroundColor: "transparent",
    zIndex: 10,
    elevation: 10,
  },
  //input bar
  inputBar: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
    marginBottom: 20,
  },
  inputPill: {
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
  profileInfoTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  //haven coloring
   havenInputPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#a5BEA8",
    borderRadius: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
});
