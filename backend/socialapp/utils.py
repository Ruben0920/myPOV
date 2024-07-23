# utils.py
import os



OPEN_AI_URL = "https://api.openai.com/v1/chat/completions"
OPEN_AI_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
    }
OPEN_AI_PAYLOAD_IMAGE_GPT_4_OMNI = {
    "model": "gpt-4o",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text":""
            },
            {
            "type": "image_url",
            "image_url": {
                "url": ""
            }
            }
        ]
        }
    ],
    "max_tokens": 300
}
