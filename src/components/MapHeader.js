import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../utils/hooks/supabase";

export default function MapHeader({
  cityName = "Santa Monica",
  temperature = "76 °F",
}) 
{

   const [currentUserBitmojiIcon, setCurrentUserBitmojiIcon] = useState(null); //sets current user bitmoji
  const [currentUserId, setCurrentUserId] = useState(null);
  
    //fetching user bitmoji
    useEffect(() => {
        const fetchAvatar = async () => {
          const { data, error } = await supabase.auth.getUser(); //requests authentication data
          if (error) {
            console.error(error);
            return;
          }
          const uid = data?.user?.id ?? null; //extracts the users id or null
          setCurrentUserId(uid);
          console.log("Inside data fetch for current user");
    
          if (uid) {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("bitmoji_icon")
              .eq("user_id", uid) //searching for avatars based on user_id
              .single();
            if (profile?.bitmoji_icon) setCurrentUserBitmojiIcon(profile.bitmoji_icon);
  
            console.log("BITMOJI VALUE:", profile?.bitmoji_icon);
            console.log("uid:", uid);
            console.log("profile:", profile);
            console.log("error:", error);
          }
        };
        fetchAvatar();
      }, []);
  
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.rightHeaderGroup}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarImage}
            source={{uri: currentUserBitmojiIcon}}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.cityName}>{cityName}</Text>
          <View style={styles.weatherRow}>
            <Ionicons name="sunny-outline" size={20} color="#FFFFFF" />
            <Text style={styles.tempText}>{temperature}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 1,
    right: 16,
    left: 0,
    alignItems: "flex-end",
    zIndex: 10,
  },
  rightHeaderGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#00A8FF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 200,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    alignItems: "flex-start",
  },
  cityName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginLeft: 20,
  },
  tempText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
