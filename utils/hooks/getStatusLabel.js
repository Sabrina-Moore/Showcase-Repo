import { supabase } from "../../utils/hooks/supabase";

export default function getStatusLabel(latestMsg, currentUserId) {
  if (!latestMsg) return "New Chat";
  if (latestMsg.sender_id === currentUserId) return "Sent";
  if (latestMsg.is_prompt) return "Sent a Prompt";
  return "Received";
}