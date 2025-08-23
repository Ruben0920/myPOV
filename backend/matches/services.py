# myPOV/backend/matches/services.py
from django.db import models
from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser #
from posts.models import Post #
from .models import Match #

# --- Constants for Matching Logic ---
INTEREST_WEIGHT = 0.7 
OBJECT_WEIGHT = 0.3
MATCH_THRESHOLD = 0.5 
RECENT_POST_DAYS = 7 #


def _calculate_jaccard_similarity(set1_items, set2_items):
    """Calculates Jaccard similarity between two sets of items."""
    if not isinstance(set1_items, set):
        set1 = set(set1_items or [])
    else:
        set1 = set1_items
        
    if not isinstance(set2_items, set):
        set2 = set(set2_items or [])
    else:
        set2 = set2_items

    if not set1 and not set2:
        return 0.0  # 1.0 if empty 
    
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    
    return intersection / union if union > 0 else 0.0


def _calculate_user_pair_score(user1_posts, user2_posts):
    """
    Calculates an aggregated match score between two users based on their posts.
    """
    total_similarity_score = 0
    num_comparisons = 0

    if not user1_posts or not user2_posts:
        return 0.0

    for post1 in user1_posts:
        if not post1.inferred_interests and not post1.detected_objects:
            continue

        for post2 in user2_posts:
            if not post2.inferred_interests and not post2.detected_objects:
                continue

            interests1 = set(post1.inferred_interests or [])
            interests2 = set(post2.inferred_interests or [])
            interest_similarity = _calculate_jaccard_similarity(interests1, interests2)

            objects1 = set(obj.get('label') for obj in (post1.detected_objects or []) if obj.get('label'))
            objects2 = set(obj.get('label') for obj in (post2.detected_objects or []) if obj.get('label'))
            object_similarity = _calculate_jaccard_similarity(objects1, objects2)
            
            post_pair_score = (interest_similarity * INTEREST_WEIGHT) + \
                              (object_similarity * OBJECT_WEIGHT)
            
            total_similarity_score += post_pair_score
            num_comparisons += 1
            
    return total_similarity_score / num_comparisons if num_comparisons > 0 else 0.0


def generate_ai_matches_for_user(user):
    """
    Generates potential AI matches for a single given user.
    """
    now = timezone.now()
    active_users = CustomUser.objects.filter(is_active=True, expires_at__gte=now).exclude(pk=user.pk)
    
    user_posts = list(Post.objects.filter(
        user=user,
        created_at__gte=now - timedelta(days=RECENT_POST_DAYS),
        inferred_interests__isnull=False 
    ).exclude(inferred_interests__exact=[])) 

    if not user_posts:
        print(f"No recent, AI-processed posts found for user {user.username} to generate matches.")
        return []

    created_matches_info = []

    for other_user in active_users:
        existing_match_qs = Match.objects.filter(
            models.Q(user1=user, user2=other_user) | models.Q(user1=other_user, user2=user)
        ).filter(status__in=['pending', 'matched'])

        if existing_match_qs.exists():
            continue

        other_user_posts = list(Post.objects.filter(
            user=other_user,
            created_at__gte=now - timedelta(days=RECENT_POST_DAYS),
            inferred_interests__isnull=False
        ).exclude(inferred_interests__exact=[]))

        if not other_user_posts:
            continue

        match_score = _calculate_user_pair_score(user_posts, other_user_posts)

        if match_score >= MATCH_THRESHOLD:

            match_obj, created = Match.objects.update_or_create(
                user1=user if user.pk < other_user.pk else other_user,
                user2=other_user if user.pk < other_user.pk else user,
                defaults={
                    'score': match_score,
                    'status': 'pending_ai', 
                    'match_type': 'AI' 
                }
            )
            status_str = "created" if created else "updated"
            created_matches_info.append({
                "user1": match_obj.user1.username,
                "user2": match_obj.user2.username,
                "score": match_score,
                "status": status_str
            })
            print(f"AI Match {status_str} between {user.username} and {other_user.username} with score {match_score:.2f}")
            
    return created_matches_info


def generate_all_ai_matches():
    """
    Orchestrates AI match generation for all active users.
    """
    now = timezone.now()
    users_with_recent_posts = CustomUser.objects.filter(
        is_active=True,
        expires_at__gte=now,
        posts__created_at__gte=now - timedelta(days=RECENT_POST_DAYS),
        posts__inferred_interests__isnull=False 
    ).distinct()
    
    all_matches_info = []
    processed_pairs = set()

    for user1 in users_with_recent_posts:
        user1_posts = list(Post.objects.filter(
            user=user1,
            created_at__gte=now - timedelta(days=RECENT_POST_DAYS),
            inferred_interests__isnull=False
        ).exclude(inferred_interests__exact=[]))

        if not user1_posts:
            continue

        potential_partners = users_with_recent_posts.exclude(pk=user1.pk)

        for user2 in potential_partners:
            pair = tuple(sorted((user1.pk, user2.pk)))
            if pair in processed_pairs:
                continue
            processed_pairs.add(pair)

            existing_match_qs = Match.objects.filter(
                (models.Q(user1=user1, user2=user2) | models.Q(user1=user2, user2=user1)) &
                models.Q(status__in=['pending_ai', 'pending', 'matched'])
            )
            if existing_match_qs.exists():
                continue
                
            user2_posts = list(Post.objects.filter(
                user=user2,
                created_at__gte=now - timedelta(days=RECENT_POST_DAYS),
                inferred_interests__isnull=False
            ).exclude(inferred_interests__exact=[]))

            if not user2_posts:
                continue
            
            current_match_score = _calculate_user_pair_score(user1_posts, user2_posts)

            if current_match_score >= MATCH_THRESHOLD:
                match_obj, created = Match.objects.update_or_create(
                    user1=user1 if user1.pk < user2.pk else user2,
                    user2=user2 if user1.pk < user2.pk else user1,
                    defaults={
                        'score': current_match_score,
                        'status': 'pending_ai', 
                        'match_type': 'AI'
                    }
                )
                status_str = "created" if created else "updated"
                info = {
                    "user1": match_obj.user1.username,
                    "user2": match_obj.user2.username,
                    "score": current_match_score,
                    "status": status_str
                }
                all_matches_info.append(info)
                print(f"AI Match {status_str} between {user1.username} and {user2.username} with score {current_match_score:.2f}")
    
    return all_matches_info