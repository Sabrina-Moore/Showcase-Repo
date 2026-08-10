import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../utils/hooks/supabase"; 
import { ProfileTags } from "../components/ProfileTags";

const { width } = Dimensions.get("window");


const NUDGE_CATEGORIES = [
  "Check-in",
  "Encouragement",
  "Reminder",
  "Resource Share",
];
const MOOD_OPTIONS = ["Happy", "Sad", "Angry", "Upset", "Anxious"];
const NEED_OPTIONS = ["Helped", "Heard", "Distracted", "Challenged"];

const LINKS = [
  {
    id: "1",
    title: "LA Regional Food Bank",
    subtitle: "https://www.lafoodbank.org/",
    url: "https://www.lafoodbank.org/",
    icon: "nutrition-outline",
  },
  {
    id: "2",
    title: "CES Access Point Directory",
    subtitle: "https://homeless.lacounty.gov/...",
    // TODO: replace with the full CES directory URL
    url: "https://homeless.lacounty.gov/",
    icon: "document-text-outline",
  },
  {
    id: "3",
    title: "Reserve a table",
    subtitle: "with OpenTable",
    url: "https://www.opentable.com/",
    icon: "calendar-outline",
  },
];

const MOOD_ACCENT = "#E2793C";
const HAVEN_DARK = "#2E5A44";
const HAVEN_LIGHT = "#a5BEA8";

