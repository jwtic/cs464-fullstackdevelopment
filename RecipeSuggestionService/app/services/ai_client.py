import os
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

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

def get_api_key():
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        raise RuntimeError("Missing OPENROUTER_API_KEY in .env")
    return key

async def call_openrouter_api(prompt: str) -> str:
    api_key = get_api_key()

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        # Optional but recommended by OpenRouter:
        "HTTP-Referer": "http://localhost",
        "X-Title": "RecipeSuggestionService",
    }

    payload = {
        "model": "openrouter/free",
        "messages": [
            {"role": "system", "content": "You are a helpful cooking assistant."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
        )

        if response.status_code >= 400:
            print("Status:", response.status_code)
            print("Body:", response.text)

        if response.status_code == 401:
            raise RuntimeError("Invalid OpenRouter API key.")

        if response.status_code == 429:
            raise RuntimeError("OpenRouter free-tier rate limit reached. Try again later.")

        response.raise_for_status()
        data = response.json()

    return data["choices"][0]["message"]["content"]

async def generate_recipe_suggestions(ingredients: list[str]):
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not configured on the server.")

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