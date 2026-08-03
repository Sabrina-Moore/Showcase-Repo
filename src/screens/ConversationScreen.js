import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function ConversationScreen({ route }) {
  const { chatbotName } = route.params;

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      name: chatbotName,
      text: "Hi Sarah",
      color: "#00A7B5",
    },
    {
      id: "2",
      sender: "me",
      name: "ME",
      text: "hi bob",
      color: "#FF2D55",
    },
  ]);

  const listRef = useRef();

  function sendMessage() {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: "me",
        name: "ME",
        text: message,
        color: "#FF2D55",
      },
    ]);

    setMessage("");
  }

  function renderMessage({ item }) {
    return (
      <View style={styles.messageWrapper}>
        <Text
          style={[
            styles.sender,
            {
              color: item.color,
            },
          ]}
        >
          {item.name}
        </Text>

        <View
          style={[
            styles.messageRow,
            {
              borderLeftColor: item.color,
            },
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}

      {/* <View style={styles.header}>
        <Ionicons name="chevron-back" size={32} />

        <View style={styles.avatar}>
          <Text>🙂</Text>
        </View>

        <Text style={styles.username}>{chatbotName}</Text>

        <View style={styles.headerIcons}>
          <Ionicons name="call" size={23} />

          <Ionicons name="videocam" size={25} />
        </View>
      </View> */}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
        />

        {/* INPUT AREA */}

        {/* INPUT AREA */}

        <View style={styles.inputBar}>
          {/* Camera */}
          <TouchableOpacity>
            <Ionicons name="camera" size={27} color="#000" />
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Chat"
            style={styles.input}
            onSubmitEditing={sendMessage}
          />

          {/* Dynamic Button */}
          {message.length > 0 ? (
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="arrow-up" size={22} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="mic" size={24} />
            </TouchableOpacity>
          )}

          {/* Emoji */}
          <TouchableOpacity>
            <Text style={styles.emoji}>🙂</Text>
          </TouchableOpacity>

          {/* Plus */}
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={28} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  avatar: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: "#FFFC00",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    flex: 1,
  },

  headerIcons: {
    flexDirection: "row",
    gap: 18,
  },

  messages: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  messageWrapper: {
    marginVertical: 7,
  },

  sender: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },

  messageRow: {
    borderLeftWidth: 3,
    paddingLeft: 8,
  },

  messageText: {
    fontSize: 18,
    color: "#222",
  },

  inputBar: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#F1F1F5",
    borderRadius: 20,
    paddingHorizontal: 18,
    fontSize: 17,
  },

  emoji: {
    fontSize: 25,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0A84FF",
    justifyContent: "center",
    alignItems: "center",
  },
});
