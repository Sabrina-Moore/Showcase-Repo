import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../utils/hooks/supabase"; 
import { ProfileTags } from "../components/ProfileTags";

const { width } = Dimensions.get("window");

//don't need this
// const PROFILE_INFO = {
//   dateAdded: "Aug 4",
//   snapscore: "41,625",
//   zodiac: "Scorpio",
//   school: "PCC 2028",
//   username: "place holder",
//   locationLabel: "Mid-City, Los Angeles",
// };

const CHARMS = [
  { id: "1", label: "It's Been\nForever", icon: "hourglass-outline" },
  { id: "2", label: "Sun Sign\nCompatibility", icon: "planet-outline" },
  { id: "3", label: "Friend's\nBirthstone", icon: "diamond-outline" },
  { id: "4", label: "Astrology\nMatch", icon: "sparkles-outline" },
];

export default function ConversationProfileScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const conversationId = route?.params?.conversationId;

  const [currentUserId, setCurrentUserId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [userBitmoji, setUserBitmoji] = useState(null);
  const [otherUsername, setOtherUsername] = useState("");



  //fetch current user id
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching current user:", error);
        return;
      }
  
      setCurrentUserId(data?.user?.id ?? null);
    };
    fetchCurrentUser();
  }, []);


  //fetch other Participant profile from profiles (profile tags)
  useEffect(() => {
    const fetchOtherUser= async () => {
      if(!conversationId || !currentUserId) return;

        const { data, error } = await supabase
          .from("conversation_members")
          .select (`user_id, profiles (username)`)
          .eq("conversation_id", conversationId)
          .neq("user_id", currentUserId)
          .single();


        if(error){
          console.log("other participant fetch error:", error);
          return;
        }
        setOtherUserId(data?.user_id ?? null);
        setOtherUsername(data?.profiles?.username ?? null);
    };
    fetchOtherUser();
  }, [conversationId, currentUserId]);


  

  return (
    <View style={styles.container}>
      <View
        style={[styles.headerOverlay, { paddingTop: insets.top + 6 }]}
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
            <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View
        style={styles.bitmojiContainer}
      >
        <Image
          source={require("../../assets/conversationProfilePic/bestFriend.png")}
          style={styles.bitmojiImage}
          resizeMode="contain"
        />
        <View style={styles.bitmojiNameOverlay}>
          <Text style={styles.bitmojiNameText}>{otherUsername}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.spacer} />

        <View style={styles.cardContainer}>
          {/* Identity Info */}
          <View style={styles.identityRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require("../../assets/conversationProfilePic/bestFriend.png")}
                style={styles.avatarImage}
              />
              <View style={styles.presenceDot} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.nameTextDark}>{otherUsername}</Text>
            </View>
          </View>

          {/* Info Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillsRow}
            contentContainerStyle={{ gap: 8 }}
          >
             <ProfileTags userId={otherUserId}/>
             
          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="camera" size={22} color="#0b0b0b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble" size={20} color="#0b0b0b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call" size={20} color="#0b0b0b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="videocam" size={22} color="#0b0b0b" />
            </TouchableOpacity>
          </View>

          {/* Highlights */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.highlightCard}>
              <View style={styles.highlightIcon}>
                <Ionicons name="trending-up" size={18} color="#FF3B30" />
              </View>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.rowTitle}>Snapscore Multiplier</Text>
                <Text style={styles.rowSubtitle}>
                  Get double the points when you Snap with other subscribers.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>

          {/* Our Chat */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Chat</Text>
            <View style={styles.card}>
              <TouchableOpacity style={[styles.linkRow, styles.rowDivider]}>
                <View style={styles.linkIconCircle}>
                  <Ionicons name="image-outline" size={16} color="#5b5b5b" />
                </View>
                <View style={styles.rowTextWrapper}>
                  <Text style={styles.rowTitle}>Wallpaper</Text>
                  <Text style={styles.rowSubtitle}>
                    Both you and {otherUsername} will see the wallpaper
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkRow}>
                <View style={styles.linkIconCircle}>
                  <Ionicons
                    name="color-palette-outline"
                    size={16}
                    color="#dd1147"
                  />
                </View>
                <View style={styles.rowTextWrapper}>
                  <Text style={styles.rowTitle}>Chat Color</Text>
                  <Text style={styles.rowSubtitle}>
                    Change the color of your name
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Saved in Chat */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved in Chat</Text>
            <View style={[styles.card, styles.emptyStateCard]}>
              <Text style={styles.emptyStateText}>
                Photos and videos saved in Chat will appear here.
              </Text>
            </View>
          </View>

          {/* Charms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Charms</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {CHARMS.map((charm) => (
                <View key={charm.id} style={styles.charmCard}>
                  <View style={styles.charmNewBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                  <View style={styles.charmIconWrapper}>
                    <Ionicons name={charm.icon} size={28} color="#5b5b5b" />
                  </View>
                  <Text style={styles.charmLabel}>{charm.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const AVATAR_SIZE = 58;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f9",
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
  scrollView: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    bottom: 0,
  },
  spacer: {
    height: width * 0.55,
  },
  cardContainer: {
    minHeight: 800,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  identityRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: "#E9E9EC",
  },
  presenceDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#fff",
  },
  nameTextDark: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b0b0b",
  },
  usernameTextDark: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  pillsRow: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0b0b0b",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b0b0b",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#F7F7F9",
    borderRadius: 14,
    overflow: "hidden",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9EC",
  },
  linkIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowTextWrapper: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0b0b0b",
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7E8",
    borderWidth: 1,
    borderColor: "#F4C761",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  highlightIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emptyStateCard: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
  },
  charmCard: {
    width: 100,
    backgroundColor: "#F7F7F9",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  charmNewBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#0A84FF",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  newBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  charmIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  charmLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0A84FF",
    textAlign: "center",
  },
    bitmojiContainer: {
  width: "100%",
  aspectRatio: 1,
  position: "relative",
  alignItems: "center",
  justifyContent: "flex-start",
  },

  bitmojiImage: {
  width: "150%",
  height: undefined,
  aspectRatio: 1,
  },
  bitmojiNameOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
  },
    bitmojiNameText: {
    fontSize: 30,
    fontWeight: "500",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
