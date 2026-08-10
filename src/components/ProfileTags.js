import { useEffect, useState } from "react";
import { View, Text , StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../utils/hooks/supabase";


//fetches for ProfileScreen tags/info and ConversationProfileScreen
export function ProfileTags ({userId}) {
  const [profile, setProfile] = useState(null);


  const [currentUserId, setCurrentUserId] = useState(null);
  const [userBitmoji, setUserBitmoji] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(null);
  const [snapScore, setSnapScore] = useState(null);
  const [userBirthday, setUserBirthday] = useState(null);
  const [astrologySign, setAstrologySign] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [school, setSchool] = useState(null);

  
//takes userId, either currentUser or otherParticipant
  useEffect(() => {
      const fetchProfile= async () => {
        if(!userId) return;

        const { data: profile, error:profileError } = await supabase
        .from("profiles")
        .select(`username, email, birthday, snap_score, bitmoji_icon, bitmoji_pose,
            astrology_sign, city, state, school`)
        .eq("user_id", userId)
        .single();

        if(profileError){
        console.log("Profile fetch error:", profileError);
        return;
        }

        console.log("Profile:", profile);
           
        if(profile){
            setUserBitmoji(profile.bitmoji_pose);
            setEmail(profile.email);
            setUsername(profile.username);
            setSnapScore(profile.snap_score);
            setUserBirthday(profile.birthday);
            setAstrologySign(profile.astrology_sign);
            setCity(profile.city);
            setState(profile.state);
            setSchool(profile.school);
        }
        
      };
      fetchProfile();
    }, [userId]);

    
    //render only tags and info near top of screen

return (
    <View style={styles.tagRow}>
      {userBirthday ? (
        <View style={styles.tag}>
            <Ionicons name="balloon" size={16} color="red" />
            <Text style={styles.tagText}> {userBirthday}</Text>
        </View>
        ) : null}
        {astrologySign ? (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{astrologySign}</Text>
        </View>
        ) : null}
        {city && state ? (
        <View style={styles.tag}>
            <Ionicons name="location-outline" size={14} color="#555" />
            <Text style={styles.tagText}>
            {" "}
            {city}, {state}
            </Text>
        </View>
        ) : null}
        {school ? (
        <View style={styles.tag}>
            <Ionicons name="school-outline" size={14} color="#555" />
            <Text style={styles.tagText}> {school}</Text>
        </View>
        ) : null}
         {snapScore != null ? (
            <View style={styles.tag}>
            <Text style={styles.tagText}>🔥 {snapScore}</Text>
            </View>
        ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
    profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
   profileText: {
    flex: 1,
  },
   profileName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111111",
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 15,
    color: "#777777",
  },
  //tags
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
    
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555555",
  },
});



  