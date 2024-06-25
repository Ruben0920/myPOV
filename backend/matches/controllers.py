from ultralytics import YOLO  # Ensure you have this package installed

def detect_objects(image_path):
    model = YOLO('yolov8n.pt')  # Load your YOLO model
    results = model(image_path, conf=0.6)  # Perform detection

    detected_objects = []

    for result in results[0]:
        for box in result.boxes:
            # Extract box attributes, ensuring correct indexing
            if len(box) >= 4:
                for result in results[0]:
                    detected_objects.append({
                        'label': result['name'],
                        'confidence': result['confidence'],
                        'box': result['box']
                    })    
    return detected_objects

      
