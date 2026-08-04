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

  const [userBitmoji, setUserBitmoji] = useState(null);
  
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
            .select("avatar_url")
            .eq("user_id", uid)
            .single();
          if (profile?.avatar_url) setUserBitmoji(profile.avatar_url);
        }
      };
      fetchProfileBitmoji();
    }, []);

 
  return (
    <View style={{ alignItems: "center" }}>
      {userBitmoji ? (
      <Image
        source={{ uri: userBitmoji}}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
        }}
      />
    ) : (
      <Text>No avatar</Text>
    )}
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
