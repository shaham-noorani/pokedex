# Pokedex API Documentation

## Pagination

All list endpoints are paginated. The default page size is 25 items per page.

### Pagination Parameters
- `page`: The page number to retrieve (default: 1)
- `page_size`: Number of items per page (default: 25, can be overridden)

### Pagination Response Format
```json
{
  "count": 151,
  "next": "http://example.com/api/pokemon/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Bulbasaur",
      "sprite": "https://example.com/bulbasaur.png",
      "type_1": "Grass",
      "type_2": "Poison"
    },
    {
      "id": 2,
      "name": "Ivysaur",
      "sprite": "https://example.com/ivysaur.png",
      "type_1": "Grass",
      "type_2": "Poison"
    }
  ]
}
```

The response includes:
- `count`: Total number of items across all pages
- `next`: URL to the next page (null if there is no next page)
- `previous`: URL to the previous page (null if there is no previous page)
- `results`: Array of items for the current page

## Filtering and Searching

All list endpoints support filtering, searching, and ordering.

### Filtering Parameters
Filtering allows you to find items that match exact values:

- For Pokemon:
  - `type_1`: Filter by primary type (e.g., `?type_1=Fire`)
  - `type_2`: Filter by secondary type (e.g., `?type_2=Flying`)

- For Moves:
  - `type`: Filter by move type (e.g., `?type=water`)
  - `category`: Filter by move category (e.g., `?category=physical`)

### Search Parameter
Searching allows you to find items that contain the search term in specific fields:

- `search`: Search term to look for in name, types, or descriptions (e.g., `?search=pikachu`)
  - For Pokemon, searches in: name, type_1, type_2
  - For Moves, searches in: name, description, type, category

### Ordering Parameter
Ordering allows you to sort the results by specific fields:

- `ordering`: Field to order by, prefix with `-` for descending order (e.g., `?ordering=-hp` for highest HP first)
  - For Pokemon: id, name, hp, attack, defense, sp_atk, sp_def, speed
  - For Moves: id, name, power, accuracy

### Combining Parameters
You can combine multiple parameters to refine your search:

```
/api/pokemon/?type_1=Fire&ordering=-attack&search=blast
```

This would search for Fire-type Pokemon with "blast" in their name, ordered by highest attack first.

## Pokemon Endpoints

### GET /api/pokemon/
Returns a paginated list of Pokemon in the database.

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
Returns a paginated list of moves in the database. Uses the same pagination format as described in the Pagination section.

### GET /api/moves/{id}/
Returns details for a specific move.
