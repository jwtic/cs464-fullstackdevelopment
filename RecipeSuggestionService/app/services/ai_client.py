import os
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

PROMPT_TEMPLATE = """
You are a recipe recommendation assistant.

Given the user's available ingredients, suggest 3 recipes.

Some common household pantry ingredients can be assumed to be available even if they are not listed by the user.

Common pantry ingredients include:
- salt
- pepper
- cooking oil
- sugar
- soy sauce
- basic spices

Do NOT list these pantry ingredients as missing ingredients.

Rules:
- Prefer recipes that use the available ingredients
- Minimize missing ingredients
- Keep recipes simple and realistic for home cooking.
- Recipes should use the provided ingredients as the main components.
- Include short, clear cooking steps.
- Mention missing ingredients separately (excluding pantry ingredients).
- Return only valid JSON
- Do NOT include markdown or explanations.

Return ONLY valid JSON in this format:
{
  "recipes": [
    {
      "name": "string",
      "ingredients_used": ["string"],
      "missing_ingredients": ["string"],
      "steps": ["string"],
      "estimated_time": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}
"""

async def generate_recipe_suggestions(ingredients: list[str]):
    if OPENROUTER_API_KEY:
        api_key = OPENROUTER_API_KEY
        api_url = "https://openrouter.ai/api/v1/chat/completions"
        model = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
    elif OPENAI_API_KEY:
        api_key = OPENAI_API_KEY
        api_url = "https://api.openai.com/v1/chat/completions"
        model = "gpt-4o-mini"
    else:
        raise ValueError("Neither OPENROUTER_API_KEY nor OPENAI_API_KEY is configured on the server.")

    ingredient_text = "\n".join(f"- {item}" for item in ingredients)

    prompt = f"""
User ingredients:
{ingredient_text}

{PROMPT_TEMPLATE}
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        # Optional but recommended by OpenRouter:
        "HTTP-Referer": "http://localhost",
        "X-Title": "RecipeSuggestionService",
    }

    if api_url.startswith("https://openrouter.ai"):
        headers["HTTP-Referer"] = os.getenv("OPENROUTER_HTTP_REFERER", "http://localhost:3000")
        headers["X-Title"] = os.getenv("OPENROUTER_APP_NAME", "Smart Pantry")

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful cooking assistant."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    return data["choices"][0]["message"]["content"]

async def generate_recipe_suggestions(ingredients: list[str]):
    if not get_api_key():
        raise ValueError("OPENROUTER_API_KEY is not configured on the server.")

    ingredient_text = "\n".join(f"- {item}" for item in ingredients)

    prompt = f"""
User ingredients:
{ingredient_text}

{PROMPT_TEMPLATE}
"""

    content = await call_openrouter_api(prompt)

    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        print("Raw model output:")
        print(content)
        raise RuntimeError("Model returned invalid JSON.") from e