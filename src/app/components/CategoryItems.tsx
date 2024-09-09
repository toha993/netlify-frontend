"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Item, Category } from "@/types";
import { getUserId } from "@/utils/userIdentification";
import { supabase } from "@/utils/supabaseClient";
import ItemGrid from "./ItemGrid";
import VoteButton from "./VoteButton";
import VoteDialog from "./VoteDialog";
import LoadingSpinner from "./LoadingSpinner";
import { handleVote } from "@/utils/voteHandling";
import { ChevronLeft, ChevronRight, FolderOpen, PackageX } from "lucide-react";

interface CategoryItemsProps {
  id: string;
}

const CategoryItems: React.FC<CategoryItemsProps> = ({ id }) => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingVote, setExistingVote] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  useEffect(() => {
    const initializeUser = async () => {
      const userId = await getUserId();
      setUserId(userId);
      if (userId) {
        await fetchCategories();
        await fetchCategoryItems();
        await checkPreviousVote(userId);
      }
    };

    initializeUser();
  }, [id]);

  useEffect(() => {
    if (categories.length > 0) {
      const index = categories.findIndex((category) => category.id === id);
      setCurrentCategoryIndex(index);
      setCurrentCategory(categories[index]);
    }
  }, [categories, id]);

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

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data as Category[]);
    }
  };

  const checkPreviousVote = async (userId: string) => {
    const { data, error } = await supabase
      .from("votes")
      .select("item_id")
      .eq("user_id", userId)
      .eq("category_id", id);

    if (error) {
      console.error("Error checking previous vote:", error);
    } else if (data && data.length > 0) {
      setExistingVote(data[0].item_id);
      setSelectedItem(data[0].item_id);
    } else {
      setExistingVote(null);
      setSelectedItem(null);
    }
  };

  const onVote = async () => {
    if (!selectedItem || !userId) return;

    const result = await handleVote(selectedItem, userId, id, existingVote);
    setDialogMessage(result.message);
    setIsDialogOpen(true);
    setExistingVote(result.newVote);
  };

  const navigateToCategory = (direction: "prev" | "next") => {
    let newIndex;

    if (direction === "prev") {
      newIndex = currentCategoryIndex - 1;
    } else {
      newIndex = currentCategoryIndex + 1;
    }

    if (newIndex >= 0 && newIndex < categories.length) {
      router.push(`/category/${categories[newIndex].id}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 relative min-h-screen flex flex-col">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-2 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white">
            {currentCategory ? currentCategory.name : <LoadingSpinner />}
          </h2>
        </div>
      </div>
      <div className="flex-grow flex flex-col mb-8">
        {items.length > 0 ? (
          <>
            <ItemGrid
              items={items}
              selectedItem={selectedItem}
              onItemSelect={setSelectedItem}
            />
            <div className="mt-8 flex justify-center">
              <VoteButton
                onVote={onVote}
                disabled={!selectedItem || existingVote === selectedItem}
                existingVote={existingVote}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow">
            <PackageX size={64} className="text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Items Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              There are currently no items in this category. Add some items to
              get started!
            </p>
          </div>
        )}
      </div>
      <VoteDialog
        isOpen={isDialogOpen}
        message={dialogMessage}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      />
      <div className="fixed bottom-4 left-0 right-0 flex justify-between px-4">
        <button
          onClick={() => navigateToCategory("prev")}
          disabled={currentCategoryIndex === 0}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${
            currentCategoryIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-colors duration-200`}
          aria-label="Previous Category"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => navigateToCategory("next")}
          disabled={currentCategoryIndex === categories.length - 1}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${
            currentCategoryIndex === categories.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-colors duration-200`}
          aria-label="Next Category"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
export default CategoryItems;
