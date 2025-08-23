# myPOV/backend/matches/management/commands/generate_matches.py
from django.core.management.base import BaseCommand
from matches.services import generate_all_ai_matches # Assuming services.py is in the same app

class Command(BaseCommand):
    help = 'Generates AI-based matches for users based on their posts.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting AI match generation process...'))
        
        try:
            matches_info = generate_all_ai_matches()
            if matches_info:
                self.stdout.write(self.style.SUCCESS(f'Successfully processed AI matches. {len(matches_info)} potential matches created/updated.'))
                # for info in matches_info:
                #     self.stdout.write(f"  - {info['user1']} and {info['user2']}: Score {info['score']:.2f} ({info['status']})")
            else:
                self.stdout.write(self.style.SUCCESS('No new AI matches generated in this run.'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error during AI match generation: {e}'))
            # Consider more detailed logging here
            
        self.stdout.write(self.style.NOTICE('AI match generation process finished.'))