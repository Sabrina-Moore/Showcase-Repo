import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../utils/hooks/supabase";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WelcomeToHavenScreen({ route, navigation }) {
  const conversationId = route.params?.conversationId;
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState(null);

  const features = [
    {
      id: "1",
      icon: "help-outline",
      title: "What’s Haven?",
      description:
        "Haven gives users a space where the number one value is building connections.",
      details: [
        "Haven is a conversational toolkit to improve your chat experience without changing your habits.",
        "This feature can be added to any chat if you want more tools to help engage with friends and maintain their relationships.",
        "Customize your experience with these tools inside the conversation profile.",
        "Look for the new + button next to the keyboard to interact with the tools.",
      ],
    },
    {
      id: "2",
      icon: "add-circle-outline",
      title: "Exclusive Tools for Connection",
      description:
        "Send mood stickers, plant virtual trees, play educational games, etc.",
      details: [
        "Lull in activity? Nudge them and send a notification to their phone letting them know you need them.",
        "Need help starting a conversation? Use a Prompt to get things started.",
        "Passively let Haven-mates know how you're feeling and how they can help you by setting the Mood and Need.",
        "Looking for external aid? Use the Need Help button to find local resources in the Snap Map.",
        "And more!",
      ],
    },
    {
      id: "3",
      icon: "lock-closed-outline",
      title: "Privacy Matters",
      description:
        "Send mood stickers, plant virtual trees, play educational games, etc.",
      details: [
        "These chats can be personal, so once you've made your Haven, any additional friends added to the Haven will need to be approved by existing members.",
        "If you're 17+ and need more privacy, set a passcode for your chat so only Haven members can access.",
      ],
    },
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  // navigating to conversation screen and toggling conditional rendering
  const handleGetStarted = async () => {
    if (!conversationId) {
      navigation.goBack();
      return;
    }

    const { error } = await supabase
      .from("conversations")
      .update({ is_haven: true })
      .eq("conversation_id", conversationId);

    if (error) {
      console.error("Error creating Haven:", error);
      return;
    }

    navigation.navigate("Conversation", { conversationId, isHaven: true });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={26} color="#000" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Logo Container */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/HavenLogos/HavenLogoTransparent.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Header Title & Subtitle */}
        <Text style={styles.title}>Welcome to Haven!</Text>
        <Text style={styles.subtitle}>
          A unique chat experience made to build connections and strengthen
          relationships.
        </Text>

        {/* Features Accordion List */}
        <View style={styles.featuresList}>
          {features.map((item, index) => {
            const isExpanded = expandedId === item.id;
            return (
              <View
                key={item.id}
                style={[
                  styles.featureItemContainer,
                  index < features.length - 1 && styles.borderBottom,
                ]}
              >
                <TouchableOpacity
                  style={styles.featureRow}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={26} color="#000000" />
                  </View>

                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>{item.title}</Text>
                    <Text
                      style={styles.featureDescription}
                      numberOfLines={isExpanded ? undefined : 2}
                    >
                      {item.description}
                    </Text>
                  </View>

                  <View style={styles.chevronContainer}>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#555555"
                    />
                  </View>
                </TouchableOpacity>

                {/* Expanded Bullet Points */}
                {isExpanded && (
                  <View style={styles.detailsContainer}>
                    {item.details.map((detail, dIndex) => (
                      <View key={dIndex} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Button */}
      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 28 },
        ]}
      >
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.85}
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
    backgroundColor: "#FFFEF9",
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 110,
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#555555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  featuresList: {
    width: "100%",
  },
  featureItemContainer: {
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#ECEAE3",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 16,
    paddingTop: 2,
  },
  featureTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },
  chevronContainer: {
    paddingTop: 4,
  },
  detailsContainer: {
    marginTop: 14,
    paddingLeft: 42, // Aligns nicely with the text box above
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#555555",
    marginRight: 8,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 12,
    backgroundColor: "#FFFEF9",
  },
  getStartedButton: {
    backgroundColor: "#2C523C",
    paddingVertical: 14,
    width: "70%",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
