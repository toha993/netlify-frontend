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
    <div className="flex flex-wrap -mx-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
        >
          <div
            className={`h-full flex flex-col cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-200 ${
              selectedItem === item.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:shadow-lg hover:bg-gray-50"
            }`}
            onClick={() => onItemSelect(item.id)}
          >
            <Image
              src={item.img || "/not-found.jpg"}
              alt={item.name}
              className="w-full h-48 object-cover"
              height={440}
              width={640}
            />
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {item.name}
              </h3>
              {selectedItem === item.id && (
                <p className="text-blue-600 font-medium">Selected</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
