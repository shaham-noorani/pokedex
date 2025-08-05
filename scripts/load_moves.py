import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pokedex.settings")
django.setup()

from pokemon.models import Move, Pokemon

moves_data = [
    # Normal type moves
    {
        "name": "Tackle",
        "description": "A physical attack in which the user charges and slams into the target with its whole body.",
        "type": "normal",
        "power": 40,
        "effect": "No additional effect.",
        "category": "physical",
        "accuracy": 100,
    },
    {
        "name": "Quick Attack",
        "description": "The user lunges at the target at a speed that makes it almost invisible. This move always goes first.",
        "type": "normal",
        "power": 40,
        "effect": "Usually goes first (priority +1).",
        "category": "physical",
        "accuracy": 100,
    },
    {
        "name": "Growl",
        "description": "The user growls in an endearing way, making opposing Pokémon less wary. This lowers their Attack stats.",
        "type": "normal",
        "power": None,
        "effect": "Lowers opponent's Attack by 1 stage.",
        "category": "status",
        "accuracy": 100,
    },
    {
        "name": "Hyper Beam",
        "description": "The target is attacked with a powerful beam. The user can't move on the next turn.",
        "type": "normal",
        "power": 150,
        "effect": "User must recharge next turn.",
        "category": "special",
        "accuracy": 90,
    },
    
    # Fire type moves
    {
        "name": "Ember",
        "description": "The target is attacked with small flames. This may also leave the target with a burn.",
        "type": "fire",
        "power": 40,
        "effect": "10% chance to burn the target.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Flamethrower",
        "description": "The target is scorched with an intense blast of fire. This may also leave the target with a burn.",
        "type": "fire",
        "power": 90,
        "effect": "10% chance to burn the target.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Fire Blast",
        "description": "The target is attacked with an intense blast of all-consuming fire. This may also leave the target with a burn.",
        "type": "fire",
        "power": 110,
        "effect": "10% chance to burn the target.",
        "category": "special",
        "accuracy": 85,
    },
    {
        "name": "Will-O-Wisp",
        "description": "The user shoots a sinister flame at the target to inflict a burn.",
        "type": "fire",
        "power": None,
        "effect": "Burns the target.",
        "category": "status",
        "accuracy": 85,
    },
    
    # Water type moves
    {
        "name": "Water Gun",
        "description": "The target is blasted with a forceful shot of water.",
        "type": "water",
        "power": 40,
        "effect": "No additional effect.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Hydro Pump",
        "description": "The target is blasted by a huge volume of water launched under great pressure.",
        "type": "water",
        "power": 110,
        "effect": "No additional effect.",
        "category": "special",
        "accuracy": 80,
    },
    {
        "name": "Surf",
        "description": "The user attacks everything around it by swamping its surroundings with a giant wave.",
        "type": "water",
        "power": 90,
        "effect": "Hits all adjacent Pokémon in battle.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Rain Dance",
        "description": "The user summons a heavy rain that falls for five turns, powering up Water-type moves.",
        "type": "water",
        "power": None,
        "effect": "Changes weather to rain for 5 turns.",
        "category": "status",
        "accuracy": None,
    },
    
    # Electric type moves
    {
        "name": "Thunder Shock",
        "description": "A jolt of electricity is hurled at the target to inflict damage. This may also leave the target with paralysis.",
        "type": "electric",
        "power": 40,
        "effect": "10% chance to paralyze the target.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Thunderbolt",
        "description": "A strong electric blast crashes down on the target. This may also leave the target with paralysis.",
        "type": "electric",
        "power": 90,
        "effect": "10% chance to paralyze the target.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Thunder",
        "description": "A wicked thunderbolt is dropped on the target to inflict damage. This may also leave the target with paralysis.",
        "type": "electric",
        "power": 110,
        "effect": "30% chance to paralyze the target. 100% accuracy in rain.",
        "category": "special",
        "accuracy": 70,
    },
    {
        "name": "Thunder Wave",
        "description": "The user launches a weak jolt of electricity that paralyzes the target.",
        "type": "electric",
        "power": None,
        "effect": "Paralyzes the target.",
        "category": "status",
        "accuracy": 90,
    },
    
    # Grass type moves
    {
        "name": "Vine Whip",
        "description": "The target is struck with slender, whiplike vines to inflict damage.",
        "type": "grass",
        "power": 45,
        "effect": "No additional effect.",
        "category": "physical",
        "accuracy": 100,
    },
    {
        "name": "Razor Leaf",
        "description": "Sharp-edged leaves are launched to slash at opposing Pokémon. Critical hits land more easily.",
        "type": "grass",
        "power": 55,
        "effect": "High critical hit ratio.",
        "category": "physical",
        "accuracy": 95,
    },
    {
        "name": "Solar Beam",
        "description": "A two-turn attack. The user gathers light, then blasts a bundled beam on the next turn.",
        "type": "grass",
        "power": 120,
        "effect": "Charges on first turn, attacks on second. No charge in harsh sunlight.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Leech Seed",
        "description": "A seed is planted on the target. It steals some HP from the target every turn.",
        "type": "grass",
        "power": None,
        "effect": "Drains HP from target each turn.",
        "category": "status",
        "accuracy": 90,
    },
    
    # Psychic type moves
    {
        "name": "Confusion",
        "description": "The target is hit by a weak telekinetic force. This may also confuse the target.",
        "type": "psychic",
        "power": 50,
        "effect": "10% chance to confuse the target.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Psychic",
        "description": "The target is hit by a strong telekinetic force. This may also lower the target's Sp. Def stat.",
        "type": "psychic",
        "power": 90,
        "effect": "10% chance to lower target's Special Defense by 1 stage.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Hypnosis",
        "description": "The user employs hypnotic suggestion to make the target fall into a deep sleep.",
        "type": "psychic",
        "power": None,
        "effect": "Puts the target to sleep.",
        "category": "status",
        "accuracy": 60,
    },
    
    # Ghost type moves
    {
        "name": "Shadow Ball",
        "description": "The user hurls a shadowy blob at the target. This may also lower the target's Sp. Def stat.",
        "type": "ghost",
        "power": 80,
        "effect": "20% chance to lower target's Special Defense by 1 stage.",
        "category": "special",
        "accuracy": 100,
    },
    {
        "name": "Night Shade",
        "description": "The user makes the target see a frightening mirage. It inflicts damage equal to the user's level.",
        "type": "ghost",
        "power": 1,  # Special case: damage equals user's level
        "effect": "Inflicts damage equal to user's level.",
        "category": "special",
        "accuracy": 100,
    },
]

def load_moves():
    for data in moves_data:
        Move.objects.get_or_create(name=data["name"], defaults=data)
    print(f"Loaded {len(moves_data)} moves successfully!")

if __name__ == "__main__":
    load_moves()