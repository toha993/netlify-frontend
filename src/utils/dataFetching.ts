import { supabase } from "./supabaseClient";
import { CategoryWithVoteCount, ItemWithVotes } from "@/types";
import _ from "lodash";

interface RawDashboardItem {
  category_id: string;
  category_name: string;
  item_name: string;
  vote_count: number;
  item_id: string;
}

export const fetchDashboardData = async (): Promise<
  CategoryWithVoteCount[]
> => {
  const { data, error } = await supabase.rpc("get_dashboard");

  if (error) throw error;

  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid data returned from get_dashboard");
  }

  const groupedData = _.groupBy(data, "category_id");

  const result: CategoryWithVoteCount[] = Object.entries(groupedData).map(
    (entry) => {
      const [categoryId, items] = entry as [string, RawDashboardItem[]];

      const processedItems = items.map((item) => ({
        id: item.item_id,
        name: item.item_name,
        voteCount: item.vote_count,
        category_id: categoryId,
      }));

      return {
        id: categoryId,
        name: items[0].category_name,
        itemCount: processedItems.length,
        voteCount: _.sumBy(processedItems, "voteCount"),
        items: processedItems,
      };
    }
  );

  return result;
};
