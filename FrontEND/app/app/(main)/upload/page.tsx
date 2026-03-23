"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";


interface IngredientAI {
  name: string;
  quantity: number;
  unit: string;
}

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientAI[]>([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [addingToInventory, setAddingToInventory] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const userId = "user123";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
         setSelectedImage(URL.createObjectURL(e.target.files[0]));
         setShowIngredients(false);
         setAddedSuccess(false);
         setIngredients([]);
     }
  };

  const handleAnalyze = () => {
      setAnalyzing(true);
      // Mock API call to analyze image
      setTimeout(() => {
          setIngredients([
              { name: "Tomato", quantity: 5, unit: "pcs" },
              { name: "Mozzarella Cheese", quantity: 200, unit: "g" },
              { name: "Basil", quantity: 1, unit: "bunch" },
              { name: "Olive Oil", quantity: 1, unit: "bottle" },
          ]);
          setAnalyzing(false);
          setShowIngredients(true);
      }, 2000);
  };

  const handleAddToInventory = async () => {
        setAddingToInventory(true);
        // Simulate API call
        setTimeout(() => {
            setAddedSuccess(true);
            setAddingToInventory(false);
        }, 1500);
        
        // try {
        //     const response = await fetch(`http://localhost:8000/inventory/ai?user_id=${userId}`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(ingredients),
        //     });

        //     if (response.ok) {
        //         setAddedSuccess(true);
        //     } else {
        //         console.error("Failed to add to inventory");
        //     }
        // } catch (error) {
        //     console.error("Error adding to inventory:", error);
        // } finally {
        //     setAddingToInventory(false);
        // }
  };

  return (
    <div className="bg-base-100 min-h-screen">
       
       <main className="container mx-auto px-4 py-8">
          
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
               <h1 className="text-4xl font-bold mb-4">What's in your fridge?</h1>
               <p className="text-xl text-base-content/70">Upload a picture of your ingredients to manage your inventory.</p>
            </div>

            {/* Upload Section */}
            <div className="card bg-base-100 shadow-xl border-2 border-dashed border-base-content/20 mb-16 overflow-hidden">
               <div className="card-body items-center text-center py-16 transition-colors hover:bg-base-200/50">
                   {!selectedImage ? (
                      <>
                          <div className="mb-6 rounded-full bg-primary/10 p-6">
                            <span className="icon-[tabler--camera] text-6xl text-primary"></span>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Upload or Take a Photo</h3>
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
                             <button className="btn btn-outline btn-error" onClick={() => setSelectedImage(null)}>
                                <span className="icon-[tabler--trash] size-5"></span>
                                Remove
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {ingredients.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <span className="icon-[tabler--salad] size-6"></span>
                                        </div>
                                        <div>
                                            <span className="font-bold block">{item.name}</span>
                                            <span className="text-sm opacity-70">{item.quantity} {item.unit}</span>
                                        </div>
                                    </div>
                                    <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                                </div>
                            ))}
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
                                        Add All to Inventory
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
