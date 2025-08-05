from rest_framework import serializers
from .models import Pokemon, Move

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ['id', 'name', 'description', 'type', 'power', 'effect', 'category', 'accuracy']

class PokemonSerializer(serializers.ModelSerializer):
    moves = MoveSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pokemon
        fields = ['id', 'name', 'sprite', 'type_1', 'type_2', 'hp', 'attack', 
                  'defense', 'sp_atk', 'sp_def', 'speed', 'height', 'weight', 'moves']
