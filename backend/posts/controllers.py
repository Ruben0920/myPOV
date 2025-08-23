import base64
import json
import requests
from ultralytics import YOLO  # Ensure you have this package installed
from openai import OpenAI
from socialapp.utils import OPEN_AI_HEADERS, OPEN_AI_PAYLOAD_IMAGE_GPT_4_OMNI, OPEN_AI_URL

def detect_objects_assume_interests(image_path):
    # model = YOLO('yolov8n.pt')  # Load your YOLO model
    # results = model(image_path, conf=0.3)  # Perform detection
    # detected_objects = []
    
    # for result in results:
    #     boxes = result.boxes
    #     for box in boxes:
    #         detected_objects.append({
    #                     'label': model.names[int(box.cls)],
    #                 })    
            
    base64_image = encode_image(image_path)
    # payload = OPEN_AI_PAYLOAD_IMAGE_GPT_4_OMNI
    # for content_item in OPEN_AI_PAYLOAD_IMAGE_GPT_4_OMNI['messages'][0]['content']:
    #     if content_item['type'] == 'text':
    #         content_item['text'] = '''
    #             Return two arrays. First, a JSON array named 'objects', which has three keys in each JSON object,
    #             first with the label (string) of the detected objects, second with the count of each detected object (integer),
    #             and lastly brand (string) if there are any notable brands. Second, an array of strings with
    #             assumed interests this person may have based on these tags they put on these results.
    #         '''
    #     if content_item['type'] == 'image_url':
    #         content_item['image_url']['url'] = 'f"data:image/jpeg;base64,{base64_image}"'
 
    payload = {
    "model": "gpt-4o",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": f'''
                        Return two arrays. First, a JSON array named 'objects', which has three keys in each JSON object,
                        first with the label (string) of the detected objects, second with the count of each detected object (integer),
                        and lastly brand (string) if there are any notable brands. Also, a second array called 'assumed_interested' 
                        based on interests you think this person might have.
                    '''
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    response = requests.post(OPEN_AI_URL, headers=OPEN_AI_HEADERS, json=payload)
    return json.loads(response.json()['choices'][0]['message']['content'].strip('```json').strip('```').strip())
    
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')
