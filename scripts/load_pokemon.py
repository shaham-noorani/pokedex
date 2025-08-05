import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pokedex.settings")
django.setup()

from pokemon.models import Pokemon, Move

# Dictionary mapping Pokemon names to move names they can learn
pokemon_moves = {
    "Pikachu": ["Thunder Shock", "Quick Attack", "Thunder Wave", "Thunderbolt"],
    "Bulbasaur": ["Tackle", "Vine Whip", "Razor Leaf", "Leech Seed"],
    "Charmander": ["Scratch", "Ember", "Flamethrower", "Fire Blast"],
    "Squirtle": ["Tackle", "Water Gun", "Hydro Pump", "Surf"],
    "Jigglypuff": ["Tackle", "Growl", "Hyper Beam"],
    "Meowth": ["Tackle", "Quick Attack", "Growl"],
    "Psyduck": ["Water Gun", "Confusion", "Psychic"],
    "Gengar": ["Shadow Ball", "Night Shade", "Hypnosis"],
    "Eevee": ["Tackle", "Quick Attack", "Growl"],
    "Snorlax": ["Tackle", "Hyper Beam"],
    "Mewtwo": ["Confusion", "Psychic", "Shadow Ball"],
    "Gyarados": ["Hydro Pump", "Surf", "Hyper Beam"],
    "Dragonite": ["Hyper Beam", "Thunder", "Fire Blast"],
    "Charizard": ["Ember", "Flamethrower", "Fire Blast"],
    "Blastoise": ["Water Gun", "Hydro Pump", "Surf"],
    "Venusaur": ["Vine Whip", "Razor Leaf", "Solar Beam", "Leech Seed"],
    "Alakazam": ["Confusion", "Psychic", "Hypnosis"],
    "Machamp": ["Tackle", "Growl"],
    "Lapras": ["Water Gun", "Surf", "Ice Beam"],
    "Arcanine": ["Ember", "Flamethrower", "Fire Blast"]
}

