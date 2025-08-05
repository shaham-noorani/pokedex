"""
Script to delete all Pokemon and Move objects from the database.
This provides a clean slate for reloading data.
"""

import os
import django
import sys

# Add the parent directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pokedex.settings")
django.setup()

# Import models after Django setup
from pokemon.models import Pokemon, Move

def clear_data():
    """Delete all Pokemon and Move objects from the database."""
    # Count objects before deletion
    pokemon_count = Pokemon.objects.count()
    move_count = Move.objects.count()
    
    print(f"Found {pokemon_count} Pokemon and {move_count} Moves in the database.")
    
    # Delete all Pokemon objects
    # This will also remove the many-to-many relationships
    Pokemon.objects.all().delete()
    
    # Delete all Move objects
    Move.objects.all().delete()
    
    # Verify deletion
    remaining_pokemon = Pokemon.objects.count()
    remaining_moves = Move.objects.count()
    
    print(f"Deleted {pokemon_count} Pokemon and {move_count} Moves.")
    print(f"Remaining: {remaining_pokemon} Pokemon and {remaining_moves} Moves.")
    
    if remaining_pokemon == 0 and remaining_moves == 0:
        print("Database successfully cleared!")
    else:
        print("WARNING: Some objects were not deleted!")

if __name__ == "__main__":
    # Check for command line arguments
    if len(sys.argv) > 1 and sys.argv[1] == '-y':
        # Skip confirmation if -y flag is provided
        clear_data()
    else:
        # Ask for confirmation before proceeding
        confirm = input("This will delete ALL Pokemon and Moves from the database. Are you sure? (y/n): ")
        
        if confirm.lower() == 'y':
            clear_data()
        else:
            print("Operation cancelled.")