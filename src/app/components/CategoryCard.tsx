import React from "react";
import { CategoryWithVoteCount } from "@/types";
import CategoryChart from "./CategoryChart";

interface CategoryCardProps {
  category: CategoryWithVoteCount;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onClick,
}) => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
      <div
        className={`h-full bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-lg"
        }`}
        onClick={onClick}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {category.name}
          </h2>
          <p className="text-gray-600 mb-2">Items: {category.itemCount}</p>
          <p className="text-gray-600 mb-4">
            Total Votes: {category.voteCount}
          </p>
          {category.voteCount > 0 ? (
            <div className="h-64">
              <CategoryChart items={category.items} />
            </div>
          ) : (
            <p className="text-gray-500 italic">No votes yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
