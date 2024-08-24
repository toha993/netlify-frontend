"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryWithVoteCount } from "@/types";
import { fetchDashboardData } from "@/utils/dataFetching";
import CategoryCard from "./CategoryCard";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithVoteCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push(`/category/${categoryId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Voting Dashboard</h1>
      <button
        onClick={fetchData}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Refresh Data
      </button>
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
    </div>
  );
};

export default Dashboard;
