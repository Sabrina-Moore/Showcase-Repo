import { supabase } from "../../utils/hooks/supabase";

export default function getStatusLabel(latestMessage, currentUserId) {
  if (!latestMessage) return "Double tap to Snap";

  const isMine = latestMessage.send_id === currentUserId;

  if (isMine) return "Delivered";
  if (!isMine) return "Received ";
  if (latestMessage.is_prompt) return "Sent a Prompt";
  //technically there should also be "New Chat" if you haven't opened message
}