import { Image, Text, View, ScrollView, Button, StyleSheet, Pressable } from "react-native";
import { supabase } from "../../utils/hooks/supabase";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ProfileTags } from "../components/ProfileTags";

// hardcoded fake story
const storyItems = [
  {
    id: "story-1",
    title: "Add to My Story · Friends Only",
    description: "Visible to friends only",
    icon: "📷",
  },
  {
    id: "story-2",
    title: "Add to My Story · Public",
    description: "Friends, followers, and more",
    icon: "🌎",
  },
];

//hardcoded countdown
const countdownItems = [
  {
    id: "countdown-1",
    title: "Create a new countdown",
    description: "Invite friends or create one privately",
    icon: "📅",
  },
];


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
  const insets = useSafeAreaInsets();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [userBitmoji, setUserBitmoji] = useState(null);
  const [otherUsername, setOtherUsername] = useState("");
  const [email, setEmail] = useState(null);
  const [snapScore, setSnapScore] = useState(null);
  const [userBirthday, setUserBirthday] = useState(null);
   const [astrologySign, setAstrologySign] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [school, setSchool] = useState(null);


  
  //fetch user profile from profiles (bitmoji_icon, username, email)
  useEffect(() => {
      const fetchProfile= async () => {
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
            .select(`username, email, birthday, snap_score, bitmoji_icon, bitmoji_pose,
              astrology_sign, city, state, school`)
            .eq("user_id", uid)
            .single();

          if(profileError){
            console.log("Profile fetch error:", profileError);
            return;
          }

           console.log("Profile:", profile);
           
          if(profile){
            setUserBitmoji(profile.bitmoji_pose);
            setEmail(profile.email);
            setOtherUsername(profile.username);
            setSnapScore(profile.snap_score);
            setUserBirthday(profile.birthday);
            setAstrologySign(profile.astrology_sign);
            setCity(profile.city);
            setState(profile.state);
            setSchool(profile.school);
          }
        }
      };
      fetchProfile();
    }, []);

    const handleMoreOptions = (item) => {
      console.log("Open more options for:", item.title);
    };

     const renderDynamicRow = (item) => {
    return (
      <View key={item.id} style={styles.dynamicRow}>
        <View style={styles.rowIconContainer}>
          <Text style={styles.rowIcon}>{item.icon}</Text>
        </View>
 
        <View style={styles.rowTextContainer}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowDescription}>{item.description}</Text>
        </View>
 
        <Pressable
          style={styles.moreButton}
          onPress={() => handleMoreOptions(item)}
        >
          <Text style={styles.moreButtonText}>•••</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {/* custom header */}

      <View style={[styles.headerOverlay, { paddingTop: insets.top + 6 }]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => navigation?.goBack()}
          style={styles.iconCircle}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>

        <View style={styles.headerRightIcons}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="share-outline" size={18} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconCircle}>
            <MaterialCommunityIcons name="hanger" size={24} color="white" />
          </Pressable>
          <Pressable style={styles.iconCircle}
          onPress={() => navigation.navigate("Settings")}>
            <EvilIcons name="gear" size={24} color="white" />
          </Pressable>
        </View>

        {/* bitmoji background */}
      </View>
        <View style={styles.bitmojiContainer} >
          {userBitmoji ? (
          <Image
            source={{ uri: userBitmoji }}
            style={styles.avatar}
            resizeMode="contain"
          />
          ) : null}
          <View style={styles.bitmojiNameOverlay}>
            <Text style={styles.bitmojiNameText}>{otherUsername}</Text>
          </View>
        </View>
  
      {/* content below bitmoji image */}
      <ScrollView style={styles.scrollContent}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.topHandle} />

            {/* Profile information tags from ProfileTags.js*/}
          <ProfileTags userId={currentUserId} />
          
            {/* gold feature card */}
        <Pressable style={styles.goldFeatureCard}>
            <View style={styles.goldFeatureImage} />
            <View style={styles.goldFeatureText}>
              <Text style={styles.goldFeatureTitle}>Haven+</Text>
              <Text style={styles.goldFeatureDescription} numberOfLines={1}>
                Try custom themes, icons, and exclusive features
              </Text>
            </View>
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>New</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          {/* stories section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Stories</Text>
            <Pressable style={styles.sectionButton}>
              <Text style={styles.sectionButtonText}>＋ New Story</Text>
            </Pressable>
          </View>
 
          <View style={styles.rowsContainer}>
            {storyItems.map(renderDynamicRow)}
          </View>

          {/* countdowns section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Countdowns</Text>
            <Pressable style={styles.sectionButton}>
              <Text style={styles.sectionButtonText}>＋ New</Text>
            </Pressable>
          </View>
 
          <View style={styles.rowsContainer}>
            {countdownItems.map(renderDynamicRow)}
          </View>

           <View style={styles.logoutContainer}>
            <Button title="Log Out" onPress={handleSignOut} />
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
   scrollContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    },
  scrollContentContainer: {
    paddingTop: 400,
  },

  container: {
    minHeight: 800,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
    headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerRightIcons: {
    flexDirection: "row",
    gap: 8,
  },
   iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  bitmojiContainer: {
    width: "100%",
    height: 420,
    position: "relative",
  alignItems: "center",
  },
   bitmojiNameOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 70,
  },
  avatar: {
    width: "200%",
    height: undefined,
    aspectRatio: 1,
  },
    bitmojiNameText: {
    fontSize: 30,
    fontWeight: "500",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  contentContainer: {
    marginTop: -26,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 50,
    backgroundColor: "rgba(248, 248, 248, 0.98)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  topHandle: {
    width: 54,
    height: 5,
    backgroundColor: "#D3D3D3",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 18,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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
  //tags
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
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
  //snapchat+
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
//for page divisions
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
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  moreButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#777777",
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
