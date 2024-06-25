from collections import defaultdict
import os
import tempfile
import json
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .controllers import detect_objects  # Ensure this path is correct

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file part'}, status=400)
        
        file_obj = request.FILES['file']
        
        if file_obj.name == '':
            return JsonResponse({'error': 'No selected file'}, status=400)
        
        temp_file_path = self.save_temp_file(file_obj)
        detected_objects = detect_objects(temp_file_path)
        # Step 1: Initialize a dictionary to count the labels
        label_count = defaultdict(int)

        # Step 2: Iterate through the list of dictionaries
        for item in detected_objects:
            label = item["label"]
            label_count[label] += 1

        # Step 3: Transform the count dictionary into the desired format
        detected_objects = [{"label": label, "count": count} for label, count in label_count.items()]
            
        os.remove(temp_file_path)  # Clean up the temporary file
        
        return JsonResponse(detected_objects, safe=False)

    def save_temp_file(self, file_obj):
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            for chunk in file_obj.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name
        return temp_file_path
