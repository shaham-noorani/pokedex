from django.db import models

class Pokemon(models.Model):
    name = models.CharField(max_length=100)
    sprite = models.URLField(blank=True, null=True)
    type_1 = models.CharField(max_length=50)
    type_2 = models.CharField(max_length=50, blank=True, null=True)
    hp = models.IntegerField()
    attack = models.IntegerField()
    defense = models.IntegerField()
    sp_atk = models.IntegerField()
    sp_def = models.IntegerField()
    speed = models.IntegerField()
    height = models.FloatField(default=0)  # Height in meters
    weight = models.FloatField(default=0)  # Weight in kilograms
    moves = models.ManyToManyField('Move', blank=True, related_name='pokemon')

    def __str__(self):
        return self.name

class Move(models.Model):
    MOVE_TYPES = [
        ('normal', 'Normal'),
        ('fire', 'Fire'),
        ('water', 'Water'),
        ('electric', 'Electric'),
        ('grass', 'Grass'),
        ('ice', 'Ice'),
        ('fighting', 'Fighting'),
        ('poison', 'Poison'),
        ('ground', 'Ground'),
        ('flying', 'Flying'),
        ('psychic', 'Psychic'),
        ('bug', 'Bug'),
        ('rock', 'Rock'),
        ('ghost', 'Ghost'),
        ('dragon', 'Dragon'),
        ('dark', 'Dark'),
        ('steel', 'Steel'),
        ('fairy', 'Fairy'),
    ]
    
    CATEGORY_CHOICES = [
        ('physical', 'Physical'),
        ('special', 'Special'),
        ('status', 'Status'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=MOVE_TYPES)
    power = models.IntegerField(null=True, blank=True)  # Null for status moves
    effect = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    accuracy = models.IntegerField(null=True, blank=True)  # Null for moves that never miss
    
    def __str__(self):
        return self.name
