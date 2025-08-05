# Pokedex API Documentation

## Pokemon Endpoints

### GET /api/pokemon/
Returns a list of all Pokemon in the database.

### GET /api/pokemon/{id}/
Returns details for a specific Pokemon, including its moves.

### POST /api/pokemon/
Creates a new Pokemon. You can include moves by providing an array of move IDs in either the `moves` or `move_ids` field.

Example:
```json
{
  "name": "Pikachu",
  "sprite": "https://example.com/pikachu.png",
  "type_1": "Electric",
  "type_2": null,
  "hp": 35,
  "attack": 55,
  "defense": 40,
  "sp_atk": 50,
  "sp_def": 50,
  "speed": 90,
  "height": 0.4,
  "weight": 6.0,
  "moves": [134, 135]
}
```

### PUT /api/pokemon/{id}/
Updates an existing Pokemon. You can update the Pokemon's moves by providing an array of move IDs in either the `moves` or `move_ids` field.

Example:
```json
{
  "name": "Pikachu",
  "moves": [134, 135]
}
```

### PATCH /api/pokemon/{id}/
Partially updates an existing Pokemon. You can update the Pokemon's moves by providing an array of move IDs in either the `moves` or `move_ids` field.

Example:
```json
{
  "moves": [134, 135]
}
```

### DELETE /api/pokemon/{id}/
Deletes a specific Pokemon.

## Move Endpoints

### GET /api/moves/
Returns a list of all moves in the database.

### GET /api/moves/{id}/
Returns details for a specific move.
