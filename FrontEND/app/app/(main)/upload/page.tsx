"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";


interface IngredientAI {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  selected: boolean;
}

type UploadMode = "receipt" | "fridge";

const INVENTORY_BASE_URL =
    process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL ?? "http://localhost:5001";
const DEV_USER_ID = "user123";

export default function UploadPage() {
  const [mode, setMode] = useState<UploadMode>("fridge");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientAI[]>([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [addingToInventory, setAddingToInventory] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [nextIngredientId, setNextIngredientId] = useState(1);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const resetUpload = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedFile(null);
    setSelectedImage(null);
    setIngredients([]);
    setShowIngredients(false);
    setAnalyzing(false);
    setAnalyzeError(null);
    setAddedSuccess(false);
    setNextIngredientId(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setShowIngredients(false);
      setAddedSuccess(false);
      setAnalyzeError(null);
      setIngredients([]);
      setNextIngredientId(1);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setAnalyzeError("Please upload an image first.");
      return;
    }
    setAnalyzeError(null);
    setAddedSuccess(false);
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const endpoint = `${INVENTORY_BASE_URL}/inventory/detect?mode=${encodeURIComponent(mode)}`;
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : "Analysis failed.";
        throw new Error(detail);
      }
      const rawItems: unknown[] = Array.isArray(data) ? data : [];
      const names = rawItems
        .map((value: any) => (typeof value?.name === "string" ? value.name : null))
        .filter((value: string | null): value is string => Boolean(value));
      const mapped: IngredientAI[] = names.map((name: string, index: number) => ({
        id: index + 1,
        name,
        quantity: 1,
        unit: "pcs",
        selected: true,
      }));
      setIngredients(mapped);
      setNextIngredientId(mapped.length + 1);
      setShowIngredients(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach image processing service.";
      setAnalyzeError(message);
      setShowIngredients(false);
    } finally {
      setAnalyzing(false);
    }
  };

  const updateIngredient = (
    id: number,
    field: "name" | "quantity" | "unit" | "selected",
    value: string | number | boolean
  ) => {
    setIngredients((prev) =>
      prev.map((ingredient) => (ingredient.id === id ? { ...ingredient, [field]: value } : ingredient))
    );
  };

  const addIngredientRow = () => {
    setIngredients((prev) => [
      ...prev,
      { id: nextIngredientId, name: "", quantity: 1, unit: "pcs", selected: true },
    ]);
    setNextIngredientId((prev) => prev + 1);
  };

  const selectedIngredients = ingredients.filter((item) => item.selected && item.name.trim().length > 0);

  const handleAddToInventory = async () => {
    if (selectedIngredients.length === 0) {
      setAnalyzeError("Select at least one ingredient before adding to inventory.");
      return;
    }
    setAnalyzeError(null);
    setAddingToInventory(true);
    try {
      const token = localStorage.getItem("access_token");
      const payload = selectedIngredients.map((item) => ({
        name: item.name.trim(),
        quantity: Number.isFinite(item.quantity) ? item.quantity : 1,
        unit: item.unit.trim() || null,
      }));
      const endpoint = token
        ? `${INVENTORY_BASE_URL}/inventory/ai`
        : `${INVENTORY_BASE_URL}/inventory/ai?user_id=${encodeURIComponent(DEV_USER_ID)}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: token
          ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          : { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        setAnalyzeError("Session expired. Please log in again.");
        return;
      }
      if (!response.ok) {
        setAnalyzeError("Failed to add ingredients to inventory.");
        return;
      }
      setAddedSuccess(false);
      setAddedSuccess(true);
    } catch {
      setAnalyzeError("Unable to reach the inventory service.");
    } finally {
      setAddingToInventory(false);
    }
  };

  return (
    <div className="bg-base-100 min-h-screen">
       
       <main className="container mx-auto px-4 py-8">
          
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
               <h1 className="text-4xl font-bold mb-4">What's in your fridge?</h1>
               <p className="text-xl text-base-content/70">Upload a picture of your ingredients to manage your inventory.</p>
                             <div className="mt-6 flex justify-center">
                                    <div className="join">
                                        <button
                                            type="button"
                                            className={`btn join-item ${mode === "fridge" ? "btn-primary" : "btn-outline"}`}
                                            onClick={() => setMode("fridge")}
                                        >
                                            Fridge Image
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn join-item ${mode === "receipt" ? "btn-primary" : "btn-outline"}`}
                                            onClick={() => setMode("receipt")}
                                        >
                                            Receipt Image
                                        </button>
                                    </div>
                             </div>
            </div>

            {/* Upload Section */}
            <div className="card bg-base-100 shadow-xl border-2 border-dashed border-base-content/20 mb-16 overflow-hidden">
               <div className="card-body items-center text-center py-16 transition-colors hover:bg-base-200/50">
                   {!selectedImage ? (
                      <>
                          <div className="mb-6 rounded-full bg-primary/10 p-6">
                            <span className="icon-[tabler--camera] text-6xl text-primary"></span>
                          </div>
                                                    <h3 className="text-2xl font-bold mb-2">Upload {mode === "receipt" ? "a Receipt" : "a Fridge Image"}</h3>
                          <p className="text-base-content/60 mb-8 max-w-md">Supported formats: JPG, PNG. Max file size: 5MB.</p>
                          <div className="form-control w-full max-w-xs mx-auto">
                            <input 
                                type="file" 
                                className="file-input file-input-bordered file-input-primary w-full" 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                          </div>
                      </>
                   ) : (
                      <div className="relative w-full flex flex-col items-center">
                          <div className="relative w-full max-w-md h-80 mb-6">
                             <Image 
                                src={selectedImage} 
                                alt="Preview" 
                                fill
                                style={{ objectFit: "contain" }}
                                className="rounded-lg shadow-lg"
                             />
                          </div>
                         <div className="flex gap-4">
                            <button className="btn btn-outline btn-error" onClick={resetUpload}>
                                <span className="icon-[tabler--trash] size-5"></span>
                                          Reset
                             </button>
                             {!showIngredients && (
                                 <button 
                                    className="btn btn-primary" 
                                    onClick={handleAnalyze} 
                                    disabled={analyzing}
                                >
                                    {analyzing ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="icon-[tabler--scan] size-5"></span>
                                            Analyze Ingredients
                                        </>
                                    )}
                                 </button>
                             )}
                          </div>
                      </div>
                   )}
               </div>
            </div>

            {analyzeError && (
                <div className="alert alert-error mb-8">
                    <span className="icon-[tabler--alert-circle] size-6"></span>
                    <span>{analyzeError}</span>
                </div>
            )}

            {/* Ingredients Section */}
            {showIngredients && (
                <div className="slide-in-bottom fade-in duration-500">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-3xl font-bold text-base-content">
                           <span className="text-primary">Detected</span> Ingredients
                       </h2>
                       <div className="badge badge-outline badge-lg opacity-50">{ingredients.length} items found</div>
                    </div>
                    
                    <div className="bg-base-200 rounded-xl p-6 mb-8">
                        <div className="grid grid-cols-1 gap-4">
                            {ingredients.map((item) => (
                                <div key={item.id} className="p-4 bg-base-100 rounded-lg shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <span className="icon-[tabler--salad] size-6"></span>
                                        </div>
                                        <input
                                            className="input input-bordered md:col-span-4"
                                            value={item.name}
                                            onChange={(event) => updateIngredient(item.id, "name", event.target.value)}
                                            placeholder="Ingredient name"
                                        />
                                        <input
                                            type="number"
                                            min={0}
                                            className="input input-bordered md:col-span-2"
                                            value={item.quantity}
                                            onChange={(event) => updateIngredient(item.id, "quantity", Number(event.target.value))}
                                        />
                                        <input
                                            className="input input-bordered md:col-span-2"
                                            value={item.unit}
                                            onChange={(event) => updateIngredient(item.id, "unit", event.target.value)}
                                            placeholder="unit"
                                        />
                                        <label className="label cursor-pointer gap-2 md:col-span-2 justify-start">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={item.selected}
                                                onChange={(event) => updateIngredient(item.id, "selected", event.target.checked)}
                                            />
                                            <span className="label-text">Include</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-outline w-fit" onClick={addIngredientRow}>
                                <span className="icon-[tabler--plus] size-5"></span>
                                Add Ingredient Manually
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                         {addedSuccess ? (
                             <div className="flex flex-col items-end gap-2">
                                <div className="alert alert-success">
                                    <span className="icon-[tabler--check] size-6"></span>
                                    <span>Added to inventory successfully!</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Link href="/inventory" className="btn btn-outline">
                                        View Inventory
                                    </Link>
                                    <button className="btn btn-primary">
                                        <span className="icon-[tabler--bulb] size-5"></span>
                                        Get Recipe Suggestions
                                    </button>
                                </div>
                             </div>
                         ) : (
                            <button 
                                className="btn btn-primary btn-lg" 
                                onClick={handleAddToInventory}
                                disabled={addingToInventory}
                            >
                                {addingToInventory ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <span className="icon-[tabler--plus] size-5"></span>
                                        Add Selected to Inventory
                                    </>
                                )}
                            </button>
                         )}
                    </div>
                </div>
            )}
            
          </div>
       </main>
    </div>
  );
}
