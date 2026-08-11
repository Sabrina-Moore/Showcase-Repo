// //feature pills on ConversationScreen

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ScrollView,
//   TouchableOpacity,
//   Pressable,
//   Image,
//   StyleSheet,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
//   Ionicons,
//   Entypo,
//   AntDesign,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons"; //icons for feature pills
// import { supabase } from "../../utils/hooks/supabase";

// export default function HavenTools({
//   onHelpPress,
//   onNudgePress,
//   onCheckinPress,
//   onPromptSelect,
// }) {
//   const [activePill, setActivePill] = useState(null);

//   //prompts
//   const [prompts, setPrompts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   //fetch prompts
//   useEffect(() => {
//     fetchRandomPrompts();
//   }, []);

//   const fetchRandomPrompts = async () => {
//     try {
//       setLoading(true);
//       const { data, error: apiError } =
//         await supabase.rpc("get_random_prompts");
//       if (apiError) throw apiError;
//       setPrompts(data || []);
//     } catch (err) {
//       console.error("PromptsData Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //open pills
//   const handleGamePress = () => {
//     setActivePill({ id: "games" });
//   };

//   const handlePromptPress = () => {
//     setActivePill({ id: "prompts" });
//     fetchRandomPrompts();
//   };

//   {
//     /* feature pills from plus symbol Haven */
//   }
//   {
//     /* only renders if showPills is true */
//   }
//   return (
//     <View>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.pillScroll}
//         contentContainerStyle={styles.pillRow}
//       >
//         {/* not dynamic pills */}
//         <View style={styles.pillRow}>
//           <TouchableOpacity style={styles.pill} onPress={handleGamePress}>
//             <Ionicons name="game-controller-outline" size={20} color="black" />
//             <Text style={styles.pillText}>Games</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.pill} onPress={handlePromptPress}>
//             <Entypo name="chat" size={22} color="#000" />
//             <Text style={styles.pillText}>Prompts</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.pill} onPress={onNudgePress}>
//             <MaterialCommunityIcons
//               name="gesture-tap"
//               size={22}
//               color="black"
//             />
//             <Text style={styles.pillText}>Nudge </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.pill} onPress={onCheckinPress}>
//             <MaterialCommunityIcons name="hand-wave" size={20} color="black" />
//             <Text style={styles.pillText}>Mood | Need </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.pill} onPress={onHelpPress}>
//             <Ionicons name="alert-circle" size={22} color="black" />
//             <Text style={styles.pillText}>Need Help?</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* prompts pill */}
//       {activePill?.id === "prompts" && (
//         <View style={styles.promptPanel}>
//           <View style={styles.topHandle} />
//           <View style={styles.promptContainer}>
//             <Text style={styles.promptLabel}>Daily Prompts</Text>
//             <TouchableOpacity onPress={fetchRandomPrompts}>
//               <Ionicons name="refresh" size={20} color="#79a78c" />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={prompts}
//             keyExtractor={(item, index) =>
//               item?.prompt_id?.toString() ||
//               item?.id?.toString() ||
//               index.toString()
//             }
//             styles={styles.promptScroll}
//             contentContainerStyle={styles.promptList}
//             showsVerticalScrollIndicator={false}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.promptItem}
//                 onPress={() => {
//                   onPromptSelect?.(item.prompt_text);
//                   setActivePill(null);
//                 }}
//               >
//                 <Text style={styles.promptItemText}>{item?.prompt_text}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       )}

//       {/* games scrollview */}
//       {/* Games panel */}
//       {activePill?.id === "games" && (
//         <View style={styles.gamePanel}>
//           <View style={styles.topHandle} />
//           <TouchableOpacity
//             style={styles.gameItem}
//             onPress={() => {
//               setActivePill(null);
//             }}
//           >
//             <Image
//               source={require("../../assets/HavenIcons/GamesImage.jpeg")}
//               style={styles.gameImage}
//               resizeMode="cover"
//             />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   pillScroll: {
//     backgroundColor: "transparent",
//     marginBottom: 4,
//     height: 55,
//   },
//   pillRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   pill: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f8f3e6",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     marginHorizontal: 6,
//     borderRadius: 16,
//     gap: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   pillText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#4a4a4a",
//     letterSpacing: -0.2,
//   },
//   //bottom sheet drawer
//   drawerContainer: {
//     borderWidth: 1,
//     borderColor: "#4a4a4a",
//     borderRadius: 16,
//     paddingHorizontal: 10,
//     paddingTop: 8,
//     paddingBottom: 10,
//     marginHorizontal: 10,
//     marginBottom: 8,
//     backgroundColor: "transparent",
//   },
//   //prompts
//   promptPanel: {
//     width: "100%",
//     height: 300,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     overflow: "hidden",
//     marginTop: 8,
//     marginBottom: 8,
//     paddingTop: 20,
//     paddingHorizontal: 10,
//   },
//   promptContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   promptList: {
//     gap: 16,
//     paddingBottom: 4,
//   },
//   promptLabel: {
//     textAlign: "center",
//     fontSize: 12,
//     color: "#8a8a8a",
//     marginBottom: 4,
//     letterSpacing: 0.5,
//   },
//   promptItem: {
//     width: "100%",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 18,
//     backgroundColor: "#2E5A44",
//   },
//   promptItemText: {
//     fontSize: 15,
//     fontWeight: "500",
//     color: "#ffffff",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   gameContainer: {
//     borderWidth: 1,
//     borderColor: "#4a4a4a",
//     borderRadius: 16,
//     paddingHorizontal: 10,
//     paddingTop: 8,
//     paddingBottom: 10,
//     marginHorizontal: 10,
//     marginBottom: 8,
//     backgroundColor: "transparent",
//   },

