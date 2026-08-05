import { Text, View, StyleSheet, Button, Image } from "react-native";
import { colors } from "../../assets/themes/colors";
import { fontHeader } from "../../assets/themes/font";
import { Followers, More, Search } from "../../assets/snapchat/HeaderIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfileScreen";
import AddFriendScreen from "../screens/AddFriendScreen";

import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchScreen from "../screens/SearchScreen";
import { useState, useEffect } from "react";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { supabase } from "../../utils/hooks/supabase";

import SelectionMenu from "./SelectionMenu";
const Stack = createStackNavigator();

export default function Header({ title }) {

    const [showMenu, setShowMenu] = useState(false); //what is this template code? 

  const navigation = useNavigation();
  const [profilePic, setProfilePic] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  //const { user } = useAuthentication();

    //fetching user avatars
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
            .select("avatar_url")
            .eq("user_id", uid) //searching for avatars based on user_id
            .single();
          if (profile?.avatar_url) setProfilePic(profile.avatar_url);

          console.log("Setting profile pic:", profile.avatar_url);
          console.log("uid:", uid);
          console.log("profile:", profile);
          console.log("error:", error);
        }
      };
      fetchAvatar();
    }, []);



  // console.log(showMenu);

  // const handleClick = () => {
  //   setShowMenu(true)
  //   console.log("handleClick")
  // }

  return (
    <View style={styles.container}>
      <View style={styles.headerLeft}>
        <Pressable
          style={[styles.profile, styles.buttons]}
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
         {profilePic ? (
            <Image style={styles.profileImage} source={{ uri: profilePic }} />
          ) : (
            <Ionicons name="person-circle" size={44} color="#D8D8D8" />
          )}
        </Pressable>
        <Pressable
          style={[styles.search, styles.buttons]}
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          <Search />
        </Pressable>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.headerRight}>
        <Pressable
          style={[styles.followers, styles.buttons]}
          onPress={() => {
            navigation.navigate("AddFriend");
          }}
        >
          <Followers />
        </Pressable>

        <Pressable title="Open Bottom Sheet" onPress={() => setShowMenu(true)}>
          <View style={[styles.more, styles.buttons]}>
            <More />
          </View>
        </Pressable>
        {/* {showMenu && <SelectionMenu/>} */}
        <SelectionMenu showMenu={showMenu} setShowMenu={setShowMenu} />
      </View>
    </View>
  );
}

let screenOptions = {
  tabBarShowLabel: false,
  headerLeft: () => (
    <Button
      onPress={() => {
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            user = null;
          })
          .catch((error) => {
            // An error happened.
            // should we do something with that error??
          });
      }}
      title="Log Out"
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    color: colors.primary,
    fontSize: fontHeader.fontSize,
    fontFamily: fontHeader.fontFamily,
    fontWeight: fontHeader.fontWeight,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  buttons: {
    borderRadius: 100,
    height: 44,
    width: 44,
    backgroundColor: colors.interactionGraySubtle,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
