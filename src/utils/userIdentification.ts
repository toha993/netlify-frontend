import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getUserId(): Promise<string> {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = generateUserId();
      localStorage.setItem("userId", userId);

      // Save the new user to the database
      const { error } = await supabase
        .from("users")
        .insert({ id: userId, user_id: userId });

      if (error) {
        console.error("Error saving user:", error);
      }
    }

    return userId;
  }

  return "server-side";
}

function generateUserId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
