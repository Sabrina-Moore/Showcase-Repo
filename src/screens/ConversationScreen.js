import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { supabase } from "../../utils/hooks/supabase";

//Adding realtime chat functionality

export default function ConversationScreen({ route, navigation }) {

  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("Me");
  const [participants, setParticipants] = useState([]);


  const { conversationId } = route.params;
  console.log("Opening conversation:", conversationId);

  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
 
  
  const listRef = useRef();
 
  //event listening for user typing in chat

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

            if (uid) { //if authenticated user exists
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("user_id", uid)
                    .single();
                if (profile?.userName) setCurrentUserName(profile.userName); 
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
        profiles (
          username,
          avatar_url
        )
      `)
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
          profiles (user_id, username, avatar_url)`
      )
      .eq("conversation_id", conversationId)
      .order("created_at", {ascending: true});

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
                }
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
        setDraft(""); // clear right away, feels more responsive

        const { error } = await supabase
        .from("messages")
        .insert({
            conversation_id: conversationId,
            sender_id: currentUserId,
            text: body,
        });

        if (error) {
            console.error("Error sending message:", error);
            setDraft(body); // put it back so they don't lose what they typed
        }

        setIsSending(false);
    };

  //-----------------------------------
  function renderMessage({ item }) {

    const ismMyData = item.sender_id === currentUserId;

    return (
      <View
      style={{
        alignSelf: ismMyData ? "flex-end" : "flex-start",
        marginVertical: 8,
        maxWidth: "80%",
      }}
    >
      {!ismMyData && (
        <Text style={styles.sender}>
          {item.profiles?.username}
        </Text>
      )}

      <View
        style={{
          backgroundColor: ismMyData ? "#0A84FF" : "#ECECEC",
          padding: 12,
          borderRadius: 18,
        }}
      >
        <Text
          style={{
            color: ismMyData ? "white" : "black",
          }}
        >
          {item.text}
        </Text>
      </View>
    </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Pressable onPress={() => navigation?.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#0b0b0b" />
            </Pressable>
          
            {/* <Image
              source={{ uri: "https://loremflickr.com/140/140" }}
              style={styles.avatarImage}
            />

            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{chatbotName}</Text>
              <Text style={styles.userStatus}>Pico, Santa Monica · 33m</Text>
            </View> */}

            {/* added this */}
            <TouchableOpacity
              style={styles.profileInfoTouchable}
              onPress={() =>
                navigation.navigate("ConversationProfileScreen", { chatbotName })
              }
            >
              <Image
                source={{ uri: "https://loremflickr.com/140/140" }}
                style={styles.avatarImage}
              />

            <View style={styles.nameContainer}>
              <Text style={styles.username}>
                {participants
                  .map((p) => p.profiles?.username)
                  .join(", ")}
              </Text>
            </View>
            </TouchableOpacity>
          </View>

          <View style={styles.rightSection}>
            <Pressable style={styles.iconCircle}>
              <Ionicons name="call" size={18} color="#000" />
            </Pressable>

            <Pressable style={styles.iconCircle}>
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
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
        />
{/* Input bar */}
        <View style={styles.inputBar}>   
          <TouchableOpacity>
            <Ionicons name="camera" size={27} color="#000" />
          </TouchableOpacity>

          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Chat"
            style={styles.input}
            onSubmitEditing={handleSend}
          />

          {draft.trim().length > 0 ? (
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="arrow-up" size={22} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="mic" size={24} />
            </TouchableOpacity>
          )}

          <TouchableOpacity>
            <Text style={styles.emoji}>🙂</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={28} />
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  nameContainer: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
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
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ORIGINAL STYLES */
  messages: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  messageWrapper: {
    marginVertical: 7,
  },

  sender: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },

  messageRow: {
    borderLeftWidth: 3,
    paddingLeft: 8,
  },

  messageText: {
    fontSize: 18,
    color: "#222",
  },

  inputBar: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#F1F1F5",
    borderRadius: 20,
    paddingHorizontal: 18,
    fontSize: 17,
  },

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
  
});