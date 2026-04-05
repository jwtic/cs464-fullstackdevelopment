"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL ?? "http://localhost:5001";
const DEV_USER_ID = "user123";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  if (!token) return { "Content-Type": "application/json" };
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function withUserIdFallback(path: string): string {
  const token = localStorage.getItem("access_token");
  if (token) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}user_id=${encodeURIComponent(DEV_USER_ID)}`;
}

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add item modal state
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newUnit, setNewUnit] = useState("pcs");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(withUserIdFallback(`${BASE_URL}/inventory/`), {
        headers: getAuthHeaders(),
      });
      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        return;
      }
      if (!response.ok) {
        setError("Failed to fetch inventory.");
        return;
      }
      const data = await response.json();
      setIngredients(data);
    } catch {
      setError("Unable to reach the inventory service.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(withUserIdFallback(`${BASE_URL}/inventory/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setIngredients((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      setError("Failed to delete ingredient.");
    }
  };

  const openModal = () => {
    setNewName("");
    setNewQuantity(1);
    setNewUnit("pcs");
    setAddError("");
    setShowModal(true);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setAddError("Name is required.");
      return;
    }
    setAdding(true);
    setAddError("");
    try {
      const response = await fetch(withUserIdFallback(`${BASE_URL}/inventory/`), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newName.trim(), quantity: newQuantity, unit: newUnit || null }),
      });
      if (response.status === 401) {
        setAddError("Session expired. Please log in again.");
        return;
      }
      if (!response.ok) {
        setAddError("Failed to add ingredient.");
        return;
      }
      const item = await response.json();
      setIngredients((prev) => {
        const exists = prev.find((i) => i.id === item.id);
        if (exists) {
          return prev.map((i) => (i.id === item.id ? item : i));
        }
        return [...prev, item];
      });
      setShowModal(false);
    } catch {
      setAddError("Unable to reach the inventory service.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-base-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Inventory</h1>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={openModal}>
                Add Item
              </button>
              <Link href="/upload" className="btn btn-primary">
                Upload Picture
              </Link>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : ingredients.length === 0 ? (
            <div className="text-center py-16 bg-base-200 rounded-xl">
              <h3 className="text-2xl font-semibold mb-2">Pantry is empty</h3>
              <p className="text-base-content/70 mb-6">Add items manually or upload a photo of your groceries.</p>
              <div className="flex gap-3 justify-center">
                <button className="btn btn-outline" onClick={openModal}>Add Item</button>
                <Link href="/upload" className="btn btn-primary">Upload Picture</Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {ingredients.map((item) => (
                <div key={item.id || item.name} className="card bg-base-100 shadow-md border border-base-content/10">
                  <div className="card-body flex-row items-center justify-between p-6">
                    <div>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-base-content/70">{item.quantity} {item.unit ?? ""}</p>
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

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="bg-base-100 rounded-box relative z-10 w-full max-w-md p-6 shadow-xl mx-4">
            <h3 className="font-bold text-lg mb-4">Add Ingredient</h3>
            <form onSubmit={handleAddItem}>
              <div className="form-control w-full mb-3">
                <label className="label"><span className="label-text">Name</span></label>
                <input
                  type="text"
                  placeholder="e.g. Tomato"
                  className="input input-bordered w-full"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mb-3">
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text">Quantity</span></label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className="input input-bordered w-full"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text">Unit</span></label>
                  <input
                    type="text"
                    placeholder="e.g. pcs, g, ml"
                    className="input input-bordered w-full"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                  />
                </div>
              </div>
              {addError && (
                <div className="alert alert-error mb-3">
                  <span>{addError}</span>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={adding}>
                  {adding ? <span className="loading loading-spinner loading-sm"></span> : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
