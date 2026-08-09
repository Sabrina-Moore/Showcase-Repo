import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "food_banks", label: "Food Banks" },
  { key: "non_profits", label: "Non-Profits" },
  { key: "access_centers", label: "Access Centers" },
  { key: "libraries", label: "Libraries" },
];

const WESTSIDE_PHOTOS = [
  require("../../assets/mapImages/westside_foodbank.png"),
  require("../../assets/mapImages/westside_foodbank.png"),
  require("../../assets/mapImages/westside_foodbank.png"),
];

const RESOURCES = [
  // Food Banks with actual asset images
  {
    id: "fb1",
    name: "Westside Food Bank",
    category: "food_banks",
    label: "Food Bank",
    distance: "0.9 miles",
    image: require("../../assets/mapImages/westside_foodbank.png"),
    location: { latitude: 34.0195, longitude: -118.4912 },
    details: {
      priceLevel: "Free",
      rating: 4.6,
      ratingCount: 812,
      tags: ["Walk-ins Welcome", "Wheelchair Accessible", "Volunteer Friendly"],
      favoritesCount: 71,
      visitDuration: "15 Min",
      hoursToday: "9:00 AM – 4:00 PM",
      popularTimesNote: "Usually a little busy",
      address: "1710 22nd St, Santa Monica, CA 90404",
      phone: "(310) 828-6016",
      website: "westsidefoodbank.org",
      photos: WESTSIDE_PHOTOS,
      reviews: [
        {
          source: "Google",
          rating: 5,
          date: "Jun 12, 2026",
          text: "Staff was incredibly kind and the line moved fast. Grateful this is in the neighborhood.",
        },
        {
          source: "Google",
          rating: 4,
          date: "May 28, 2026",
          text: "Well organized and they had a good variety of fresh produce this week.",
        },
        {
          source: "Yelp",
          rating: 5,
          date: "Apr 30, 2026",
          text: "Volunteers were friendly and it didn't feel rushed at all. Highly recommend.",
        },
      ],
    },
  },
  {
    id: "fb2",
    name: "Meals On Wheels of West Los Angeles",
    category: "food_banks",
    label: "Food Bank",
    distance: "3.3 miles",
    image: require("../../assets/mapImages/mealsonwheels_foodbank.png"),
  },
  {
    id: "fb3",
    name: "Community Space Food Bank",
    category: "food_banks",
    label: "Food Bank",
    distance: "1.0 miles",
    image: require("../../assets/mapImages/communityspace_foodbank.png"),
  },
  {
    id: "fb4",
    name: "St. Joseph Center Food Pantry",
    category: "food_banks",
    label: "Food Bank",
    distance: "1.5 miles",
    image: require("../../assets/mapImages/stjoseph_foodbank.png"),
  },

  // Non-Profits
  {
    id: "np1",
    name: "Assistance League of Los Angeles",
    category: "non_profits",
    label: "Non-Profit Organization",
    distance: "1.8 miles",
    image: require("../../assets/mapImages/AL_nonprofit.png"),
  },
  {
    id: "np2",
    name: "Chrysalis Santa Monica",
    category: "non_profits",
    label: "Non-Profit Organization",
    distance: "1.2 miles",
    image: require("../../assets/mapImages/chrysalis_nonprofit.png"),
  },
  {
    id: "np3",
    name: "Ocean Park Community Center",
    category: "non_profits",
    label: "Non-Profit Organization",
    distance: "0.7 miles",
    image: require("../../assets/mapImages/oceanPark_nonprofit.png"),
  },
  {
    id: "np4",
    name: "Santa Monica Boys & Girls Club",
    category: "non_profits",
    label: "Non-Profit Organization",
    distance: "2.1 miles",
    image: require("../../assets/mapImages/boysandgirls_nonprofit.png"),
  },

  // Access Centers
  {
    id: "ac1",
    name: "Santa Monica Access Center",
    category: "access_centers",
    label: "Access Center",
    distance: "0.5 miles",
    image: require("../../assets/mapImages/santamonica_accesscenter.png"),
  },
  {
    id: "ac2",
    name: "WISE & Healthy Aging",
    category: "access_centers",
    label: "Access Center",
    distance: "1.4 miles",
    image: require("../../assets/mapImages/wiseandhealthy_accesscenter.png"),
  },
  {
    id: "ac3",
    name: "The People Concern Access Center",
    category: "access_centers",
    label: "Access Center",
    distance: "2.0 miles",
    image: require("../../assets/mapImages/thepeopleconcern_accesscenter.png"),
  },
  {
    id: "ac4",
    name: "Turning Point Access Center",
    category: "access_centers",
    label: "Access Center",
    distance: "1.1 miles",
    image: require("../../assets/mapImages/turningpoint_accesscenter.png"),
  },

  // Libraries
  {
    id: "lib1",
    name: "Santa Monica Main Library",
    category: "libraries",
    label: "Library",
    distance: "0.6 miles",
    image: require("../../assets/mapImages/santamonica_library.png"),
  },
  {
    id: "lib2",
    name: "Ocean Park Branch Library",
    category: "libraries",
    label: "Library",
    distance: "1.3 miles",
    image: require("../../assets/mapImages/oceanpark_library.png"),
  },
  {
    id: "lib3",
    name: "Fairview Branch Library",
    category: "libraries",
    label: "Library",
    distance: "2.4 miles",
    image: require("../../assets/mapImages/fairview_library.png"),
  },
  {
    id: "lib4",
    name: "Montana Avenue Branch Library",
    category: "libraries",
    label: "Library",
    distance: "1.9 miles",
    image: require("../../assets/mapImages/montana_library.png"),
  },
];

