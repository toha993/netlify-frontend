import { supabase } from "./supabaseClient";
import {
  Category,
  Item,
  Vote,
  CategoryWithVoteCount,
  ItemWithVotes,
} from "@/types";

export const fetchDashboardData = async (): Promise<
  CategoryWithVoteCount[]
> => {
  const [categoriesData, itemsData, votesData] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("items").select("*"),
    supabase.from("votes").select("*"),
  ]);

  if (categoriesData.error) throw categoriesData.error;
  if (itemsData.error) throw itemsData.error;
  if (votesData.error) throw votesData.error;

  const categoriesWithCounts: CategoryWithVoteCount[] = (
    categoriesData.data as Category[]
  ).map((category) => {
    const categoryItems: ItemWithVotes[] = (itemsData.data as Item[])
      .filter((item) => item.category_id === category.id)
      .map((item) => ({
        ...item,
        voteCount: (votesData.data as Vote[]).filter(
          (vote) => vote.item_id === item.id
        ).length,
      }));

    const totalVotes = categoryItems.reduce(
      (sum, item) => sum + item.voteCount,
      0
    );

    return {
      ...category,
      itemCount: categoryItems.length,
      voteCount: totalVotes,
      items: categoryItems
        .sort((a, b) => b.voteCount - a.voteCount)
        .slice(0, 5), // Top 5 items
    };
  });

  return categoriesWithCounts;
};
