from rest_framework import serializers
from .models import Pokemon, Move

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = ['id', 'name', 'description', 'type', 'power', 'effect', 'category', 'accuracy']

class PokemonSerializer(serializers.ModelSerializer):
    moves = MoveSerializer(many=True, read_only=True)
    move_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Pokemon
        fields = ['id', 'name', 'sprite', 'type_1', 'type_2', 'hp', 'attack', 
                  'defense', 'sp_atk', 'sp_def', 'speed', 'height', 'weight', 'moves', 'move_ids']
    
    def to_internal_value(self, data):
        # If 'moves' is in the request data and it's a list of IDs, 
        # copy it to 'move_ids' for backward compatibility
        if 'moves' in data and isinstance(data['moves'], list):
            # Only copy if all elements are integers (IDs)
            if all(isinstance(item, int) for item in data['moves']):
                data['move_ids'] = data['moves']
        
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        move_ids = validated_data.pop('move_ids', [])
        pokemon = Pokemon.objects.create(**validated_data)
        
        # Associate moves with the Pokemon
        if move_ids:
            moves = Move.objects.filter(id__in=move_ids)
            pokemon.moves.set(moves)
        
        return pokemon
    
    def update(self, instance, validated_data):
        move_ids = validated_data.pop('move_ids', None)
        
        # Update Pokemon fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update moves if provided
        if move_ids is not None:
            moves = Move.objects.filter(id__in=move_ids)
            instance.moves.set(moves)
        
        return instance
