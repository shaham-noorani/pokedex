"""
Script to load Pokemon data from CSV file.
This module provides functions to read Pokemon data from pokemon.csv.
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

if __name__ == "__main__":
    # Test the function
    pokemon_data = load_pokemon_from_csv()
    for pokemon in pokemon_data[:5]:  # Print the first 5 Pokemon
        print(pokemon)