//   //scrollview for game
//   scrollContent: {
//     flex: 1,
//     backgroundColor: "#ffff",
//     borderColor: "#606060",
//   },
//   scrollContentContainer: {
//     flexGrow: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     position: "relative",
//   },
//   gamePanel: {
//     width: "100%",
//     height: 400,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     overflow: "hidden",
//     marginTop: 4,
//     marginBottom: 8,
//   },
//   gameImage: {
//     width: "100%",
//     height: 500,
//     position: "absolute",
//     top: 0,
//     left: 0,
//   },
//   topHandle: {
//     position: "absolute",
//     top: 8,
//     alignSelf: "center",
//     width: 45,
//     height: 5,
//     borderRadius: 999,
//     backgroundColor: "rgba(255,255,255,0.8)",
//     zIndex: 10,
//   },
// });

//feature pills on ConversationScreen

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../utils/hooks/supabase";

// Row of pill buttons — lives above the input bar, next to the "+" toggle.
export function HavenPillsRow({
  activePill,
  setActivePill,
  onHelpPress,
  onNudgePress,
  onCheckinPress,
}) {
  const handleGamePress = () => setActivePill({ id: "games" });
  const handlePromptPress = () => setActivePill({ id: "prompts" });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.pillScroll}
      contentContainerStyle={styles.pillRow}
    >
      <TouchableOpacity style={styles.pill} onPress={handleGamePress}>
        <Ionicons name="game-controller-outline" size={20} color="black" />
        <Text style={styles.pillText}>Games</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={handlePromptPress}>
        <Entypo name="chat" size={22} color="#000" />
        <Text style={styles.pillText}>Prompts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={onNudgePress}>
        <MaterialCommunityIcons name="gesture-tap" size={22} color="black" />
        <Text style={styles.pillText}>Nudge </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={onCheckinPress}>
        <MaterialCommunityIcons name="hand-wave" size={20} color="black" />
        <Text style={styles.pillText}>Mood | Need </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill} onPress={onHelpPress}>
        <Ionicons name="alert-circle" size={22} color="black" />
        <Text style={styles.pillText}>Need Help?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Expanded panel (games / prompts) — render this BELOW the input bar in ConversationScreen.
// Expanded panel (games / prompts) — render this BELOW the input bar in ConversationScreen.
export function HavenPanel({ activePill, setActivePill, onPromptSelect }) {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (activePill?.id === "prompts") {
      fetchRandomPrompts();
    }
  }, [activePill?.id]);

  if (!activePill) return null;

  return (
    <View style={styles.panelContainer}>
      {activePill.id === "prompts" && (
        <View>
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
                onPress={() => {
                  onPromptSelect?.(item.prompt_text);
                  setActivePill(null);
                }}
              >
                <Text style={styles.promptItemText}>{item?.prompt_text}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {activePill.id === "games" && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pillScroll: {
    backgroundColor: "transparent",
    marginBottom: 4,
    height: 55,
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f3e6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a4a4a",
    letterSpacing: -0.2,
  },
  // promptPanel: {
  //   width: "100%",
  //   height: 300,
  //   backgroundColor: "#f8f3e6",
  //   borderRadius: 20,
  //   overflow: "hidden",
  //   marginTop: 8,
  //   marginBottom: 8,
  //   paddingTop: 20,
  //   paddingHorizontal: 10,
  // },
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
  // gamePanel: {
  //   width: "100%",
  //   height: 400,
  //   backgroundColor: "#fff",
  //   borderRadius: 20,
  //   overflow: "hidden",
  //   marginTop: 4,
  //   marginBottom: 8,
  // },
  gameImage: {
    width: "100%",
    height: 500,
    position: "absolute",
    top: 0,
    left: 0,
  },
  // topHandle: {
  //   position: "absolute",
  //   top: 8,
  //   alignSelf: "center",
  //   width: 45,
  //   height: 5,
  //   borderRadius: 999,
  //   backgroundColor: "rgba(255,255,255,0.8)",
  //   zIndex: 10,
  // },
  panelContainer: {
    width: "100%",
    backgroundColor: "#f8f3e6",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  promptContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  promptList: {
    gap: 12,
    paddingBottom: 4,
  },
  promptLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b6b6b",
    letterSpacing: 0.5,
  },
  promptItem: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#2E5A44",
  },
  promptItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#ffffff",
    lineHeight: 20,
  },
  gameImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
  },
});