export default function ResourcesModal({ visible, onClose, onSelectResource }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState(new Set());

  const filteredResources = useMemo(() => {
    if (selectedCategory === "all") return RESOURCES;
    return RESOURCES.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="people-outline" size={22} color="#fff" />
              </View>
              <View>
                <Text style={styles.title}>Resources</Text>
                <Text style={styles.subtitle}>
                  Showing {filteredResources.length} Results
                </Text>
              </View>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={18} color="#1a1a1a" />
            </Pressable>
          </View>

          {/* Category filter pills */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <Pressable
                    key={cat.key}
                    style={[
                      styles.categoryPill,
                      isActive && styles.categoryPillActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.key)}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        isActive && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <FlatList
            data={filteredResources}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isFavorited = favorites.has(item.id);
              const isSelectable = !!item.details;
              return (
                <Pressable
                  style={styles.card}
                  onPress={() => {
                    if (isSelectable && onSelectResource) {
                      onSelectResource(item);
                    }
                  }}
                >
                  <View style={styles.avatarRing}>
                    <Image style={styles.avatarImage} source={item.image} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.cardLabel}>{item.label}</Text>
                    <Text style={styles.cardMeta}>
                      <Text style={styles.openNow}>Open Now</Text> ·{" "}
                      {item.distance}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Ionicons
                      name={isFavorited ? "heart" : "heart-outline"}
                      size={18}
                      color={isFavorited ? "#FF5A5F" : "#1a1a1a"}
                    />
                  </Pressable>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const ACCENT = "#B8722E";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 16,
    height: "75%",
  },
  dragHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8D8D8",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3C7A5E",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryRow: {
    alignItems: "center",
    gap: 8,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: ACCENT,
    borderWidth: 1.5,
    borderColor: ACCENT,
    alignSelf: "flex-start",
  },
  categoryPillActive: {
    backgroundColor: "#fff",
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  categoryPillTextActive: {
    color: ACCENT,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#8A5FD6",
    padding: 2,
    marginRight: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    resizeMode: "cover",
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  cardLabel: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  openNow: {
    color: "#3C9A5C",
    fontWeight: "600",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
