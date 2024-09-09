"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import { Category } from "@/types";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";

const MAX_WIDTH = 640;
const MAX_HEIGHT = 440;

interface CategoryOption {
  value: string;
  label: string;
}

const AddItemPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories. Please refresh the page.");
    } else {
      setCategories(
        data.map((category: Category) => ({
          value: category.id,
          label: category.name,
        }))
      );
    }
  };

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          }, file.type);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      try {
        const resizedBlob = await resizeImage(file);
        const resizedFile = new File([resizedBlob], file.name, {
          type: file.type,
        });
        setImageFile(resizedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(resizedBlob);
      } catch (error) {
        console.error("Error resizing image:", error);
        toast.error("Error processing image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !imageFile || !categoryId) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      const { data, error } = await supabase
        .from("items")
        .insert({
          name,
          img: base64Image,
          category_id: categoryId,
        })
        .select();

      if (error) {
        console.error("Error adding item:", error);
        toast.error("Error adding item. Please try again.");
      } else {
        toast.success("Item added successfully!");
        router.push(`/category/${categoryId}`);
      }

      setLoading(false);
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block mb-1">
            Category
          </label>
          <Select
            id="category"
            options={categories}
            value={categories.find((cat) => cat.value === categoryId)}
            onChange={(selectedOption) =>
              setCategoryId(selectedOption?.value || "")
            }
            className="react-select-container text-slate-600"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border text-slate-600 rounded px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full border rounded px-2 py-1"
          />
          {imagePreview && (
            <div className="mt-2 relative w-full h-60">
              <Image
                src={imagePreview}
                alt="Preview"
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default AddItemPage;
