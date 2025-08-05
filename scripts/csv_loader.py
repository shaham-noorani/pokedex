"""
Script to load Pokemon and Moves data from CSV files.
This module provides functions to read Pokemon data from pokemon.csv and moves data from moves.csv.
"""

import csv
import os

def load_pokemon_from_csv():
    """
    Load Pokemon data from pokemon.csv.
    
    Returns:
        list: A list of dictionaries containing Pokemon data.
    """
    pokemon_data = []
    
    # Get the path to the CSV file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'pokemon.csv')
    
    # Read the CSV file
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Skip Mega Evolution forms
            if "Mega" in row['Name']:
                continue
                
            # Map CSV columns to Pokemon model fields
            pokemon = {
                "name": row['Name'],
                "type_1": row['Type 1'],
                "type_2": row['Type 2'] if row['Type 2'] else None,
                "hp": int(row['HP']),
                "attack": int(row['Attack']),
                "defense": int(row['Defense']),
                "sp_atk": int(row['Sp. Atk']),
                "sp_def": int(row['Sp. Def']),
                "speed": int(row['Speed']),
                # Set default values for missing fields
                "sprite": f"https://img.pokemondb.net/sprites/sword-shield/icon/{row['Name'].lower()}.png",
                "height": 0.0,  # Default height
                "weight": 0.0,  # Default weight
            }
            
            pokemon_data.append(pokemon)
    
    print(f"Loaded {len(pokemon_data)} Pokemon from CSV file.")
    return pokemon_data

def load_moves_from_csv():
    """
    Load Moves data from moves.csv.
    
    Returns:
        list: A list of dictionaries containing Move data.
    """
    moves_data = []
    
    # Get the path to the CSV file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'moves.csv')
    
    # Read the CSV file
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Map CSV columns to Move model fields
            move = {
                "name": row['name'],
                "type": row['type'].lower(),
                "power": float(row['power']) if row['power'] else None,
                "category": row['damage_class'].lower(),
                "accuracy": float(row['accuracy']) if row['accuracy'] else None,
                "effect": row['short_descripton'] if 'short_descripton' in row else "",
                "description": f"{row['name']} - {row['short_descripton'] if 'short_descripton' in row else 'A powerful move.'}"
            }
            
            moves_data.append(move)
    
    print(f"Loaded {len(moves_data)} Moves from CSV file.")
    return moves_data

if __name__ == "__main__":
    # Test the functions
    pokemon_data = load_pokemon_from_csv()
    for pokemon in pokemon_data[:5]:  # Print the first 5 Pokemon
        print(pokemon)
        
    moves_data = load_moves_from_csv()
    for move in moves_data[:5]:  # Print the first 5 Moves
        print(move)