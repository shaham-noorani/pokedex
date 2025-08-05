from django.contrib import admin
from .models import Pokemon, Move

@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    list_display = ('name', 'type_1', 'type_2', 'hp', 'attack', 'defense')
    search_fields = ('name',)

@admin.register(Move)
class MoveAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'category', 'power', 'accuracy')
    search_fields = ('name', 'description')
    list_filter = ('type', 'category')