// generic dropdown used for Category / Mood / Need
function SelectField({
  label,
  value,
  placeholder,
  options,
  open,
  onToggle,
  onSelect,
  accentColor,
}) {
  const hasValue = value && value !== "None";
  return (
    <View style={styles.selectFieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.selectBox}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectValue,
            hasValue && { color: accentColor, fontWeight: "700" },
          ]}
        >
          {hasValue ? value : placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#8E8E93"
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.dropdownOption}
              onPress={() => onSelect(opt)}
            >
              <Text style={styles.dropdownOptionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ConversationHavenProfileScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { conversationId, isHaven: HavenMode } = route.params ?? {};

  const [currentUserId, setCurrentUserId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [userBitmoji, setUserBitmoji] = useState(null);
  const [otherUsername, setOtherUsername] = useState("");


  //nudges and mood notifications
  const [nudgeCategory, setNudgeCategory] = useState(null);
  const [nudgeText, setNudgeText] = useState("");
  const [mood, setMood] = useState(null);
  const [need, setNeed] = useState(null);

  // only one dropdown open at a time
  const [openField, setOpenField] = useState(null); // "category" | "mood" | "need" | null
  const toggleField = (field) =>
    setOpenField((cur) => (cur === field ? null : field));

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

  const handleSendUpdate = async () => {
    if (!nudgeCategory || !nudgeText.trim() || !currentUserId || !conversationId) return;

    const  { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
        sender_id: currentUserId,
        text: nudgeText.trim(),
        is_prompt: false,
        is_nudge: true,
        is_checkin: false,
    })
      if (error) {
        console.log("Failed to send prompt:", error);
      }

    setNudgeText("");
    setNudgeCategory(null);
  };

  const handleSendMoodNeed = async () => {
    if ( !mood || !need || !currentUserId || !conversationId) return;

    const  { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
        sender_id: currentUserId,
        text: `Feeling ${mood} and need to be ${need.toLowerCase()}`,
        is_prompt: false,
        is_nudge: false,
        is_checkin: true,
    })
      if (error) {
        console.log("Failed to send mood/need:", error);
      }
  };


  //leaving as they are so that the user can still make selections
  const handleSelectMood = (value) => {
    setMood(value);
    setOpenField(null);

  };

  const handleSelectNeed = (value) => {
    setNeed(value);
    setOpenField(null);
  };

  const handleFindResources = () => {
    navigation.navigate("Back", {
      screen: "Map",
      params: { initialFilter: "resources" },
    });
  };

  const handleOpenLink = (url) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* header */}
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
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </Pressable>
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
        {/* background bitmoji */}
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

            {mood && (
              <View style={[styles.pill, styles.moodPill]}>
                <Text style={[styles.pillText, { color: MOOD_ACCENT }]}>
                  {mood}
                </Text>
              </View>
            )}
          </ScrollView>

          {need && (
            <Text style={styles.needsLabel}>
              Needs to be {need.toLowerCase()}
            </Text>
          )}

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

          {/* Friendships are Private */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.privacyCard}>
              <View style={styles.privacyIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={HAVEN_DARK}
                />
              </View>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.rowTitle}>Friendships are Private</Text>
                <Text style={styles.rowSubtitle}>
                  Screenshotting friendship profiles will send a notification –
                  just like Snaps.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>

          {/* Nudge */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nudge</Text>
            <View style={styles.havenCard}>
              <SelectField
                label="Category"
                placeholder="Choose Here"
                value={nudgeCategory}
                options={NUDGE_CATEGORIES}
                open={openField === "category"}
                onToggle={() => toggleField("category")}
                onSelect={(v) => {
                  setNudgeCategory(v);
                  setOpenField(null);
                }}
                accentColor={HAVEN_DARK}
              />

              <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Update</Text>
              <TextInput
                value={nudgeText}
                onChangeText={setNudgeText}
                placeholder="Type here..."
                style={styles.nudgeInput}
                multiline
              />

              <TouchableOpacity
                style={styles.sendUpdateButton}
                onPress={handleSendUpdate}
              >
                <Text style={styles.sendUpdateText}>Send Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mood and Need */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mood and Need</Text>
            <View style={[styles.havenCard, { flexDirection: "row", gap: 12 }]}>
              <View style={{ flex: 1 }}>
                <SelectField
                  label="Mood"
                  placeholder="None"
                  value={mood}
                  options={MOOD_OPTIONS}
                  open={openField === "mood"}
                  onToggle={() => toggleField("mood")}
                  onSelect={handleSelectMood}
                  accentColor={MOOD_ACCENT}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SelectField
                  label="Need"
                  placeholder="None"
                  value={need}
                  options={NEED_OPTIONS}
                  open={openField === "need"}
                  onToggle={() => toggleField("need")}
                  onSelect={handleSelectNeed}
                  accentColor="#0A84FF"
                />
              </View>
            </View>
             <TouchableOpacity
                style={styles.sendUpdateButton}
                onPress={handleSendMoodNeed}
              >
                <Text style={styles.sendUpdateText}>Send Update</Text>
              </TouchableOpacity>
          </View>

          {/* Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            <View style={styles.card}>
              {LINKS.map((link, index) => (
                <TouchableOpacity
                  key={link.id}
                  style={[
                    styles.linkRow,
                    index < LINKS.length - 1 && styles.rowDivider,
                  ]}
                  onPress={() => handleOpenLink(link.url)}
                >
                  <View style={styles.linkIconCircle}>
                    <Ionicons name={link.icon} size={16} color="#5b5b5b" />
                  </View>
                  <View style={styles.rowTextWrapper}>
                    <Text style={styles.rowTitle}>{link.title}</Text>
                    <Text style={styles.rowSubtitle} numberOfLines={1}>
                      {link.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Snap Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Snap Map</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.mapPreview}
                onPress={handleFindResources}
              >
                <Ionicons name="map-outline" size={28} color="#8E8E93" />
                <Text style={styles.mapPreviewText}>Tap to open Map</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.linkRow, styles.rowDivider]}
                onPress={handleFindResources}
              >
                <View style={styles.linkIconCircle}>
                  <Ionicons name="location-outline" size={16} color="#5b5b5b" />
                </View>
                <View style={styles.rowTextWrapper}>
                  <Text style={styles.rowTitle}>Find Resources</Text>
                  <Text style={styles.rowSubtitle}>
                    Emergency care, food banks, access points...
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.linkRow, styles.rowDivider]}>
                <View style={styles.linkIconCircle}>
                  <Ionicons name="navigate-outline" size={16} color="#5b5b5b" />
                </View>
                <View style={styles.rowTextWrapper}>
                  <Text style={styles.rowTitle}>Sharing Location</Text>
                  <Text style={styles.rowSubtitle}>with My Friends</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkRow}>
                <View style={styles.linkIconCircle}>
                  <Ionicons
                    name="notifications-outline"
                    size={16}
                    color="#5b5b5b"
                  />
                </View>
                <View style={styles.rowTextWrapper}>
                  <Text style={styles.rowTitle}>Arrival Notifications</Text>
                  <Text style={styles.rowSubtitle}>with My Friends</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </View>
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
  moodPill: {
    backgroundColor: "#FDEEE3",
    borderWidth: 1,
    borderColor: MOOD_ACCENT,
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0b0b0b",
  },
  needsLabel: {
    alignSelf: "flex-end",
    marginRight: 16,
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#0A84FF",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 10,
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
  havenCard: {
    backgroundColor: "#F7F7F9",
    borderRadius: 14,
    padding: 14,
  },
  privacyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F6F2",
    borderWidth: 1,
    borderColor: HAVEN_LIGHT,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  privacyIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  mapPreview: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEEF0",
    gap: 6,
  },
  mapPreviewText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  // ---- select / dropdown fields ----
  selectFieldWrapper: {
    position: "relative",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 6,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  selectValue: {
    fontSize: 14,
    color: "#8E8E93",
  },
  dropdownList: {
    position: "absolute",
    top: 66,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 10,
    zIndex: 50,
    elevation: 6,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E9E9EC",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#0b0b0b",
  },
  nudgeInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 44,
  },
  sendUpdateButton: {
    marginTop: 14,
    backgroundColor: HAVEN_DARK,
    borderRadius: 20,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  sendUpdateText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
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
