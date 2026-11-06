import google.generativeai as genai
from app.core.config import settings
import json
import os

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

def extract_prescription_data(image_path: str) -> dict:
    sample_file = genai.upload_file(path=image_path)
    
    prompt = """
    You are a highly accurate medical prescription extraction assistant. 
    Read the attached handwritten prescription and extract the medicines.
    
    CRITICAL MEDICAL SAFETY RULES:
    1. NEVER guess an illegible medicine name, dose, frequency, or duration.
    2. If a word is uncertain or illegible, set the value to "UNREADABLE" and set has_uncertainty to true.
    3. Do not diagnose, recommend, or substitute any medications.

    JSON FORMAT:
    {
      "medicines": [
        {
          "name": "string",
          "dosage": "string",
          "frequency": "string",
          "food_instruction": "string",
          "has_uncertainty": boolean
        }
      ]
    }
    Return ONLY the raw JSON object, without markdown formatting.
    """
    
    response = model.generate_content([sample_file, prompt])
    raw_text = response.text.strip().removeprefix('```json').removesuffix('```')
    
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        raise ValueError("Failed to parse AI response into JSON")