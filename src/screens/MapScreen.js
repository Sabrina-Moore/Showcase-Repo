import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapHeader from "../components/MapHeader";
import MapPills from "../components/MapPills";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import ResourcesModal from "../components/ResourcesModal";
import { supabase } from "../../utils/hooks/supabase";
import LocationDetailSheet from "../components/LocationDetailSheet";

const DUMMY_FRIENDS = [
  {
    id: "1",
    ring: "#FF5A5F",
    image: require("../../assets/mapImages/friend1.png"),
  },
  {
    id: "2",
    ring: "#4CAF50",
    image: require("../../assets/mapImages/friend2.png"),
  },
  {
    id: "3",
    ring: "#FFC107",
    image: require("../../assets/mapImages/friend3.png"),
  },
  {
    id: "4",
    ring: "#2196F3",
    image: require("../../assets/mapImages/friend4.png"),
  },
  {
    id: "5",
    ring: "#E040FB",
    image: require("../../assets/mapImages/friend5.png"),
  },
  {
    id: "6",
    ring: "#FF9800",
    image: require("../../assets/mapImages/friend6.png"),
  },
  {
    id: "7",
    ring: "#00BCD4",
    image: require("../../assets/mapImages/friend7.png"),
  },
  {
    id: "8",
    ring: "#8BC34A",
    image: require("../../assets/mapImages/friend8.png"),
  },
];

const DEFAULT_AVATAR = require("../../assets/snapchat/personalBitmoji.png");

export default function MapScreen({ route, navigation }) {
  const { initialFilter } = route.params ?? {};
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activePill, setActivePill] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const [showDetailSheet, setShowDetailSheet] = useState(false); // controls the sheet only
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 34.0211573,
    longitude: -118.4503864,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //added so HavenTools in conversationScreen can navigate to page with resoources open
  useEffect(() => {
    if (initialFilter === "resources") {
      setActivePill("resources");
    }
  }, [initialFilter]);

  useEffect(() => {
    loadUserProfile();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setCurrentRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  async function loadUserProfile() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("bitmoji_icon")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile avatar:", error);
        return;
      }

      if (data?.bitmoji_icon) {
        setUserAvatar(data.bitmoji_icon);
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  }

  const avatarSource = userAvatar ? { uri: userAvatar } : DEFAULT_AVATAR;

  const handleSelectResource = (resource) => {
    if (!resource?.location) return;
    setActivePill(null); // closes ResourcesModal
    setSelectedResource(resource);
    setShowDetailSheet(true);
    setCurrentRegion({
      latitude: resource.location.latitude,
      longitude: resource.location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={currentRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {selectedResource && (
          <Marker
            coordinate={selectedResource.location}
            title={selectedResource.name}
            description={selectedResource.label}
            style={{ transform: [{ scale: 1.35 }] }}
          />
        )}
      </MapView>

      <View
        style={{ position: "absolute", top: insets.top, left: 0, right: 0 }}
      >
        <MapHeader cityLabel="LA" userAvatar={userAvatar} />
      </View>

      <View
        style={{ position: "absolute", top: insets.top, left: 0, right: 0 }}
      >
        <MapPills activePill={activePill} onSelectPill={setActivePill} />
      </View>

      {/* Right-side floating control stack: bitmoji, settings, layers, compass */}
      <View style={[styles.rightControlsStack, { bottom: tabBarHeight + 100 }]}>
        <View style={[styles.rightControlAvatar, styles.shadow]}>
          <Image style={styles.rightControlAvatarImage} source={avatarSource} />
          <View style={styles.rightControlBadge} />
        </View>

        <Pressable style={[styles.rightControlButton, styles.shadow]}>
          <Ionicons name="settings-outline" size={20} color="#1a1a1a" />
        </Pressable>

        <Pressable style={[styles.rightControlButton, styles.shadow]}>
          <Ionicons name="layers-outline" size={20} color="#1a1a1a" />
        </Pressable>

        <Pressable style={[styles.rightControlButton, styles.shadow]}>
          <Ionicons name="compass-outline" size={22} color="#1a1a1a" />
        </Pressable>
      </View>

      {/* Bottom overlay: locate-me button, friends strip */}
      <View style={[styles.mapFooter, { paddingBottom: tabBarHeight + 2 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.friendsStripWrapper}
          contentContainerStyle={styles.friendsStrip}
        >
          {DUMMY_FRIENDS.map((friend) => (
            <View
              key={friend.id}
              style={[styles.friendAvatarRing, { borderColor: friend.ring }]}
            >
              <Image style={styles.friendAvatarImage} source={friend.image} />
            </View>
          ))}
        </ScrollView>
      </View>

      <ResourcesModal
        visible={activePill === "resources"}
        onClose={() => setActivePill(null)}
        onSelectResource={handleSelectResource}
      />
      <LocationDetailSheet
        resource={selectedResource}
        visible={showDetailSheet}
        onClose={() => setShowDetailSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  mapFooter: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  locationContainer: {
    width: "100%",
    paddingBottom: 8,
    alignItems: "center",
  },
  userLocation: {
    backgroundColor: "white",
    borderRadius: 100,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  rightControlsStack: {
    position: "absolute",
    right: 16,
    alignItems: "center",
    gap: 14,
    zIndex: 8,
  },
  rightControlAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  rightControlAvatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  rightControlBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  rightControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  friendsStripWrapper: {
    marginBottom: 24,
  },
  friendsStrip: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: "center",
  },
  friendAvatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    padding: 2,
    backgroundColor: "#fff",
  },
  friendAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    resizeMode: "cover",
  },
});
