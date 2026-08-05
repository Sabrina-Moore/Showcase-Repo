import React, { useState, useEffect } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";

import { supabase } from "../../utils/hooks/supabase";

export default function ChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return;

    const { data, error } = await supabase
      .from("conversation_members")
      .select(
        `conversation_id, user_id, profiles (user_id, username, avatar_url)`,
      );

    if (error) {
      console.error(error);
      return;
    }

    //filtering for other participants in conversation - for conversation name
    const searchConversations = data
      .filter((member) => member.user_id === user.id) //filter for conversations user is in
      .map((myConversation) => {
        const otherParticipant = data.find(
          (member) =>
            member.conversation_id === myConversation.conversation_id &&
            member.user_id !== user.id,
        ); //find users not me

        return {
          conversation_id: myConversation.conversation_id,
          otherParticipant: otherParticipant?.profiles,
        };
      });

    setConversations(searchConversations);
    console.log(JSON.stringify("Set Conversations data:", data, null, 2));
    setLoading(false);
  }

  const handleLongPress = (chat) => {
    setSelectedChat(chat);
    setModalVisible(true);
  };

  const username = selectedChat?.otherParticipant?.username || "User";
  const avatarUrl = selectedChat?.otherParticipant?.avatar_url;

  console.log("Avatar URL:", avatarUrl);
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

      {/* navigating to conversation profile with press*/}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.conversation_id.toString()}
        renderItem={({ item: chat }) => (
          <TouchableOpacity
            style={styles.userButton}
            onPress={() =>
              navigation.navigate("Conversation", {
                conversationId: chat.conversation_id,
              })
            }
            onLongPress={() => handleLongPress(chat)}
            delayLongPress={300}
          >
            <Ionicons name="person-circle" size={48} color="#D8D8D8" />
            <Text style={styles.username}>
              {chat.otherParticipant?.username}
            </Text>
            <Ionicons name="camera-outline" size={24} color="#999" />
          </TouchableOpacity>
        )}
      />

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
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
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
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
  },
  username: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "600",
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
});
