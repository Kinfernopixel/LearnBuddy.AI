import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_learning_path(topic):
    model = genai.GenerativeModel('gemini-1.5-flash') 
    prompt = f"""
    Act as a master teacher. For the topic "{topic}", generate a beginner-friendly, step-by-step learning path with 5 modules. For each module, provide:
    - Module title
    - 1-2 sentence summary

    Format the output as numbered steps, like:
    1. [Module Title]: [Summary]
    2. ...
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error from Gemini: {e}"
