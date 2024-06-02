import os
from ultralytics import YOLO

# Construct the absolute paths to the image files
image_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), '../Images/different_objects.jpg'))
]

# # Verify the paths are correct
# for path in image_paths:
#     if not os.path.isfile(path):
#         print(f"File not found: {path}")
#     else:
#         print(f"File exists: {path}")
        
# model = YOLO("yolov8n.pt")
# for result in results:
#     for box in result.boxes:
#         print(f"Detected: {model.names[int(box.cls)]}")

model = YOLO('yolov8n.pt')  # You can choose different versions, like yolov8s.pt, yolov8m.pt, etc.
img_path = 'path_to_your_image.jpg'
results = model([image_paths[0]],conf=0.8)
for result in results:
    boxes = result.boxes 
    for box in boxes:
        print(f"Detected: {model.names[int(box.cls)]}")