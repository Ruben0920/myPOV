from collections import defaultdict
import os
import tempfile
import json
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from posts.models import Post
from users.models import CustomUser
from .controllers import detect_objects_assume_interests  # Ensure this path is correct
from socialapp.utils import API_KEY, OPEN_AI_PAYLOAD_IMAGE_GPT_4_OMNI, OPEN_AI_HEADERS
from rest_framework.permissions import IsAuthenticated

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    # permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        # Need to add validation that this request is coming from us, 
        # a session_id or some kind of user_id within the request. 
        # For later.
        
        # user = request.user
        
        # if user.id is None: 
        #     return JsonResponse({'error': 'Unknown user'}, status=400)
        
        #Basic Validation
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file part'}, status=400)
        
        if 'tags' in request.POST:
            if not isinstance(request.POST['tags'], list):
                return JsonResponse({'error': 'Tags field must be a list'}, status=400)
            tags=request.POST.get('tags')
            
        if 'caption' in request.POST:
            if not isinstance(request.POST['caption'], str):
                return JsonResponse({'error': 'Caption field must be a string'}, status=400)


        file_obj = request.FILES['file']
        
        if file_obj.name == '':
            return JsonResponse({'error': 'No selected file'}, status=400)
        
        temp_file_path = self.save_temp_file(file_obj)
        objects_and_interests = detect_objects_assume_interests(temp_file_path)
        os.remove(temp_file_path)
        detected_objects = objects_and_interests.get('objects', None)
        assumed_interests = objects_and_interests.get('assumed_interested', None)
        
        if detected_objects is None:
            return JsonResponse({'error': 'No objects detected'}, status=400)
        
        post = Post.objects.create(
            user=2,
            image=file_obj,
            detected_objects=detected_objects,
            assumed_interests=assumed_interests,
            tags=tags
        )
        
        
        return JsonResponse(detected_objects, safe=False)

    def save_temp_file(self, file_obj):
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            for chunk in file_obj.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name
        return temp_file_path
