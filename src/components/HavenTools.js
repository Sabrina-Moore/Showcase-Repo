import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons"; //entypo for importing happy face emoji and images icon
import AntDesign from "@expo/vector-icons/AntDesign";

import { supabase } from "../../utils/hooks/supabase";




//for Haven feature pills for plus button
const havenPills= [
{ id: "games", label: "Games", library: Ionicons, name: "game-controller-outline"},
{ id: "prompts", label: "Prompts", library: Entypo, name: "chat" },
{ id: "help", label: "Need Help?", library: Entypo, name: "location-pin" },
];

export default function HavenTools () {
console.log(Ionicons);
console.log(Entypo);
console.log(havenPills);

     {/* feature pills from plus symbol Haven */}
    {/* only renders if showPills is true */}
    return (
        <View>
        <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.pillScroll}
                contentContainerStyle={styles.pillContainer}
            >
            {/* rename library to IconLibrary for custom component  */}
            {havenPills.map(({ id, label, library:IconLibrary, name }) => (
                <TouchableOpacity
                key={id}
                style={styles.pill}
                onPress={() => console.log(`Selected ${label}`)}
                >
                {/* Dynamically renders whatever icon library was specified */}
                <IconLibrary name={name} size={18} color="#000" />
                <Text style={styles.pillText}>{label}</Text>
                </TouchableOpacity>
            ),
            )}
        </ScrollView>
        {/* Add drawer of some sort for games and prompts */}
        </View>
    );
}




const styles = StyleSheet.create({
    //haven specific visuals - make sure to match green
  pillScroll: {
    backgroundColor: "transparent",
    marginBottom: 8,
    overflow: "visible",
  },
  pillContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 6,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#79a78c",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  pillText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.2,
  },
   //input bar
  inputBar: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
    marginBottom: 20,
  },
  inputPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#F1F1F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#000",
  },
});
