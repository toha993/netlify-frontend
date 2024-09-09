import React from "react";
import { Item } from "@/types";
import Image from "next/image";

interface ItemGridProps {
  items: Item[];
  selectedItem: string | null;
  onItemSelect: (itemId: string) => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  selectedItem,
  onItemSelect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`bg-white cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-200 ${
            selectedItem === item.id
              ? "ring-2 ring-blue-500 bg-blue-200"
              : "hover:shadow-lg hover:bg-gray-50"
          }`}
          onClick={() => onItemSelect(item.id)}
        >
          <div className="aspect-w-1 aspect-h-1">
            <Image
              src={item.img || "/not-found.jpg"}
              alt={item.name}
              width={0}
              height={0}
              className="w-full object-fit"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {item.name}
            </h3>
            {selectedItem === item.id && (
              <p className="text-blue-600 font-medium">Selected</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
