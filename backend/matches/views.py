from collections import defaultdict
import os
import tempfile

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import permissions
from django.db.models import Q

from .controllers import detect_objects 
from .models import Match 
from .serializers import MatchSerializer 


class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser) #
    
    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file part'}, status=400) #
        
        file_obj = request.FILES['file'] #
        
        if file_obj.name == '':
            return JsonResponse({'error': 'No selected file'}, status=400) #
        
        temp_file_path = self.save_temp_file(file_obj) #
        detected_objects_list_of_dicts = detect_objects(temp_file_path) #
        
        # Step 1: Initialize a dictionary to count the labels
        label_count = defaultdict(int) #

        # Step 2: Iterate through the list of dictionaries
        # Assuming detect_objects returns a list of dicts like [{'label': 'cat'}, {'label': 'dog'}]
        for item in detected_objects_list_of_dicts: #
            label = item.get("label") # Use .get() for safer access
            if label:
                label_count[label] += 1 #

        # Step 3: Transform the count dictionary into the desired format
        # This structure might be what your frontend expects for this specific view.
        # Note: The AI matching logic uses a simple list of labels or the original list of dicts.
        counted_detected_objects = [{"label": label, "count": count} for label, count in label_count.items()] #
            
        os.remove(temp_file_path)  # Clean up the temporary file
        
        return JsonResponse(counted_detected_objects, safe=False) #

    def save_temp_file(self, file_obj):
        original_suffix = os.path.splitext(file_obj.name)[1] or '.jpg'
        with tempfile.NamedTemporaryFile(delete=False, suffix=original_suffix) as temp_file: #
            for chunk in file_obj.chunks(): #
                temp_file.write(chunk) #
            temp_file_path = temp_file.name #
        return temp_file_path #


class GetAIMatchesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        ai_matches = Match.objects.filter(
            (Q(user1=user) | Q(user2=user)) &
            Q(match_type='AI') &
            Q(status__in=['pending_ai', 'matched']) # Adjust statuses as per your flow
        ).select_related('user1', 'user2').order_by('-score', '-updated_at')
        
        serializer = MatchSerializer(ai_matches, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class InteractAIMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, match_id, *args, **kwargs):
        user = request.user
        action = request.data.get('action') # e.g., "accept", "decline"

        match_instance = None
        try:
            match_instance = Match.objects.get(
                pk=match_id,
                match_type='AI',
                status='pending_ai',
                # the line below assumes a specific user (user2) is designated to accept.
                # this might need to be more flexible, e.g., (Q(user1=user) | Q(user2=user))
                # and then perhaps additional logic inside if actions are user-role specific.
                # for now, to ensure the user is part of the match:
                # user2=user 
            )
            if match_instance.user1 != user and match_instance.user2 != user:
                 return Response({"error": "You are not part of this match to interact."}, status=status.HTTP_403_FORBIDDEN)


        except Match.DoesNotExist:
            return Response({"error": "AI Match not found or not in a state to be acted upon."}, status=status.HTTP_404_NOT_FOUND)
        
        if action == 'accept':
            match_instance.status = 'matched'
            match_instance.save()
            return Response(MatchSerializer(match_instance, context={'request': request}).data, status=status.HTTP_200_OK)
        elif action == 'decline':
            match_instance.status = 'declined'
            match_instance.save()
            return Response({"message": "AI Match declined."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid action provided."}, status=status.HTTP_400_BAD_REQUEST)