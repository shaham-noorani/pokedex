from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pokemon, Move
from .serializers import PokemonSerializer, MoveSerializer

class PokemonViewSet(viewsets.ModelViewSet):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer
    
    @action(detail=True, methods=['get'])
    def moves(self, request, pk=None):
        """
        Returns a list of moves that the Pokemon with the given ID can learn.
        """
        pokemon = self.get_object()
        moves = pokemon.moves.all()
        serializer = MoveSerializer(moves, many=True)
        return Response(serializer.data)

class MoveViewSet(viewsets.ModelViewSet):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer
