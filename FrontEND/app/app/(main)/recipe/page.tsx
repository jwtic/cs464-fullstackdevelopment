"use client";

import { useEffect, useMemo, useState } from "react";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  required: string[]; // normalized ingredient tokens
  optional?: string[];
  steps: string[];
};

function normToken(s: string) {
  return s.trim().toLowerCase();
}

function inventoryTokens(items: InventoryItem[]) {
  const tokens = new Set<string>();
  for (const item of items) {
    const raw = item?.name ?? "";
    const cleaned = raw
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    for (const t of cleaned) tokens.add(t);
    if (raw.trim()) tokens.add(raw.trim().toLowerCase());
  }
  return tokens;
}

function scoreRecipe(recipe: Recipe, tokens: Set<string>) {
  const required = recipe.required.map(normToken).filter(Boolean);
  const missing: string[] = [];
  let have = 0;
  for (const r of required) {
    if (tokens.has(r)) have += 1;
    else missing.push(r);
  }
  const score = required.length ? have / required.length : 0;
  return { score, missing, have, requiredCount: required.length };
}

const RECIPE_LIBRARY: Recipe[] = [
  {
    id: "caprese-salad",
    title: "Caprese Salad",
    description: "Fresh, fast, and great for using up tomatoes.",
    required: ["tomato", "basil", "mozzarella"],
    optional: ["olive", "oil", "pepper", "salt"],
    steps: ["Slice tomatoes and mozzarella.", "Layer with basil.", "Drizzle olive oil and season."],
  },
  {
    id: "omelet",
    title: "Simple Omelet",
    description: "Quick breakfast using eggs and whatever you have.",
    required: ["egg"],
    optional: ["milk", "cheese", "onion", "pepper", "tomato"],
    steps: ["Whisk eggs (optionally with a splash of milk).", "Cook in a pan.", "Add fillings and fold."],
  },
  {
    id: "banana-smoothie",
    title: "Banana Smoothie",
    description: "A basic smoothie with minimal ingredients.",
    required: ["banana", "milk"],
    optional: ["yogurt", "honey", "ice"],
    steps: ["Add ingredients to blender.", "Blend until smooth.", "Serve cold."],
  },
  {
    id: "tomato-pasta",
    title: "Tomato Pasta",
    description: "A pantry-friendly pasta with a simple tomato sauce.",
    required: ["pasta", "tomato"],
    optional: ["onion", "garlic", "olive", "oil", "basil", "cheese"],
    steps: ["Boil pasta.", "Cook tomatoes into a quick sauce.", "Toss together and season."],
  },
];

export default function RecipePage() {
  const userId = "user123";
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://127.0.0.1:5001/inventory/?user_id=${encodeURIComponent(userId)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          const detail = await res.text();
          throw new Error(detail || "Failed to fetch inventory");
        }
        const data = (await res.json()) as InventoryItem[];
        setInventory(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const ranked = useMemo(() => {
    const tokens = inventoryTokens(inventory);
    return RECIPE_LIBRARY
      .map((r) => ({ recipe: r, ...scoreRecipe(r, tokens) }))
      .sort((a, b) => b.score - a.score);
  }, [inventory]);

  return (
    <div className="bg-base-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold">Recipes</h1>
              <p className="text-base-content/70 mt-2">
                Suggestions based on what’s currently in your inventory.
              </p>
            </div>
            <div className="badge badge-outline badge-lg opacity-70">
              {inventory.length} inventory items
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <span className="icon-[tabler--alert-triangle] size-6"></span>
              <span>{error}</span>
            </div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-16 bg-base-200 rounded-xl">
              <h3 className="text-2xl font-semibold mb-2">No inventory yet</h3>
              <p className="text-base-content/70 mb-6">
                Add items to your inventory to unlock recipe suggestions.
              </p>
              <a href="/upload" className="btn btn-primary">
                Upload a picture
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {ranked.map(({ recipe, score, missing, have, requiredCount }) => (
                <div
                  key={recipe.id}
                  className="card bg-base-100 shadow-md border border-base-content/10"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="card-title text-2xl">{recipe.title}</h2>
                        <p className="text-base-content/70 mt-1">{recipe.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="badge badge-primary badge-lg">
                          {Math.round(score * 100)}% match
                        </div>
                        <div className="text-xs opacity-70">
                          {have}/{requiredCount} required
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {recipe.required.map((r) => (
                        <span key={r} className="badge badge-outline">
                          {r}
                        </span>
                      ))}
                    </div>

                    {missing.length > 0 ? (
                      <div className="mt-4">
                        <div className="text-sm font-semibold mb-2">Missing</div>
                        <div className="flex flex-wrap gap-2">
                          {missing.map((m) => (
                            <span key={m} className="badge badge-ghost">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-success mt-4">
                        <span className="icon-[tabler--check] size-6"></span>
                        <span>You have everything required for this recipe.</span>
                      </div>
                    )}

                    <div className="mt-5">
                      <div className="text-sm font-semibold mb-2">Steps</div>
                      <ol className="list-decimal pl-5 space-y-1 text-sm text-base-content/80">
                        {recipe.steps.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ol>
                    </div>
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

