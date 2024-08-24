import { supabase } from "./supabaseClient";

export const handleVote = async (
  selectedItem: string,
  userId: string,
  existingVote: string | null
) => {
  try {
    if (existingVote) {
      if (existingVote !== selectedItem) {
        const { error } = await supabase
          .from("votes")
          .update({ item_id: selectedItem })
          .eq("user_id", userId)
          .eq("item_id", existingVote);

        if (error) throw error;

        return {
          message: "Your vote has been updated successfully!",
          newVote: selectedItem,
        };
      } else {
        return {
          message: "You have not changed your vote.",
          newVote: existingVote,
        };
      }
    } else {
      const { error } = await supabase
        .from("votes")
        .insert({ user_id: userId, item_id: selectedItem });

      if (error) throw error;

      return {
        message: "Your vote has been submitted successfully!",
        newVote: selectedItem,
      };
    }
  } catch (error) {
    console.error("Error handling vote:", error);
    return {
      message:
        "An error occurred while processing your vote. Please try again.",
      newVote: existingVote,
    };
  }
};
