from ultralytics import YOLO  # Ensure you have this package installed

def detect_objects(image_path):
    model = YOLO('yolov8n.pt')  # Load your YOLO model
    results = model(image_path, conf=0.6)  # Perform detection

    detected_objects = []

    for result in results:
        boxes = result.boxes
        for box in boxes:
            detected_objects.append({
                        'label': model.names[int(box.cls)],
                    })    
    return detected_objects
      
