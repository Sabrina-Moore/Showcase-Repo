//feature pills on ConversationScreen

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Ionicons,
  Entypo,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons"; //icons for feature pills
import { supabase } from "../../utils/hooks/supabase";

export function HavenTools({
  onHelpPress,
  onNudgePress,
  onCheckinPress,
  onPromptSelect,
}) {
  const [activePill, setActivePill] = useState(null);

  //prompts
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  //fetch prompts
  useEffect(() => {
    fetchRandomPrompts();
  }, []);

  const fetchRandomPrompts = async () => {
    try {
      setLoading(true);
      const { data, error: apiError } =
        await supabase.rpc("get_random_prompts");
      if (apiError) throw apiError;
      setPrompts(data || []);
    } catch (err) {
      console.error("PromptsData Error:", err);
    } finally {
      setLoading(false);
    }
  };

  //open pills
  const handleGamePress = () => {
    setActivePill({ id: "games" });
  };

  const handlePromptPress = () => {
    setActivePill({ id: "prompts" });
    fetchRandomPrompts();
  };

  const handlePromptSelect = (promptText) => {
    onPromptSelect?.(promptText);
    setActivePill(null);
  };

  return {
    activePill,
    setActivePill,
    prompts,
    loading,
    fetchRandomPrompts,
    handleGamePress,
    handlePromptPress,
    handlePromptSelect,
  };
}

export function HavenPillsRow({
  onGamePress,
  onNudgePress,
  onPromptPress,
  onCheckinPress,
  onHelpPress,
}) {
  /* feature pills from plus symbol Haven */
  /* only renders if showPills is true */

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.pillScroll}
      contentContainerStyle={styles.pillRow}
    >
      <TouchableOpacity style={styles.pill} onPress={onGamePress}>
        <Ionicons name="game-controller-outline" size={20} color="black" />
        <Text style={styles.pillText}>Games</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={onPromptPress}>
        <Entypo name="chat" size={22} color="#000" />
        <Text style={styles.pillText}>Prompts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={onNudgePress}>
        <MaterialCommunityIcons name="gesture-tap" size={22} color="black" />
        <Text style={styles.pillText}>Nudge </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={onCheckinPress}>
        <MaterialCommunityIcons name="hand-wave" size={20} color="black" />
        <Text style={styles.pillText}>Mood + Need </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={onHelpPress}>
        <Ionicons name="alert-circle" size={22} color="black" />
        <Text style={styles.pillText}>Need Help?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Panel content (prompts list / games) - below textinput
export function HavenPanels({
  activePill,
  setActivePill,
  prompts,
  fetchRandomPrompts,
  onPromptSelect,
}) {
  if (!activePill) return null;

  return (
    <View style={styles.panelContainer}>
      {/* prompts pill */}
      {activePill.id === "prompts" && (
        <View style={styles.promptPanel}>
          <View style={styles.promptContainer}>
            <Text style={styles.promptLabel}>Daily Prompts</Text>
            <TouchableOpacity onPress={fetchRandomPrompts}>
              <Ionicons name="refresh" size={20} color="#79a78c" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={prompts}
            keyExtractor={(item, index) =>
              item?.prompt_id?.toString() ||
              item?.id?.toString() ||
              index.toString()
            }
            contentContainerStyle={styles.promptList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.promptItem}
                onPress={() => onPromptSelect?.(item.prompt_text)}
              >
                <Text style={styles.promptItemText}>{item?.prompt_text}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {activePill.id === "games" && (
        <View style={styles.gamePanel}>
          <View style={styles.topHandle} />
          <TouchableOpacity
            style={styles.gameItem}
            onPress={() => setActivePill(null)}
          >
            <Image
              source={require("../../assets/HavenIcons/GamesImage.jpeg")}
              style={styles.gameImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  //haven specific visuals - make sure to match green
  panelContainer: {
    width: "100%",
    backgroundColor: "#f8f3e6",
  },
  pillScroll: {
    backgroundColor: "transparent",
    marginBottom: 8,
    height: 40,
  },
  pillRow: {
    flexDirection: "row",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F3E6",
    paddingHorizontal: 16,
    paddingVertical: 2,
    margin: 2,
    borderRadius: 25,
    gap: 2,
    //shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 12,
    fontFamily: "Avenir-Next",
    fontWeight: "600",
    color: "#4a4a4a",
    letterSpacing: -0.2,
  },
  //prompts
  promptPanel: {
    width: "100%",
    height: 300,
    backgroundColor: "#F8F3E6",
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  promptContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  promptList: {
    gap: 16,
    paddingBottom: 4,
  },
  promptLabel: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Avenir-Next",
    color: "#8a8a8a",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  promptItem: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: "#2E5A44",
  },
  promptItemText: {
    fontSize: 15,
    fontFamily: "Avenir-Next",
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 20,
  },
  gamePanel: {
    width: "100%",
    height: 400,
    backgroundColor: "#F8F3E6",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 8,
  },
  gameImage: {
    width: "100%",
    height: 500,
    position: "absolute",
    top: 0,
    left: 0,
  },
  topHandle: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    width: 45,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 10,
  },
});
