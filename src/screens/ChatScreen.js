import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from "../components/Header";
import { supabase } from "../../utils/hooks/supabase";

import getStatusLabel from "../../utils/hooks/getStatusLabel";
import timeAgo from "../../utils/hooks/timeAgo";

export default function ChatScreen({ navigation }) {
  console.log("ChatScreen rendered/mounted");

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [otherBitmojiIcon, setOtherBitmojiIcon] = useState(null); //set conversation members user bitmoji
  const [conversations, setConversations] = useState([]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const username = selectedChat?.otherParticipant?.username || "User";

  //render conversations
  async function loadConversations() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return;

  const { data, error } = await supabase
    .from("conversation_members")
    .select(`conversation_id, user_id, profiles (user_id, username, bitmoji_icon)`);
  if (error) return;

  const searchConversations = data
    .filter((member) => member.user_id === user.id)
    .map((myConversation) => {
      const otherParticipant = data.find(
        (member) =>
          member.conversation_id === myConversation.conversation_id &&
          member.user_id !== user.id,
      );
      return {
        conversation_id: myConversation.conversation_id,
        otherParticipant: otherParticipant?.profiles,
      };
    });
  console.log("searchConversations", searchConversations);

  const conversationIds = searchConversations.map((c) => c.conversation_id);

  //fetch if is_haven is true for conversation
  const { data: conversationRows, error: havenError } = await supabase
  .from("conversations")
  .select("conversation_id, is_haven")
  .in("conversation_id", conversationIds);

if (havenError) {
  console.error("Error fetching Haven status:", havenError);
}

const havenByConversation = {};
(conversationRows ?? []).forEach((c) => {
  havenByConversation[c.conversation_id] = c.is_haven === true;
});


  //search for latest message
  const { data: latestMessages, error: msgError } = await supabase
    .from("messages")
    .select("conversation_id, text, sender_id, created_at, is_prompt")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });
  console.log("6: latestMessages", latestMessages, "error", msgError);

  const latestByConversation = {};
  (latestMessages ?? []).forEach((msg) => {
    if (!latestByConversation[msg.conversation_id]) {
      latestByConversation[msg.conversation_id] = msg;
    }
  });

  const withStatus = searchConversations.map((c) => {
    const latestMsg = latestByConversation[c.conversation_id];
    return {
      ...c,
      latest_message_sent: latestMsg?.created_at ?? null,
      status_label: getStatusLabel(latestMsg, user.id),
      time_ago: timeAgo(latestMsg?.created_at),
      is_haven: havenByConversation[c.conversation_id] ?? false,
    };
  });
  console.log("7: withStatus", withStatus);

  withStatus.sort((a, b) => {
    if (!a.latest_message_sent) return 1;
    if (!b.latest_message_sent) return -1;
    return new Date(b.latest_message_sent) - new Date(a.latest_message_sent);
  });

  setConversations(withStatus);
}

  useFocusEffect (
    React.useCallback(() => {
      loadConversations();
    }, [])
  );

  const handleLongPress = (chat) => {
    setSelectedChat(chat);
    setOtherBitmojiIcon(chat.otherParticipant?.bitmoji_icon || null);
    setModalVisible(true);
  };

  const handleNewChat = (chat) => {
    console.log("Pressed new chat");
  };


  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          marginBottom: tabBarHeight,
        },
      ]}
    >
      <Header title="Chat" />

      {/* renders the chat */}
      {/* navigating to conversation profile with press*/}
      {/* renders status "New Chat time" and "Sent time" */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.conversation_id.toString()}
        renderItem={({ item: chat }) => (
          <TouchableOpacity
            style={ styles.chatBorder}
            onPress={() =>
              navigation.navigate("Conversation", {
                conversationId: chat.conversation_id,
              })
            }
            onLongPress={() => handleLongPress(chat)}
            delayLongPress={300}
          >
          {chat.otherParticipant?.bitmoji_icon ? (
            <Image source={{ uri: chat.otherParticipant.bitmoji_icon }} style={[styles.listAvatar, chat.is_haven && styles.havenAvatarBorder]} />
          ) : (
            <Ionicons name="person-circle" size={48} color="#D8D8D8" />
          )}
          <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.username}>
                {chat.otherParticipant?.username}
              </Text>
              {chat.latest_message_sent && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                {chat.is_haven ? (
                  <Image source={require("../../assets/HavenLogo.png")} style={styles.havenIcon} />
                ) : (
                  <Ionicons name="chatbox" size={16} color="#0A84FF" style={{ marginRight: 4, transform: [{ scaleX: -1 }]}}  />
                )}
                <Text style={chat.is_haven ? styles.statusTextHaven : styles.statusText}>
                  {chat.status_label}{chat.time_ago ? ` · ${chat.time_ago}` : ""}
                </Text>
              </View>
              )}
            </View>
            <Ionicons name="camera-outline" size={24} color="#999" />
          </TouchableOpacity>
        )}
      />
      {/* new chat button */}
      <Pressable
      style={styles.newChatButton}
      onPress={handleNewChat}>
        <MaterialCommunityIcons name="message-draw" size={24} color="black" style={{ transform: [{ scaleX: -1 }] }} />
      </Pressable>

      {/* --- Snapchat Style Modal --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          {/* Stops tap events inside modal content from closing the modal */}
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Top Profile Card */}
              <View style={styles.card}>
                <TouchableOpacity style={styles.profileHeader}>
                  {otherBitmojiIcon ? (
                    <Image
                      source={{ uri: otherBitmojiIcon }}
                      style={styles.avatarImage}
                    />
                  ) : null}

                  <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>{username}</Text>
                    <Text style={styles.profileSubtext}>View Friendship</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>

                {/* Quick Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionCircleButton}>
                    <Ionicons name="camera" size={22} color="#000" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionCircleButton}>
                    <Ionicons name="chatbubble" size={20} color="#000" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionCircleButton}>
                    <Ionicons name="call" size={20} color="#000" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionCircleButton}>
                    <Ionicons name="videocam" size={22} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Menu Items Card in modal*/}
              <View style={styles.card}>
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Pin as your #1 BFF ❤️</Text>
                  <View style={styles.radioOutline} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Manage Friendship</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>
                    Chat and Notification Settings
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>
                    Create a Group with {username}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("WelcomeToHavenScreen", {
                      conversationId: selectedChat?.conversation_id,
                    });
                  }}
                >
                  <Text style={styles.menuItemText}>
                    Create a Haven with {username}
                  </Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>New</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Story Settings</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Locations Settings</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <View>
                    <Text style={styles.menuItemText}>Privacy Settings</Text>
                    <Text style={styles.menuSubtext}>My Story</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomWidth: 0 }]}
                >
                  <Text style={styles.menuItemText}>Locations Settings</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Bottom Done Button */}
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatBorder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#D1D1D6",
  },
  username: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "600",
  },
  newChatButton: {
  position: "absolute",
  bottom: 20,
  right: 20,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: "#FFDE59", // Snapchat-yellow, swap for your own accent
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  modalContainer: {
    maxHeight: "90%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 12,
    overflow: "hidden",
  },

  // Profile Header Card
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  listAvatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
},
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  profileSubtext: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  actionCircleButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },

  // Menu Options
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  menuSubtext: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  radioOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#C7C7CC",
  },
  newBadge: {
    backgroundColor: "#0091FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  // Done Button
  doneButton: {
    backgroundColor: "#E5E5EA",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
//haven
  havenAvatarBorder: {
    borderWidth: 2,
    borderColor: "#a5bEA8",
    backgroundColor: "rgba(165, 190, 168, 0.25)",
  },
  //statusLabel Haven
  havenIcon: {
    width: 16, 
    height: 16,
    marginRight: 4,
  },
  statusText: {
  fontSize: 13,
  color: "#0A84FF",
  marginTop: 2,
  },
  statusTextHaven: {
    fontSize: 13,
  color: "#2E5A44",
  marginTop: 2,
  },
});
