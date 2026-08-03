import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../utils/hooks/supabase";



export default function ConversationScreen({ route, navigation}) {

    const insets = useSafeAreaInsets();
    const event = route?.params?.event;

    const [currentUserId, setCurrentUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draft, setDraft] = useState("");
    const [isSending, setIsSending] = useState(false);


  const listRef = useRef();


  // who's actually sending messages
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching current user:", error);
                return;
            }
            setCurrentUserId(data?.user?.id ?? null);
        };
        fetchUser();
    }, []);

     const fetchMessages = async () => {
        if (!event?.id) return;

        setIsLoading(true);

        const { data, error } = await supabase
            .from("event_chat_messages")
            .select("id, event, user_id, body, created_at, profiles:user_id(userName, avatar)")
            .eq("event", Number(event.id))
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching chat messages:", error);
            setMessages([]);
        } else {
            setMessages(data ?? []);
        }

        setIsLoading(false);
    };


     useEffect(() => {
        fetchMessages();
    }, [event?.id]);

    // live updates — new messages from anyone (including other devices)
    // show up without needing to pull-to-refresh
    useEffect(() => {
        if (!event?.id) return;

        const channel = supabase
            .channel(`event-chat-${event.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "event_chat_messages",
                    filter: `event=eq.${event.id}`,
                },
                () => {
                    // simplest correct approach: refetch on any insert rather
                    // than trying to patch the new row's profile join in
                    // manually from the realtime payload alone
                    fetchMessages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [event?.id]);

    const handleSend = async () => {
        const body = draft.trim();
        if (!body || !currentUserId || !event?.id || isSending) return;

        setIsSending(true);
        setDraft(""); // clear right away, feels more responsive

        const { error } = await supabase.from("event_chat_messages").insert({
            event: Number(event.id),
            user_id: currentUserId,
            body,
        });

        if (error) {
            console.error("Error sending message:", error);
            setDraft(body); // put it back so they don't lose what they typed
        }

        setIsSending(false);
    };


  function renderMessage({ item }) {
    return (
      <View style={styles.messageWrapper}>
        <Text
          style={[
            styles.sender,
            {
              color: item.color,
            },
          ]}
        >
          {item.name}
        </Text>

        <View
          style={[
            styles.messageRow,
            {
              borderLeftColor: item.color,
            },
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  }

  return (
           <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={insets.top}
        >
            {/* Custom header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity
                    style={styles.headerBack}
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate("Postcard");
                        }
                    }}
                    hitSlop={8}
                >
                    <Ionicons name="chevron-back" size={28} color="#000000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {event?.title ? `${event.title} Chat` : "Event Chat"}
                </Text>
            </View>
            <View style={styles.headerDivider} />

            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() =>
                    listRef.current?.scrollToEnd({ animated: true })
                }
                renderItem={({ item }) => {
                    const isSelf = item.user_id === currentUserId;

                    return (
                        <View
                            style={[
                                styles.messageRow,
                                isSelf && styles.messageRowSelf,
                            ]}
                        >
                            {!isSelf && (
                                <Image
                                    source={{ uri: item.profiles?.avatar }}
                                    style={styles.avatar}
                                />
                            )}

                            <View
                                style={[
                                    styles.bubble,
                                    isSelf ? styles.bubbleSelf : styles.bubbleOther,
                                ]}
                            >
                                {!isSelf && (
                                    <Text style={styles.author}>
                                        {item.profiles?.userName ?? "Someone"}
                                    </Text>
                                )}
                                <Text
                                    style={[
                                        styles.body,
                                        isSelf && styles.bodySelf,
                                    ]}
                                >
                                    {item.body}
                                </Text>
                                <Text
                                    style={[
                                        styles.time,
                                        isSelf && styles.timeSelf,
                                    ]}
                                >
                                    {new Date(item.created_at).toLocaleTimeString([], {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        {isLoading
                            ? "Loading messages..."
                            : "No messages yet — say hi 👋"}
                    </Text>
                }
            />

            <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
                <TextInput
                    style={styles.input}
                    value={draft}
                    onChangeText={setDraft}
                    placeholder="Message"
                    placeholderTextColor="#8E8E93"
                    multiline
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        !draft.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!draft.trim() || isSending}
                >
                    <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  avatar: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: "#FFFC00",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    flex: 1,
  },

  headerIcons: {
    flexDirection: "row",
    gap: 18,
  },

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
});






// <View style={styles.container}>
//       {/* HEADER */}

//       {/* <View style={styles.header}>
//         <Ionicons name="chevron-back" size={32} />

//         <View style={styles.avatar}>
//           <Text>🙂</Text>
//         </View>

//         <Text style={styles.username}>{chatbotName}</Text>

//         <View style={styles.headerIcons}>
//           <Ionicons name="call" size={23} />

//           <Ionicons name="videocam" size={25} />
//         </View>
//       </View> */}

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <FlatList
//           ref={listRef}
//           data={messages}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.messages}
//         />

//         {/* INPUT AREA */}

//         {/* INPUT AREA */}

//         <View style={styles.inputBar}>
//           {/* Camera */}
//           <TouchableOpacity>
//             <Ionicons name="camera" size={27} color="#000" />
//           </TouchableOpacity>

//           {/* Text Input */}
//           <TextInput
//             value={message}
//             onChangeText={setMessage}
//             placeholder="Chat"
//             style={styles.input}
//             onSubmitEditing={sendMessage}
//           />

//           {/* Dynamic Button */}
//           {message.length > 0 ? (
//             <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
//               <Ionicons name="arrow-up" size={22} color="white" />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity>
//               <Ionicons name="mic" size={24} />
//             </TouchableOpacity>
//           )}

//           {/* Emoji */}
//           <TouchableOpacity>
//             <Text style={styles.emoji}>🙂</Text>
//           </TouchableOpacity>

//           {/* Plus */}
//           <TouchableOpacity>
//             <Ionicons name="add-circle-outline" size={28} />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>