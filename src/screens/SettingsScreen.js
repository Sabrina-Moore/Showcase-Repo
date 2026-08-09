import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, TextInput, Image, ScrollView } from "react-native";
import { supabase } from "../../utils/hooks/supabase";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

export default function SettingsScreen() {
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("01/01/1998"); // Default random date
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingDateOfBirth, setEditingDateOfBirth] = useState(false);
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);

  useEffect(() => {
    if (user !== null) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles") // Replace with your table name
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setDisplayName(data.username || user.email.split("@")[0]);
      setEmail(data.email || user.email);
      setDateOfBirth(data.birthday || "01/01/1998");
      setProfilePictureUrl(
        data.bitmoji_icon ||
          "https://image.cnbcfm.com/api/v1/image/100703713-Rubber%20duck%20in%20hk.jpg?v=1532564692&w=1600&h=900",
      ); // Default URL
      setInitialDisplayName(data.username || user.email.split("@")[0]);
      setInitialEmail(data.email || user.email);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setLoading(false);
    }
  };

  const saveProfilePicture = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ bitmoji_icon: profilePictureUrl })
        .eq("user_id", user.id);

      if (error) throw error;

      setEditingProfilePicture(false);
      setProfilePictureUrl(profilePictureUrl);
    } catch (error) {
      console.error("Error updating profile picture URL:", error.message);
    }
  };

  const saveDisplayName = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ username: displayName })
        .eq("user_id", user.id);

      if (error) throw error;

      setEditingDisplayName(false);
      setInitialDisplayName(displayName);
    } catch (error) {
      console.error("Error updating display name:", error.message);
    }
  };

  const saveEmail = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ email })
        .eq("user_id", user.id);

      if (error) throw error;

      setEditingEmail(false);
      setInitialEmail(email);
    } catch (error) {
      console.error("Error updating email:", error.message);
    }
  };

  const saveDateOfBirth = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Replace with your table name
        .update({ birthday: dateOfBirth })
        .eq("user_id", user.id);

      if (error) throw error;

      setEditingDateOfBirth(false);
    } catch (error) {
      console.error("Error updating date of birth:", error.message);
    }
  };

  const cancelEditProfilePicture = () => {
    setProfilePictureUrl(profilePictureUrl);
    setEditingProfilePicture(false);
  };

  const cancelEditDisplayName = () => {
    setDisplayName(initialDisplayName);
    setEditingDisplayName(false);
  };

  const cancelEditEmail = () => {
    setEmail(initialEmail);
    setEditingEmail(false);
  };

  const cancelEditDateOfBirth = () => {
    setDateOfBirth("01/01/1998");
    setEditingDateOfBirth(false);
  };

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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView
      style={styles.container}
      >
        {/* Header */}

      <Text> Settings here </Text>

        {/* Avatar Picture */}




        {/* Profile tags with info like birthday */}

      <Button onPress={handleSignOut} title="Log Out" />

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  banner:{
    height: 320,
    backgroundColor: "#1f2b24",
    justifyContent: "flex-start",
  },
  topBar:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 15,
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
  settingBar: {
    marginTop: 10,
  },

  //input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
  },

  //buttons and icons
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iconText: { 
    color: "#fff", 
    fontSize: 20 
  },
 
  //signout button
   signOutButton: {
    marginHorizontal: 16,
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: "center",
  },
  //profile
avatarWrapper: { 
  width: 100, 
  height: 100 
},
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3a3a3c",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
});



