from ultralytics import YOLO
import os
import google.generativeai as genai
from django.conf import settings

def detect_objects(image_path):
    model = YOLO('yolov8n.pt')
    results = model(image_path, conf=0.1)

    detected_objects_list_of_dicts = []

    for result in results:
        boxes = result.boxes
        for box in boxes:
            detected_objects_list_of_dicts.append({
                        'label': model.names[int(box.cls)],
                    })    
    return detected_objects_list_of_dicts


def infer_interests_from_objects(detected_objects_labels: list[str]):
    """
    Infers user interests from a list of detected object labels using Google's Gemini 1.5 Flash.
    """
    if not detected_objects_labels:
        return []

    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == 'YOUR_GEMINI_API_KEY_HERE':
        print("Error: GEMINI_API_KEY not configured in Django settings or environment.")
        return ["Error: API key not configured"] # Or raise an exception

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        object_list_str = ", ".join(detected_objects_labels)
        
        prompt = (
            f"You are an expert at understanding user interests from objects they post. "
            f"Given the following detected objects from a user's posts: [{object_list_str}], "
            f"concisely list 5 unique and relevant high-level interests. Consider how the existence of these at the same time can also affect assumed interests."
            f"(e.g. if i see only a knife its could be a myriad of things, but i see knife with tomatoes, it could be cooking)."
            f"Focus on broader interest categories rather than direct object names. "
            f"Example input: [gaming PC, headset, controller, action figure]. Example output: PC Gaming, eSports, Collectibles, Technology. "
            f"Avoid repeating interests and ensure diversity in the suggestions. Output only the comma-separated list of interests."
        )
        generation_config = genai.types.GenerationConfig(
            candidate_count=1,
            # stop_sequences=["\n\n"], # if you want to stop at certain sequences
            max_output_tokens=100, # adjust as needed for 3-5 interests
            temperature=0.7, # adjust for creativity vs. determinism
            # top_p=0.9,
            # top_k=40
        )
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]

        response = model.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
            )
        
        
        if response.candidates and response.candidates[0].content.parts:
            inferred_interests_text = response.candidates[0].content.parts[0].text.strip()
            interests = [interest.strip() for interest in inferred_interests_text.split(',') if interest.strip()]
            
            cleaned_interests = []
            for interest in interests:
                if len(interest) > 2 and interest[0].isdigit() and interest[1] == '.':
                    cleaned_interests.append(interest[2:].strip())
                elif len(interest) > 1 and interest[0] in ['-', '*']:
                    cleaned_interests.append(interest[1:].strip())
                else:
                    cleaned_interests.append(interest)
            return cleaned_interests
        elif hasattr(response, 'text'):
             inferred_interests_text = response.text.strip()
             interests = [interest.strip() for interest in inferred_interests_text.split(',') if interest.strip()]
             return interests
        else:
            print(f"Warning: Could not extract text from Gemini response. Response: {response}")
            if response.prompt_feedback and response.prompt_feedback.block_reason:
                print(f"Prompt blocked. Reason: {response.prompt_feedback.block_reason_message or response.prompt_feedback.block_reason}")
                return [f"Error: Content generation blocked ({response.prompt_feedback.block_reason})"]
            return []

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return [f"Error inferring interests: {str(e)}"]