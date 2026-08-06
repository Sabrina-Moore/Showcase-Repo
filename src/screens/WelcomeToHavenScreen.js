import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import ConversationScreen from "./ConversationScreen";

export default function WelcomeToHavenScreen({ route, navigation }) {
  const conversationId = route.params?.conversationId;
  const insets = useSafeAreaInsets();

  const features = [
    {
      id: "1",
      icon: "add-circle-outline",
      title: "Exclusive Tools for Connection",
      description:
        "Send mood stickers, plant virtual trees, play educational games, etc.",
    },
    {
      id: "2",
      icon: "sparkles-outline", // Using sparkles to mimic the AI/bot style icon
      title: "No Chatbots",
      description:
        "Zero AI assistants and chatbot companions to invade your privacy",
    },
    {
      id: "3",
      icon: "lock-closed-outline",
      title: "Privacy Parameters",
      description:
        "Added security measures like passcode entry, vanish mode, and more",
    },
    {
      id: "4",
      icon: "location-outline",
      title: "Find Resources",
      description:
        "Food banks, access points, educational programs can be found easily through chat",
    },
    {
      id: "5",
      icon: "warning-outline",
      title: "Emergency Help",
      description: "Quick access to emergency care",
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Icon / Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/snapchat/ghostlogo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Welcome to Havens!</Text>
        <Text style={styles.subtitle}>
          A unique chat experience made to build connections and strengthen
          relationships.
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          {features.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.featureRow,
                index < features.length - 1 && styles.borderBottom,
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={32} color="#000" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Get Started Button */}
      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => {
            if (conversationId) {
              navigation.navigate("Conversation", {
                conversationId: conversationId,
                isHaven: true,
              });
            } else {
              navigation.goBack();
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F5", // Off-white cream background from design
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Bottom padding to prevent button overlap
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 10,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  featuresList: {
    width: "100%",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 18,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E0D8",
  },
  iconContainer: {
    marginRight: 16,
    paddingTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#777777",
    lineHeight: 18,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 10,
  },
  getStartedButton: {
    backgroundColor: "#2D5A46", // Dark green color matching screenshot
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
