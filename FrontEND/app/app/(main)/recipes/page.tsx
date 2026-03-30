"use client";

import { useEffect, useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  name: string;
  ingredients_used: string[];
  missing_ingredients: string[];
  steps: string[];
  estimated_time: string;
  difficulty: "easy" | "medium" | "hard";
}

const INVENTORY_BASE_URL =
  process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL ?? "http://localhost:5001";
const RECIPE_BASE_URL =
  process.env.NEXT_PUBLIC_RECIPE_SERVICE_URL ?? "http://localhost:5002";

function getToken(): string | null {
  return localStorage.getItem("access_token");
}

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

const difficultyBadge: Record<string, string> = {
  easy: "badge-success",
  medium: "badge-warning",
  hard: "badge-error",
};

export default function RecipePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoadingInventory(true);
      setInventoryError(null);
      try {
        const token = getToken();
        if (!token) {
          setInventoryError("Please log in to view your inventory.");
          return;
        }
        const response = await fetch(`${INVENTORY_BASE_URL}/inventory/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          setInventoryError("Session expired. Please log in again.");
          return;
        }
        if (!response.ok) {
          setInventoryError("Failed to load inventory.");
          return;
        }
        const data: InventoryItem[] = await response.json();
        setInventory(data);
        setSelected(new Set(data.map((item) => item.name)));
      } catch {
        setInventoryError("Unable to reach the inventory service.");
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInventory();
  }, []);

  const toggleItem = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === inventory.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(inventory.map((i) => i.name)));
    }
  };

  const handleSuggest = async () => {
    if (selected.size === 0) {
      setSuggestError("Select at least one ingredient.");
      return;
    }
    const token = getToken();
    if (!token) {
      setSuggestError("Please log in first.");
      return;
    }
    const userId = getUserIdFromToken(token);
    if (!userId) {
      setSuggestError("Could not read user session. Please log in again.");
      return;
    }

    setSuggestError(null);
    setHasResults(false);
    setSuggesting(true);

    try {
      const response = await fetch(`${RECIPE_BASE_URL}/recipes/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          ingredients: Array.from(selected),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : "Recipe suggestion failed.";
        throw new Error(detail);
      }

      setRecipes(data.recipes ?? []);
      setHasResults(true);
    } catch (err) {
      setSuggestError(err instanceof Error ? err.message : "Unable to reach the recipe service.");
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="bg-base-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">
              Recipe <span className="text-primary">Suggestions</span>
            </h1>
            <p className="text-xl text-base-content/70">
              Select ingredients from your inventory and get personalised recipe ideas.
            </p>
          </div>

          {/* Ingredient selector */}
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">Your Ingredients</h2>
                {!loadingInventory && inventory.length > 0 && (
                  <button className="btn btn-sm btn-ghost" onClick={toggleAll}>
                    {selected.size === inventory.length ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>

              {loadingInventory ? (
                <div className="flex justify-center p-6">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : inventoryError ? (
                <div className="alert alert-error">
                  <span className="icon-[tabler--alert-circle] size-5"></span>
                  <span>{inventoryError}</span>
                </div>
              ) : inventory.length === 0 ? (
                <div className="text-center py-8 text-base-content/60">
                  <p>No ingredients in inventory. Add some from the Inventory page first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inventory.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selected.has(item.name)
                          ? "border-primary bg-primary/10"
                          : "border-base-content/20 hover:bg-base-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={selected.has(item.name)}
                        onChange={() => toggleItem(item.name)}
                      />
                      <div>
                        <span className="font-medium block">{item.name}</span>
                        <span className="text-xs text-base-content/60">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suggest button */}
          <div className="flex justify-center mb-8">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSuggest}
              disabled={suggesting || loadingInventory || inventory.length === 0}
            >
              {suggesting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Getting suggestions...
                </>
              ) : (
                <>
                  <span className="icon-[tabler--bulb] size-5"></span>
                  Suggest Recipes ({selected.size} ingredients)
                </>
              )}
            </button>
          </div>

          {suggestError && (
            <div className="alert alert-error mb-8">
              <span className="icon-[tabler--alert-circle] size-6"></span>
              <span>{suggestError}</span>
            </div>
          )}

          {/* Recipe results */}
          {hasResults && (
            <>
              {recipes.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-xl">
                  <p className="text-base-content/60">No recipes found for the selected ingredients.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">
                    <span className="text-primary">{recipes.length}</span> Recipes Found
                  </h2>
                  {recipes.map((recipe, index) => (
                    <div key={index} className="card bg-base-100 shadow-xl border border-base-content/10">
                      <div className="card-body">

                        {/* Recipe header */}
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <h3 className="card-title text-xl">{recipe.name}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`badge badge-outline ${difficultyBadge[recipe.difficulty] ?? "badge-ghost"}`}>
                              {recipe.difficulty}
                            </span>
                            <span className="badge badge-outline">
                              <span className="icon-[tabler--clock] size-4 mr-1"></span>
                              {recipe.estimated_time}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                          {/* Ingredients used */}
                          <div>
                            <p className="font-semibold text-sm text-base-content/70 uppercase tracking-wide mb-2">
                              Ingredients Used
                            </p>
                            <ul className="space-y-1">
                              {recipe.ingredients_used.map((ing, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                  <span className="icon-[tabler--check] size-4 text-success"></span>
                                  {ing}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Missing ingredients */}
                          {recipe.missing_ingredients.length > 0 && (
                            <div>
                              <p className="font-semibold text-sm text-base-content/70 uppercase tracking-wide mb-2">
                                You&apos;ll Also Need
                              </p>
                              <ul className="space-y-1">
                                {recipe.missing_ingredients.map((ing, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-base-content/70">
                                    <span className="icon-[tabler--shopping-cart] size-4 text-warning"></span>
                                    {ing}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Steps */}
                        <div className="mt-4">
                          <p className="font-semibold text-sm text-base-content/70 uppercase tracking-wide mb-3">
                            Steps
                          </p>
                          <ol className="space-y-2">
                            {recipe.steps.map((step, i) => (
                              <li key={i} className="flex gap-3 text-sm">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xs">
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
