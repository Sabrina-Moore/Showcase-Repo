import React from "react";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";

import { supabase } from "../../utils/hooks/supabase";

//screen should show all chats that the logged-in. user belongs to
console.log("ChatScreen file loaded");

export default function ChatScreen({ navigation }) {

  console.log("ChatScreen rendered");

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadConversations();
  }, []);

  
  //----------------------
  async function loadConversations() {
    console.log("loadConversations started");

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  console.log("Session:", sessionData.session);
  console.log("Session error:", sessionError);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("Logged in user:", user);
  console.log("User error:", userError);

  if (!user) return;

  if(!user) return;

  
  const {data, error } = await supabase
  .from("conversation_members")
  .select(`conversation_id, 
    profiles (user_id, username, avatar_url)` )
  .eq("user_id", user.id);

  if(error){
    console.error(error);
    return;
  }

  console.log("Inside loadConversation:", data);
  setConversations(data);
  setLoading(false);
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

      {conversations.map((chat) => (
        <TouchableOpacity
          key={chat.profiles?.username}
          style={styles.userButton}
          onPress={() =>
            navigation.navigate("Conversation", {
              conversationId: chat.conversation_id,
            })
          }
        >
          <Ionicons name="person-circle" size={48} color="#D8D8D8" />

          <Text style={styles.username}>
            {chat.profiles?.username}
          </Text>

          <Ionicons name="camera-outline" size={24} color="#999" />
        </TouchableOpacity>
      ))}
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
});
