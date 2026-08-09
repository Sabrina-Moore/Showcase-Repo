import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PILLS = [
  { key: "memories", label: "Memories", icon: "images-outline" },
  { key: "trending", label: "Trending", icon: "trending-up-outline" },
  { key: "visited", label: "Visited", icon: "time-outline" },
  { key: "popular", label: "Popular", icon: "people-outline" },
  { key: "favorites", label: "Favorites", icon: "heart-outline" },
  { key: "restaurants", label: "Restaurants", icon: "restaurant-outline" },
  { key: "cafes", label: "Cafes", icon: "cafe-outline" },
  { key: "parks", label: "Parks", icon: "leaf-outline" },
  { key: "shops", label: "Shops", icon: "bag-outline" },
  { key: "resources", label: "Resources", icon: "location-outline" },
];

export default function MapPills({ activePill, onSelectPill }) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PILLS.map((pill) => {
          const isActive = activePill === pill.key;
          return (
            <Pressable
              key={pill.key}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelectPill && onSelectPill(pill.key)}
            >
              <Ionicons
                name={pill.icon}
                size={16}
                color={isActive ? "#1a1a1a" : "#fff"}
                style={styles.pillIcon}
              />
              <Text
                style={[styles.pillText, isActive && styles.pillTextActive]}
              >
                {pill.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 64,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: "#FFFC00", // Snapchat yellow accent for the selected pill
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#1a1a1a",
  },
});
