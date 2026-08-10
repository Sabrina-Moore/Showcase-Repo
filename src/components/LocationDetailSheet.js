import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const POPULAR_TIMES = [20, 25, 35, 55, 70, 60, 45, 50, 65, 40, 25, 15];

// ---- bottom sheet sizing / snap points ----
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const FULL_SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;
const PEEK_SHEET_HEIGHT = 230; // just the pinned header is visible
const SNAP_FULL = 0;
const SNAP_PEEK = FULL_SHEET_HEIGHT - PEEK_SHEET_HEIGHT;
const SNAP_CLOSED = FULL_SHEET_HEIGHT;
const SNAP_POSITIONS = [SNAP_FULL, SNAP_PEEK, SNAP_CLOSED];
const CLOSED_INDEX = SNAP_POSITIONS.length - 1;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function LocationDetailSheet({ resource, visible, onClose }) {
  const [selectedDay, setSelectedDay] = useState("Fri");

  const translateY = useRef(new Animated.Value(SNAP_FULL)).current;
  const snapIndexRef = useRef(0); // 0 = full, 1 = peek, 2 = closed
  const dragStartValue = useRef(0);

  // keep the latest onClose without recreating the PanResponder
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // reset to full every time the sheet is (re)opened
  useEffect(() => {
    if (visible) {
      translateY.setValue(SNAP_FULL);
      snapIndexRef.current = 0;
    }
  }, [visible, resource]);

  const snapTo = (index) => {
    snapIndexRef.current = index;
    Animated.spring(translateY, {
      toValue: SNAP_POSITIONS[index],
      useNativeDriver: true,
      bounciness: 4,
      speed: 14,
    }).start(() => {
      if (index === CLOSED_INDEX) {
        onCloseRef.current?.();
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 4,
      onPanResponderGrant: () => {
        dragStartValue.current = SNAP_POSITIONS[snapIndexRef.current];
      },
      onPanResponderMove: (_, gestureState) => {
        const next = clamp(
          dragStartValue.current + gestureState.dy,
          SNAP_FULL,
          SNAP_CLOSED,
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gestureState) => {
        const released = clamp(
          dragStartValue.current + gestureState.dy,
          SNAP_FULL,
          SNAP_CLOSED,
        );
        // bias toward the direction of the flick
        const projected = released + gestureState.vy * 60;

        let closestIndex = 0;
        let minDist = Infinity;
        SNAP_POSITIONS.forEach((pos, idx) => {
          const dist = Math.abs(pos - projected);
          if (dist < minDist) {
            minDist = dist;
            closestIndex = idx;
          }
        });
        snapTo(closestIndex);
      },
    }),
  ).current;

  if (!resource || !resource.details) return null;
  const d = resource.details;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => snapTo(CLOSED_INDEX)}
    >
      <View style={styles.backdrop} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheet,
            { height: FULL_SHEET_HEIGHT, transform: [{ translateY }] },
          ]}
        >
          {/* Pinned drag area: handle + header. Not inside the ScrollView
              so the gesture never fights with scrolling the content below. */}
          <View {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />

            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.avatarRing}>
                  <Image style={styles.avatarImage} source={resource.image} />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.title}>{resource.name}</Text>
                  <Text style={styles.subtitle}>
                    {resource.label} · {d.priceLevel}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.openNow}>Open Now</Text>
                    <Text style={styles.ratingText}>
                      {"  ★".repeat(Math.round(d.rating)).trim()} {d.rating} (
                      {d.ratingCount})
                    </Text>
                  </View>
                </View>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => snapTo(CLOSED_INDEX)}
              >
                <Ionicons name="close" size={18} color="#1a1a1a" />
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Tags */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsRow}
            >
              {d.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Quick actions */}
            <View style={styles.actionsRow}>
              <View style={styles.actionPill}>
                <Ionicons name="heart-outline" size={16} color="#1a1a1a" />
                <Text style={styles.actionText}>{d.favoritesCount}</Text>
              </View>
              <View style={styles.actionPill}>
                <Ionicons name="time-outline" size={16} color="#1a1a1a" />
                <Text style={styles.actionText}>{d.visitDuration}</Text>
              </View>
              <Pressable style={styles.shareButton}>
                <Ionicons name="arrow-redo-outline" size={18} color="#fff" />
              </Pressable>
            </View>

            {/* Photo carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosRow}
            >
              {d.photos.map((photo, i) => (
                <Image key={i} source={photo} style={styles.photo} />
              ))}
            </ScrollView>

            {/* Hours */}
            <View style={styles.rowCard}>
              <Ionicons name="time-outline" size={20} color="#1a1a1a" />
              <View style={styles.rowCardText}>
                <Text style={styles.openNowLarge}>Open Now</Text>
                <Text style={styles.rowCardSub}>{d.hoursToday}</Text>
              </View>
            </View>

            {/* Popular times */}
            <Text style={styles.sectionTitle}>Popular Times</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayTabsRow}
            >
              {DAYS.map((day) => {
                const isActive = selectedDay === day;
                return (
                  <Pressable
                    key={day}
                    style={[styles.dayTab, isActive && styles.dayTabActive]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayTabText,
                        isActive && styles.dayTabTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Text style={styles.popularTimesNote}>{d.popularTimesNote}</Text>
            <View style={styles.chartRow}>
              {POPULAR_TIMES.map((val, i) => (
                <View
                  key={i}
                  style={[styles.chartBar, { height: Math.max(val, 8) }]}
                />
              ))}
            </View>

            {/* Info rows */}
            <InfoRow icon="location-outline" label="Address" sub={d.address} />
            <InfoRow icon="call-outline" label="Call" sub={d.phone} />
            <InfoRow
              icon="globe-outline"
              label="Visit Website"
              sub={d.website}
            />
            <InfoRow icon="flag-outline" label="Report an issue" />

            {/* Reviews */}
            <Text style={styles.sectionTitle}>Reviews</Text>
            {d.reviews.map((review, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewSource}>{review.source}</Text>
                  <Text style={styles.reviewStars}>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}

            <View style={{ height: 24 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function InfoRow({ icon, label, sub }) {
  return (
    <Pressable style={styles.infoRow}>
      <Ionicons name={icon} size={20} color="#1a1a1a" />
      <View style={styles.infoRowText}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        {sub ? <Text style={styles.infoRowSub}>{sub}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
    </Pressable>
  );
}

const ACCENT = "#8A5FD6";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  dragHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8D8D8",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: ACCENT,
    padding: 2,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    resizeMode: "cover",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  openNow: {
    color: "#3C9A5C",
    fontWeight: "700",
    fontSize: 13,
  },
  ratingText: {
    fontSize: 13,
    color: "#1a1a1a",
    marginLeft: 6,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },
  tagsRow: {
    gap: 8,
    paddingVertical: 12,
  },
  tagPill: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a4a4a",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  shareButton: {
    marginLeft: "auto",
    backgroundColor: "#2E9CFF",
    borderRadius: 20,
    width: 44,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  photosRow: {
    gap: 8,
    marginBottom: 16,
  },
  photo: {
    width: 140,
    height: 140,
    borderRadius: 12,
    resizeMode: "cover",
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  rowCardText: {
    flex: 1,
  },
  openNowLarge: {
    color: "#3C9A5C",
    fontWeight: "700",
    fontSize: 15,
  },
  rowCardSub: {
    fontSize: 13,
    color: "#4a4a4a",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  dayTabsRow: {
    gap: 6,
    marginBottom: 6,
  },
  dayTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  dayTabActive: {
    backgroundColor: "#2E9CFF",
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A8A8A",
  },
  dayTabTextActive: {
    color: "#fff",
  },
  popularTimesNote: {
    fontSize: 12,
    color: "#2E9CFF",
    fontWeight: "600",
    marginBottom: 8,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 80,
    marginBottom: 20,
  },
  chartBar: {
    width: 14,
    backgroundColor: "#BEE0FF",
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoRowText: {
    flex: 1,
  },
  infoRowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  infoRowSub: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  reviewCard: {
    marginBottom: 14,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  reviewSource: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  reviewStars: {
    fontSize: 13,
    color: "#3C9A5C",
  },
  reviewDate: {
    fontSize: 12,
    color: "#8A8A8A",
    marginLeft: "auto",
  },
  reviewText: {
    fontSize: 13,
    color: "#4a4a4a",
    lineHeight: 18,
  },
});
