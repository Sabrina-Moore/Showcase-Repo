import { Image, Text, View, Button, StyleSheet, Pressable } from "react-native";
import { supabase } from "../../utils/hooks/supabase";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useAuthentication } from "../../utils/hooks/useAuthentication";

const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Handle successful sign out (e.g., redirect to login screen)
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export default function ProfileScreen() {

  const navigation = useNavigation();
  const { user } = useAuthentication();
  
  //fetch user profile from avatar_url in profiles
  useEffect(() => {
      const fetchProfileBitmoji = async () => {
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
            .select("username")
            .eq("user_id", uid)
            .single();
          if (profile?.username) setCurrentUserName(profile.username);
        }
      };
      fetchUser();
    }, []);

 
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={{ uri: "https://i.imgur.com/FxsJ3xy.jpg" }}
        style={{ width: 150, height: 150, borderRadius: 150 / 2 }}
      />
      <Text
        style={{
          justifyContents: "center",
          textAlign: "center",
        }}
      >
        {user &&
          user.user_metadata &&
          user.user_metadata.email.slice(
            0,
            user.user_metadata.email.indexOf("@"), // gets part before @ of email address, should use profile username instead
          )}
      </Text>
      <Button
        onPress={() => {
          navigation.navigate("Profile");
        }}
        title="My Account"
        color="#841584"
      />
      <Pressable>
        <Button
          onPress={() => {
            navigation.navigate("Settings", {});
          }}
          title="Settings"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignItems: "center",
  },
});
