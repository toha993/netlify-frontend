"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

const AddCategoryPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim()) {
      toast.error("Please enter a category name");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim() })
      .select();

    if (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category. Please try again.");
    } else {
      toast.success("Category added successfully!");
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-2 py-1 text-slate-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryPage;
