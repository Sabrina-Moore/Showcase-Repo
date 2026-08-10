//bottom sheet pulls up

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";

export default function CreateChat({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState("chat");
  const sheetRef = useRef(null);
  const [draft, setDraft] = useState("");

  const tabs = [
    {
      id: "chat",
      label: "New Chat",
      icon: "chatbubble-outline",
    },
    {
      id: "haven",
      label: "New Haven Chat",
      icon: "shield-checkmark-outline",
    },
    {
      id: "call",
      label: "New Call",
      icon: "call-outline",
    },
  ];

  useEffect(() => { 
    if (visible) { 
        sheetRef.current?.open(); 
    } else { 
        sheetRef.current?.close(); 
    } 
    }, [visible]);

    const handleSheetClose = () => { 
        onClose?.(); 
    };

  const renderContent = () => {
    switch (activeTab) {
      case "haven":
        return (
          <View style={styles.content}>
            <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="To:"
            style={styles.input}
            />

            <TouchableOpacity style={styles.inviteButton}>
              <Ionicons name="person-add-outline" size={20} color="#000" />
              <Text style={styles.inviteButtonText}>Invite People</Text>
            </TouchableOpacity>
          </View>
        );

      case "call":
        return (
          <View style={styles.content}>
            <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Call:"
            style={styles.input}
            />
 

            <TouchableOpacity style={styles.inviteButton}>
              <Ionicons name="person-add-outline" size={20} color="#000" />
              <Text style={styles.inviteButtonText}>Invite People</Text>
            </TouchableOpacity>
          </View>
        );

      case "chat":
      default:
        return (
          <View style={styles.content}>
            <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="To:"
            style={styles.input}
            />

            <TouchableOpacity style={styles.inviteButton}>
              <Ionicons name="person-add-outline" size={20} color="#000" />
              <Text style={styles.inviteButtonText}>Invite People</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <RBSheet 
    ref={sheetRef}
    height={800}
    closeOnDragDown={true}
    closeOnPressMask={true}
    draggable={true}
    dragFromTopOnly={true}
    onClose={handleSheetClose}
    customStyles={{
        container: styles.sheet,
        draggableIcon: styles.handle,
        wrapper: styles.wrapper,
    }}
    >
        {/* Bottom Sheet */}
        <View style={styles.sheet}>


          {/* Tabs */}
          <View style={styles.tabContainer}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    isActive && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={tab.icon}
                    size={19}
                    color={isActive ? "#000" : "#8E8E93"}
                  />

                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.activeTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tab Content */}
          {renderContent()}
        
      </View>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  wrapper: { 
    backgroundColor: "rgba(0, 0, 0, 0.45)", 
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    backgroundColor: "#FFFFFF", 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    paddingBottom: 30, 
    overflow: "hidden", 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D1D1D6",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    textAlign: "center",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inviteButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F2F2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
});