pokemon_data = [
    {
        "name": "Pikachu",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/pikachu.png",
        "type_1": "Electric",
        "type_2": None,
        "hp": 35,
        "attack": 55,
        "defense": 40,
        "sp_atk": 50,
        "sp_def": 50,
        "speed": 90,
        "height": 0.4,  # 0.4 meters
        "weight": 6.0,  # 6.0 kilograms
    },
    {
        "name": "Bulbasaur",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/bulbasaur.png",
        "type_1": "Grass",
        "type_2": "Poison",
        "hp": 45,
        "attack": 49,
        "defense": 49,
        "sp_atk": 65,
        "sp_def": 65,
        "speed": 45,
        "height": 0.7,  # 0.7 meters
        "weight": 6.9,  # 6.9 kilograms
    },
    {
        "name": "Charmander",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/charmander.png",
        "type_1": "Fire",
        "type_2": None,
        "hp": 39,
        "attack": 52,
        "defense": 43,
        "sp_atk": 60,
        "sp_def": 50,
        "speed": 65,
        "height": 0.6,  # 0.6 meters
        "weight": 8.5,  # 8.5 kilograms
    },
    {
        "name": "Squirtle",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/squirtle.png",
        "type_1": "Water",
        "type_2": None,
        "hp": 44,
        "attack": 48,
        "defense": 65,
        "sp_atk": 50,
        "sp_def": 64,
        "speed": 43,
        "height": 0.5,  # 0.5 meters
        "weight": 9.0,  # 9.0 kilograms
    },
    {
        "name": "Jigglypuff",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/jigglypuff.png",
        "type_1": "Normal",
        "type_2": "Fairy",
        "hp": 115,
        "attack": 45,
        "defense": 20,
        "sp_atk": 45,
        "sp_def": 25,
        "speed": 20,
        "height": 0.5,  # 0.5 meters
        "weight": 5.5,  # 5.5 kilograms
    },
    {
        "name": "Meowth",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/meowth.png",
        "type_1": "Normal",
        "type_2": None,
        "hp": 40,
        "attack": 45,
        "defense": 35,
        "sp_atk": 40,
        "sp_def": 40,
        "speed": 90,
        "height": 0.4,  # 0.4 meters
        "weight": 4.2,  # 4.2 kilograms
    },
    {
        "name": "Psyduck",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/psyduck.png",
        "type_1": "Water",
        "type_2": None,
        "hp": 50,
        "attack": 52,
        "defense": 48,
        "sp_atk": 65,
        "sp_def": 50,
        "speed": 55,
        "height": 0.8,  # 0.8 meters
        "weight": 19.6,  # 19.6 kilograms
    },
    {
        "name": "Gengar",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/gengar.png",
        "type_1": "Ghost",
        "type_2": "Poison",
        "hp": 60,
        "attack": 65,
        "defense": 60,
        "sp_atk": 130,
        "sp_def": 75,
        "speed": 110,
        "height": 1.5,  # 1.5 meters
        "weight": 40.5,  # 40.5 kilograms
    },
    {
        "name": "Eevee",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/eevee.png",
        "type_1": "Normal",
        "type_2": None,
        "hp": 55,
        "attack": 55,
        "defense": 50,
        "sp_atk": 45,
        "sp_def": 65,
        "speed": 55,
        "height": 0.3,  # 0.3 meters
        "weight": 6.5,  # 6.5 kilograms
    },
    {
        "name": "Snorlax",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/snorlax.png",
        "type_1": "Normal",
        "type_2": None,
        "hp": 160,
        "attack": 110,
        "defense": 65,
        "sp_atk": 65,
        "sp_def": 110,
        "speed": 30,
        "height": 2.1,  # 2.1 meters
        "weight": 460.0,  # 460.0 kilograms
    },
    {
        "name": "Mewtwo",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/mewtwo.png",
        "type_1": "Psychic",
        "type_2": None,
        "hp": 106,
        "attack": 110,
        "defense": 90,
        "sp_atk": 154,
        "sp_def": 90,
        "speed": 130,
        "height": 2.0,  # 2.0 meters
        "weight": 122.0,  # 122.0 kilograms
    },
    {
        "name": "Gyarados",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/gyarados.png",
        "type_1": "Water",
        "type_2": "Flying",
        "hp": 95,
        "attack": 125,
        "defense": 79,
        "sp_atk": 60,
        "sp_def": 100,
        "speed": 81,
        "height": 6.5,  # 6.5 meters
        "weight": 235.0,  # 235.0 kilograms
    },
    {
        "name": "Dragonite",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/dragonite.png",
        "type_1": "Dragon",
        "type_2": "Flying",
        "hp": 91,
        "attack": 134,
        "defense": 95,
        "sp_atk": 100,
        "sp_def": 100,
        "speed": 80,
        "height": 2.2,  # 2.2 meters
        "weight": 210.0,  # 210.0 kilograms
    },
    {
        "name": "Charizard",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/charizard.png",
        "type_1": "Fire",
        "type_2": "Flying",
        "hp": 78,
        "attack": 84,
        "defense": 78,
        "sp_atk": 109,
        "sp_def": 85,
        "speed": 100,
        "height": 1.7,  # 1.7 meters
        "weight": 90.5,  # 90.5 kilograms
    },
    {
        "name": "Blastoise",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/blastoise.png",
        "type_1": "Water",
        "type_2": None,
        "hp": 79,
        "attack": 83,
        "defense": 100,
        "sp_atk": 85,
        "sp_def": 105,
        "speed": 78,
        "height": 1.6,  # 1.6 meters
        "weight": 85.5,  # 85.5 kilograms
    },
    {
        "name": "Venusaur",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/venusaur.png",
        "type_1": "Grass",
        "type_2": "Poison",
        "hp": 80,
        "attack": 82,
        "defense": 83,
        "sp_atk": 100,
        "sp_def": 100,
        "speed": 80,
        "height": 2.0,  # 2.0 meters
        "weight": 100.0,  # 100.0 kilograms
    },
    {
        "name": "Alakazam",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/alakazam.png",
        "type_1": "Psychic",
        "type_2": None,
        "hp": 55,
        "attack": 50,
        "defense": 45,
        "sp_atk": 135,
        "sp_def": 95,
        "speed": 120,
        "height": 1.5,  # 1.5 meters
        "weight": 48.0,  # 48.0 kilograms
    },
    {
        "name": "Machamp",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/machamp.png",
        "type_1": "Fighting",
        "type_2": None,
        "hp": 90,
        "attack": 130,
        "defense": 80,
        "sp_atk": 65,
        "sp_def": 85,
        "speed": 55,
        "height": 1.6,  # 1.6 meters
        "weight": 130.0,  # 130.0 kilograms
    },
    {
        "name": "Lapras",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/lapras.png",
        "type_1": "Water",
        "type_2": "Ice",
        "hp": 130,
        "attack": 85,
        "defense": 80,
        "sp_atk": 85,
        "sp_def": 95,
        "speed": 60,
        "height": 2.5,  # 2.5 meters
        "weight": 220.0,  # 220.0 kilograms
    },
    {
        "name": "Arcanine",
        "sprite": "https://img.pokemondb.net/sprites/sword-shield/icon/arcanine.png",
        "type_1": "Fire",
        "type_2": None,
        "hp": 90,
        "attack": 110,
        "defense": 80,
        "sp_atk": 100,
        "sp_def": 80,
        "speed": 95,
        "height": 1.9,  # 1.9 meters
        "weight": 155.0,  # 155.0 kilograms
    },
]

def load_pokemon():
    for data in pokemon_data:
        pokemon, created = Pokemon.objects.get_or_create(name=data["name"], defaults=data)
        
        # Update existing Pokemon with height and weight
        if not created:
            pokemon.height = data["height"]
            pokemon.weight = data["weight"]
            pokemon.save()
        
        # Assign moves to the Pokemon
        if pokemon.name in pokemon_moves:
            for move_name in pokemon_moves[pokemon.name]:
                try:
                    move = Move.objects.get(name=move_name)
                    pokemon.moves.add(move)
                except Move.DoesNotExist:
                    print(f"Move {move_name} not found")
    
    print(f"Loaded {len(pokemon_data)} Pokemon with their moves successfully!")

if __name__ == "__main__":
    load_pokemon()
