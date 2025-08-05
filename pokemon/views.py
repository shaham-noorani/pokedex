from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Pokemon, Move
from .serializers import PokemonSerializer, MoveSerializer

class PokemonViewSet(viewsets.ModelViewSet):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer
    
    # Configure filtering, searching, and ordering
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type_1', 'type_2']
    search_fields = ['name', 'type_1', 'type_2']
    ordering_fields = ['id', 'name', 'hp', 'attack', 'defense', 'sp_atk', 'sp_def', 'speed']
    ordering = ['id']
    
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
    
    # Configure filtering, searching, and ordering
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'category']
    search_fields = ['name', 'description', 'type', 'category']
    ordering_fields = ['id', 'name', 'power', 'accuracy']
    ordering = ['id']
