"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Tomato", quantity: 5, unit: "pcs" },
    { id: "2", name: "Mozzarella Cheese", quantity: 200, unit: "g" },
    { id: "3", name: "Basil", quantity: 1, unit: "bunch" },
    { id: "4", name: "Olive Oil", quantity: 1, unit: "bottle" },
    { id: "5", name: "Pasta", quantity: 500, unit: "g" },
  ]);
  const [loading, setLoading] = useState(false);
  const userId = "user123"; // Hardcoded for demo

  const handleDelete = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  // useEffect(() => {
  //   fetchInventory();
  // }, []);

  // const fetchInventory = async () => {
  //   try {
  //     // Assuming a proxy or direct call. 
  //     // If direct call to localhost:8000, we might need CORS or proxy configuration.
  //     // For now trying local api path, assuming nextjs might proxy or we use full url.
  //     // Let's try full URL for localhost assuming the user is running both locally.
  //     const response = await fetch(`http://localhost:8000/inventory/?user_id=${userId}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setIngredients(data);
  //     } else {
  //       console.error("Failed to fetch inventory");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching inventory:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="bg-base-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Inventory</h1>
                <Link href="/upload" className="btn btn-primary">
                    Add Items
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : ingredients.length === 0 ? (
                <div className="text-center py-16 bg-base-200 rounded-xl">
                    <h3 className="text-2xl font-semibold mb-2">Pantry is empty</h3>
                    <p className="text-base-content/70 mb-6">Upload a photo of your groceries to fill it up!</p>
                    <Link href="/upload" className="btn btn-primary">
                        Go to Upload
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {ingredients.map((item) => (
                        <div key={item.id || item.name} className="card bg-base-100 shadow-md border border-base-content/10">
                            <div className="card-body flex-row items-center justify-between p-6">
                                <div>
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <p className="text-base-content/70">{item.quantity} {item.unit}</p>
                                </div>
                                                        <button 
                                className="btn btn-error btn-outline btn-sm"
                                onClick={() => handleDelete(item.id)}
                            >
                                
                                Remove
                            </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
