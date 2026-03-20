"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
         setSelectedImage(URL.createObjectURL(e.target.files[0]));
     }
  };

  return (
    <div className="bg-base-100 min-h-screen">
       
       <main className="container mx-auto px-4 py-8">
          
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
               <h1 className="text-4xl font-bold mb-4">What's in your fridge?</h1>
               <p className="text-xl text-base-content/70">Upload a picture of your ingredients and we'll suggest recipes.</p>
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
                             <button className="btn btn-primary">
                                <span className="icon-[tabler--sparkles] size-5"></span>
                                Generate Recipes
                             </button>
                          </div>
                      </div>
                   )}
               </div>
            </div>

            {/* Recipes Section - Shown nicely below */}
            <div>
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-3xl font-bold text-base-content">
                       <span className="text-primary">Suggested</span> Recipes
                   </h2>
                   <div className="badge badge-outline badge-lg opacity-50">3 results</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {/* Mock Recipe Card 1 */}
                   <div className="card bg-base-100 shadow-xl group hover:shadow-2xl transition-all duration-300 border border-base-content/5">
                      <figure className="h-52 overflow-hidden relative">
                           <Image 
                             src="/assets/img/dishes-hero.png" 
                             alt="Recipe" 
                             width={400} 
                             height={300} 
                             className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                           />
                           <div className="absolute top-4 right-4 badge badge-success text-white font-medium">15 min</div>
                      </figure>
                      <div className="card-body p-6">
                          <div className="flex gap-1 mb-2">
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star] text-base-content/30 size-4"></span>
                             <span className="text-xs text-base-content/60 ml-2">(4.0)</span>
                          </div>
                          <h2 className="card-title text-xl mb-2">Margherita Pizza</h2>
                          <p className="text-base-content/70 line-clamp-2 text-sm">Classic pizza with fresh mozzarella, tomatoes, and basil.</p>
                          <div className="card-actions justify-end mt-4">
                              <button className="btn btn-primary btn-sm btn-wide">View Recipe</button>
                          </div>
                      </div>
                   </div>

                   {/* Mock Recipe Card 2 */}
                   <div className="card bg-base-100 shadow-xl group hover:shadow-2xl transition-all duration-300 border border-base-content/5">
                      <figure className="h-52 overflow-hidden relative">
                           <Image 
                             src="/assets/img/pizza.png" 
                             alt="Recipe" 
                             width={400} 
                             height={300} 
                             className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                           />
                           <div className="absolute top-4 right-4 badge badge-warning text-white font-medium">30 min</div>
                      </figure>
                      <div className="card-body p-6">
                           <div className="flex gap-1 mb-2">
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-half-filled] text-warning size-4"></span>
                             <span className="text-xs text-base-content/60 ml-2">(4.5)</span>
                          </div>
                          <h2 className="card-title text-xl mb-2">Pepperoni Passion</h2>
                          <p className="text-base-content/70 line-clamp-2 text-sm">Spicy pepperoni with a rich tomato sauce base and crispy crust.</p>
                          <div className="card-actions justify-end mt-4">
                              <button className="btn btn-primary btn-sm btn-wide">View Recipe</button>
                          </div>
                      </div>
                   </div>

                   {/* Mock Recipe Card 3 */}
                   <div className="card bg-base-100 shadow-xl group hover:shadow-2xl transition-all duration-300 border border-base-content/5">
                      <figure className="h-52 overflow-hidden relative">
                           <Image 
                             src="/assets/img/mint.png" 
                             alt="Recipe" 
                             width={400} 
                             height={300} 
                             className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                           />
                            <div className="absolute top-4 right-4 badge badge-error text-white font-medium">45 min</div>
                      </figure>
                      <div className="card-body p-6">
                          <div className="flex gap-1 mb-2">
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="icon-[tabler--star-filled] text-warning size-4"></span>
                             <span className="text-xs text-base-content/60 ml-2">(5.0)</span>
                          </div>
                          <h2 className="card-title text-xl mb-2">Minty Fresh Salad</h2>
                          <p className="text-base-content/70 line-clamp-2 text-sm">A refreshing salad with mint, cucumber, and feta cheese.</p>
                          <div className="card-actions justify-end mt-4">
                              <button className="btn btn-primary btn-sm btn-wide">View Recipe</button>
                          </div>
                      </div>
                   </div>

                </div>
            </div>

          </div>
       </main>
    </div>
  )
}
