import { supabase } from "./supabaseClient";
import { CategoryWithVoteCount, ItemWithVotes } from "@/types";

export const fetchDashboardData = async (): Promise<
  CategoryWithVoteCount[]
> => {
  const { data, error } = await supabase.rpc("get_dashboard_data");

  if (error) throw error;

  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid data returned from get_dashboard_data");
  }

  return data.map((category: any) => ({
    id: category.id,
    name: category.name,
    itemCount: category.itemcount,
    voteCount: category.votecount,
    items: category.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      img: item.img,
      category_id: item.category_id,
      voteCount: item.voteCount,
    })),
  }));
};
