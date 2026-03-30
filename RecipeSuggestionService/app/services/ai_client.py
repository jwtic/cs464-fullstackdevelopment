import os
import json
import httpx

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
{{
  "recipes": [
    {{
      "name": "string",
      "ingredients_used": ["string"],
      "missing_ingredients": ["string"],
      "steps": ["string"],
      "estimated_time": "string",
      "difficulty": "easy|medium|hard"
    }}
  ]
}}
"""

async def generate_recipe_suggestions(ingredients: list[str]):
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not configured on the server.")

    ingredient_text = "\n".join(f"- {item}" for item in ingredients)

    prompt = f"""
User ingredients:
{ingredient_text}

{PROMPT_TEMPLATE}
"""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-4.1-mini",
        "messages": [
            {"role": "system", "content": "You are a helpful cooking assistant."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    content = data["choices"][0]["message"]["content"]
    return json.loads(content)