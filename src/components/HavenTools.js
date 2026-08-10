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
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Entypo } from "@expo/vector-icons"; //entypo for importing happy face emoji and images icon
import AntDesign from "@expo/vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";

import { supabase } from "../../utils/hooks/supabase";




//for Haven feature pills for plus button
const havenPills= [
{ id: "games", label: "Games", library: Ionicons, name: "game-controller-outline"},
{ id: "prompts", label: "Prompts", library: Entypo, name: "chat" },
{ id: "help", label: "Need Help?", library: Entypo, name: "location-pin" },
];


export default function HavenTools ({onHelpPress, onPromptSelect}) {
  console.log(Ionicons);
  console.log(Entypo);
  console.log(havenPills);

  const navigation = useNavigation();
  const [activePill, setActivePill] = useState(null);
  const ptrRBSheet = useRef(null); //pointer to dom element 

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
        const { data, error: apiError } = await supabase.rpc(
        "get_random_prompts"
      );
      if (apiError) throw apiError;
      setPrompts(data || []);
    } catch (err) {
      console.error("PromptsData Error:", err);
    } finally {
      setLoading(false);
    }
  };

  //open pills
  const handleGamesPress = () => {
      setActivePill({ id: "games"});
    ptrRBSheet.current?.open(); // Open bottom sheet
  };

  const handlePromptPress = () => {
      setActivePill({ id: "prompts"});
      fetchRandomPrompts();
    ptrRBSheet.current?.open(); // Open bottom sheet
  };



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
            {/* dynamically handles pills and rendering */}
            {/* {havenPills.map((pill) => {
              const IconLibrary = pill.library;
              return (
                <View 
                key={pill.id} 
                styles={styles.pillShadow}> 
                <TouchableOpacity
                style={styles.pill}
                onPress={() => handlePillPress(pill)}
                >
                <IconLibrary name={pill.name} size={18} color="#000" />
                <Text style={styles.pillText}>{pill.label}</Text>
                </TouchableOpacity>
                </View>
            );
            })} */}

            {/* not dynamic pills */}
            <View style={styles.pillRow}>
              <TouchableOpacity style={styles.pill}
              onPress={handleGamesPress}>
                <Ionicons name="game-controller-outline" size={18} color="#000" />
                <Text style={styles.pillText}>Games</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pill}
              onPress={handlePromptPress}>
                <Entypo name="chat" size={18} color="#000" />
                <Text style={styles.pillText}>Prompts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pill}
              onPress={onHelpPress}>
                <Entypo name="location-pin" size={18} color="#000" />
                <Text style={styles.pillText}>Need Help?</Text>
              </TouchableOpacity>
            </View>

        </ScrollView>
        {/* Add bottom sheet of some sort for games and prompts */}
      <RBSheet
        ref={ptrRBSheet}
        useNativeDriver={false}
        height={300}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}
      >
        {/* prompts pill */}
        {activePill?.id === "prompts" && (
          <View style={styles.drawerContainer}>
            <View style={styles.promptContainer}>
              <Text style={styles.promptLabel}>Daily Prompts</Text>
              <TouchableOpacity onPress={fetchRandomPrompts}>
                <Ionicons name="refresh" size={20} color="#79a78c" />
              </TouchableOpacity>
            </View>
              <FlatList
                data={prompts}
                keyExtractor={(item, index) =>
                  item?.prompt_id?.toString() || item?.id?.toString() || index.toString()
                }
                contentContainerStyle={styles.promptList}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.promptItem}
                  onPress={() => {
                    onPromptSelect?.(item.prompt_text);
                    ptrRBSheet.current?.close();
                  }}>
                    <Text style={styles.promptItemText}>{item?.prompt_text}</Text>
                  </TouchableOpacity>
                )}
              />
          </View>
        )}

        {/* games pill */}
         {activePill?.id === "games" && (
          <View style={styles.drawerContainer}>
            <View style={styles.promptContainer}>
              <Text style={styles.promptLabel}>Games</Text>
              <TouchableOpacity >
                <Ionicons name="refresh" size={20} color="#79a78c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
      </RBSheet>
    
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
    gap: 12,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a5BEA8",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    //shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
    borderColor: "#3a3a3a",
    backgroundColor: "#a5BEA8",
  },
   inputPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#a5BEA8",
    borderRadius: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#fff",
  },
  //bottom sheet drawer
  drawerContainer: {
    borderWidth: 1,
    borderColor: "#4a4a4a",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
   //prompts
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
  fontWeight: "500",
  color: "#ffffff",
  textAlign: "center",
  lineHeight: 20,
},
});