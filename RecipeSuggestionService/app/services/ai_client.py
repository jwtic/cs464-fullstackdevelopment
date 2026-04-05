import os
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
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
    ingredient_text = "\n".join(f"- {item}" for item in ingredients)

    prompt = f"""
User ingredients:
{ingredient_text}

{PROMPT_TEMPLATE}
"""

    if GEMINI_API_KEY:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name=os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite"),
            system_instruction="You are a helpful cooking assistant.",
        )
        response = model.generate_content(prompt)
        content = response.text

    elif OPENROUTER_API_KEY:
        api_key = OPENROUTER_API_KEY
        api_url = "https://openrouter.ai/api/v1/chat/completions"
        model = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
    elif OPENAI_API_KEY:
        api_key = OPENAI_API_KEY
        api_url = "https://api.openai.com/v1/chat/completions"
        model = "gpt-4o-mini"
    else:
        raise ValueError("No AI API key is configured on the server. Set GEMINI_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY.")

    if not GEMINI_API_KEY:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": os.getenv("OPENROUTER_HTTP_REFERER", "http://localhost:3000"),
            "X-Title": os.getenv("OPENROUTER_APP_NAME", "Smart Pantry"),
        }

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

        content = data["choices"][0]["message"]["content"]

    # Strip markdown code fences if present
    content = content.strip()
    if content.startswith("```"):
        content = content.split("\n", 1)[-1]
        content = content.rsplit("```", 1)[0].strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        print("Raw model output:", content)
        raise RuntimeError("Model returned invalid JSON.") from e

