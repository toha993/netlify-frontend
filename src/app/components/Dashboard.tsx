"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryWithVoteCount } from "@/types";
import { fetchDashboardData } from "@/utils/dataFetching";
import CategoryCard from "./CategoryCard";
import LoadingSpinner from "./LoadingSpinner";
import { RefreshCw, FolderX } from "lucide-react";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithVoteCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const categoriesWithCounts = await fetchDashboardData();
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push(`/category/${categoryId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen">
      {categories.length > 0 ? (
        <div className="flex flex-wrap -mx-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
          <FolderX size={64} className="text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Categories Found
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            There are currently no categories available. Try refreshing or add a
            new category to get started.
          </p>
        </div>
      )}
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className={`fixed bottom-4 right-4 flex items-center justify-center w-12 h-12 rounded-full text-white ${
          refreshing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } transition-colors duration-200 shadow-lg`}
        aria-label="Refresh Data"
      >
        <RefreshCw size={24} className={refreshing ? "animate-spin" : ""} />
      </button>
    </div>
  );
};

export default Dashboard;
