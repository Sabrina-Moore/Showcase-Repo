//status on ChatScreen and ConversationScreen
//states if Haven or not and last time a message was sent

import React from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons"; //entypo for importing happy face emoji and images icon
import { supabase } from "../../utils/hooks/supabase";
import getStatusLabel from "../../utils/hooks/getStatusLabel";
import timeAgo from "../../utils/hooks/timeAgo";

export default function MessageStatus({ chat }) {
    if (!chat?.latest_message_sent) { 
        return null; 
    }

    return (
    <View>
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
);
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: "row", 
    alignItems: "center", 
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