"""
Script to load all Pokemon and moves data into the database.
This script will:
1. Load all moves from moves.csv
2. Load all Pokemon from pokemon.csv
3. Assign moves to Pokemon based on the pokemon_moves dictionary
"""

import os
import django
import sys

# Add the parent directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pokedex.settings")
django.setup()

from pokemon.models import Pokemon, Move
from pokemon_data import pokemon_moves
from csv_loader import load_pokemon_from_csv, load_moves_from_csv

def load_moves():
    """Load all moves from moves.csv"""
    moves_data = load_moves_from_csv()
    for data in moves_data:
        Move.objects.get_or_create(name=data["name"], defaults=data)
    print(f"Loaded {len(moves_data)} moves successfully!")

def load_pokemon():
    """Load all Pokemon from pokemon.csv"""
    # Get Pokemon data from CSV file
    pokemon_data = load_pokemon_from_csv()
    
    for data in pokemon_data:
        pokemon, created = Pokemon.objects.get_or_create(name=data["name"], defaults=data)
        
        # Update existing Pokemon with current data
        if not created:
            for key, value in data.items():
                setattr(pokemon, key, value)
            pokemon.save()
    
    print(f"Loaded {len(pokemon_data)} Pokemon successfully!")

def assign_moves():
    """Assign moves to Pokemon based on the pokemon_moves dictionary"""
    for pokemon_name, move_names in pokemon_moves.items():
        try:
            pokemon = Pokemon.objects.get(name=pokemon_name)
            
            # Clear existing moves to avoid duplicates
            pokemon.moves.clear()
            
            # Assign moves to the Pokemon
            for move_name in move_names:
                try:
                    move = Move.objects.get(name=move_name)
                    pokemon.moves.add(move)
                except Move.DoesNotExist:
                    print(f"Move {move_name} not found")
        except Pokemon.DoesNotExist:
            print(f"Pokemon {pokemon_name} not found")
    
    print("Assigned moves to Pokemon successfully!")

def load_all_data():
    """Load all data in the correct order"""
    print("Starting data loading process...")
    
    # First load moves (since Pokemon reference moves)
    load_moves()
    
    # Then load Pokemon
    load_pokemon()
    
    # Finally assign moves to Pokemon
    assign_moves()
    
    print("Data loading complete!")

if __name__ == "__main__":
    load_all_data()