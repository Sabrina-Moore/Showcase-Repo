import { Image, Text, View, ScrollView, Button, StyleSheet, Pressable } from "react-native";
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

  const [currentUserId, setCurrentUserId] = useState(null);
  const [userBitmoji, setUserBitmoji] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(null);

  
  //fetch user profile from profiles (avatar_url, username, email)
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
          const { data: profile, error:profileError } = await supabase
            .from("profiles")
            .select("username, email, avatar_url")
            .eq("user_id", uid)
            .single();

          if(profileError){
            console.log("Profile fetch error:", profileError);
            return;
          }

           console.log("Profile:", profile);
           
          if(profile){
            setUserBitmoji(profile.avatar_url);
            setEmail(profile.email);
            setUsername(profile.username);
          }

        }

      };
      fetchProfileBitmoji();
    }, []);

 
  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.bitmojiContainer}>
          {userBitmoji ? (
          <Image
            source={{ uri: userBitmoji }}
            style={styles.avatar}
          />
          ) : null}
        </View>
      <Pressable>
        <Button
          onPress={() => {
            navigation.navigate("Settings", {});
          }}
          title="Settings"
        />
      </Pressable>

      {/* content below bitmoji image */}

        <View style={styles.contentContainer}>
          <View style={styles.topHandle} />

          {/* User information */}
          <View style={styles.profileRow}>


            <View style={styles.profileText}>
              <Text style={styles.profileName}>{username}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            {/* Profile information buttons */}
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>🎂 Dec 20</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>♓ Pisces</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>💜 Cancer</Text>
            </View>
          </View>


          </View>
        </View>
      </ScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  bitmojiContainer: {
    width: "100%",
    height: 320,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
   bitmojiButtonText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
  },

  bitmojiButtonIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  settingsButton: {
    position: "absolute",
    top: 55,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  //Vaughn's code from here
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 18,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#D4AF37",
  },

  profileText: {
    flex: 1,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111111",
  },

  profileEmail: {
    marginTop: 4,
    fontSize: 15,
    color: "#777777",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  tag: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555555",
  },

  goldFeatureCard: {
    minHeight: 90,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#C9A227",
    borderRadius: 18,
    padding: 10,
    marginBottom: 22,
  },

  goldFeatureImage: {
    width: 66,
    height: 66,
    borderRadius: 13,
    marginRight: 12,
    backgroundColor: "#111111",
  },

  goldFeatureText: {
    flex: 1,
  },

  goldFeatureTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
  },

  goldFeatureDescription: {
    marginTop: 4,
    fontSize: 13,
    color: "#777777",
  },

  featureBadge: {
    backgroundColor: "#24B8EA",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginLeft: 6,
  },

  featureBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111111",
  },

  sectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#EAEAEA",
  },

  sectionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222222",
  },

  rowsContainer: {
    marginBottom: 20,
  },

  dynamicRow: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },

  rowIconContainer: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rowIcon: {
    fontSize: 28,
  },

  rowTextContainer: {
    flex: 1,
  },

  rowTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#191919",
  },

  rowDescription: {
    marginTop: 4,
    fontSize: 13,
    color: "#858585",
  },

  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  moreButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#777777",
  },

  partyCard: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 22,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },

  partyCardActive: {
    borderWidth: 2,
    borderColor: "#8A2BE2",
  },

  newBadge: {
    backgroundColor: "#25B8E8",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 8,
  },

  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  chevron: {
    fontSize: 28,
    color: "#999999",
    marginLeft: 6,
  },

  logoutContainer: {
    marginTop: 18,
  },

});
