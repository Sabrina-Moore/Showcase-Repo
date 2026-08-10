//status on ChatScreen and ConversationScreen 
//loads message
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
import { Ionicons, Entypo } from "@expo/vector-icons"; //entypo for importing happy face emoji and images icon
import { supabase } from "../../utils/hooks/supabase";
import getStatusLabel from "../../utils/hooks/getStatusLabel";
import timeAgo from "../../utils/hooks/timeAgo";

export default function MessageStatus({  latestMessageSent,
  statusLabel,
  timeAgo,
  isHaven,
}) {
    if (!latestMessageSent) { 
        return null; 
    }

    return (
    <View>
        <View style={styles.container}>
            {isHaven ? (
                <Image source={require("../../assets/HavenLogo.png")} style={styles.havenIcon} />
            ) : (
                <Ionicons name="chatbox" size={16} color="#0A84FF" style={{ marginRight: 4, transform: [{ scaleX: -1 }]}}  />
            )}
            <Text style={isHaven ? styles.statusTextHaven : styles.statusText}>
                {statusLabel}{timeAgo ? ` · ${timeAgo}` : ""}
            </Text>
        </View>
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