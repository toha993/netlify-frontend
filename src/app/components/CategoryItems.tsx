"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Item } from "@/types";
import { getUserId } from "@/utils/userIdentification";
import { supabase } from "@/utils/supabaseClient";
import ItemGrid from "./ItemGrid";
import VoteButton from "./VoteButton";
import VoteDialog from "./VoteDialog";
import { handleVote } from "@/utils/voteHandling";

interface CategoryItemsProps {
  id: string;
}

const CategoryItems: React.FC<CategoryItemsProps> = ({ id }) => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingVote, setExistingVote] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  useEffect(() => {
    const initializeUser = async () => {
      const id = await getUserId();
      setUserId(id);
      if (id) {
        await fetchCategoryItems();
      }
    };

    initializeUser();
  }, [id]);

  useEffect(() => {
    if (userId && items.length > 0) {
      checkPreviousVote(userId);
    }
  }, [userId, items]);

  const fetchCategoryItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("category_id", id);

    if (error) {
      console.error("Error fetching items:", error);
    } else {
      setItems(data as Item[]);
    }
    setLoading(false);
  };

  const checkPreviousVote = async (userId: string) => {
    const { data, error } = await supabase
      .from("votes")
      .select("item_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error checking previous vote:", error);
    } else if (data && data.length > 0) {
      const categoryVote = data.find((vote) =>
        items.some((item) => item.id === vote.item_id)
      );
      if (categoryVote) {
        setExistingVote(categoryVote.item_id);
        setSelectedItem(categoryVote.item_id);
      }
    }
  };

  const onVote = async () => {
    if (!selectedItem || !userId) return;

    const result = await handleVote(selectedItem, userId, existingVote);
    setDialogMessage(result.message);
    setIsDialogOpen(true);
    setExistingVote(result.newVote);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">Vote for an Item</h2>
      <ItemGrid
        items={items}
        selectedItem={selectedItem}
        onItemSelect={setSelectedItem}
      />
      <VoteButton
        onVote={onVote}
        disabled={!selectedItem || existingVote === selectedItem}
        existingVote={existingVote}
      />
      <VoteDialog
        isOpen={isDialogOpen}
        message={dialogMessage}
        onClose={() => {
          setIsDialogOpen(false);
          router.push("/");
        }}
      />
    </div>
  );
};

export default CategoryItems;
