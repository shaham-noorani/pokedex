import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updatePokemon, fetchPokemonDetails, type CreatePokemonData, type Move, type PokemonDetails } from '@/api/pokemon';
import MoveSelector from '@/components/MoveSelector';

// Common Pokemon types for the dropdown
const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark',
  'steel', 'fairy'
];

function EditPokemon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<CreatePokemonData>({
    name: '',
    sprite: '',
    type_1: '',
    type_2: null,
    height: 0,
    weight: 0,
    hp: 1,
    attack: 1,
    defense: 1,
    sp_atk: 1,
    sp_def: 1,
    speed: 1,
    moves: [],
  });

  const [selectedMoves, setSelectedMoves] = useState<Move[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePokemonData, string>>>({});

  // Fetch existing Pokemon data
  const { 
    data: pokemon, 
    isLoading: isLoadingPokemon, 
    error: pokemonError 
  } = useQuery<PokemonDetails>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonDetails(id!),
    enabled: !!id,
  });

  // Update form when Pokemon data is loaded
  useEffect(() => {
    if (pokemon) {
      setFormData({
        name: pokemon.name,
        sprite: pokemon.sprite,
        type_1: pokemon.type_1,
        type_2: pokemon.type_2,
        height: pokemon.height,
        weight: pokemon.weight,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        sp_atk: pokemon.sp_atk,
        sp_def: pokemon.sp_def,
        speed: pokemon.speed,
        moves: pokemon.moves.map(move => move.id),
      });
      setSelectedMoves(pokemon.moves);
    }
  }, [pokemon]);

  const updatePokemonMutation = useMutation({
    mutationFn: (data: CreatePokemonData) => updatePokemon(id!, data),
    onSuccess: (updatedPokemon) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['pokemon'] });
      queryClient.invalidateQueries({ queryKey: ['pokemon', id] });
      // Navigate back to the Pokemon's detail page
      navigate(`/pokemon/${updatedPokemon.id}`);
    },
    onError: (error) => {
      console.error('Failed to update Pokemon:', error);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePokemonData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pokemon name is required';
    }

    if (!formData.sprite.trim()) {
      newErrors.sprite = 'Sprite URL is required';
    } else if (!isValidUrl(formData.sprite)) {
      newErrors.sprite = 'Please enter a valid URL';
    }

    if (!formData.type_1) {
      newErrors.type_1 = 'Primary type is required';
    }

    if (formData.height <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }

    if (formData.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    // Validate stats (should be between 1 and 255 as per Pokemon standards)
    const statFields: (keyof CreatePokemonData)[] = ['hp', 'attack', 'defense', 'sp_atk', 'sp_def', 'speed'];
    statFields.forEach(stat => {
      const value = formData[stat] as number;
      if (value < 1 || value > 255) {
        newErrors[stat] = 'Stats must be between 1 and 255';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof CreatePokemonData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleMovesChange = (moves: Move[]) => {
    setSelectedMoves(moves);
    setFormData(prev => ({
      ...prev,
      moves: moves.map(move => move.id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    updatePokemonMutation.mutate(formData);
  };

  // Loading state while fetching Pokemon data
  if (isLoadingPokemon) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading Pokemon data...</div>
      </div>
    );
  }

  // Error state if Pokemon not found
  if (pokemonError || !pokemon) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-2xl text-red-600 mb-4">
          Error: {pokemonError instanceof Error ? pokemonError.message : 'Pokemon not found'}
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
          Back to Pokédex
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/pokemon/${id}`} className="text-blue-600 hover:text-blue-800 underline">
            ← Back to {pokemon.name}
          </Link>
          <span className="text-gray-400">|</span>
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
            Pokédex
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Pokemon</h1>
          <p className="text-gray-600 mb-8">Make changes to {pokemon.name}'s information</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Pokemon Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter Pokemon name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="sprite" className="block text-sm font-medium text-gray-700 mb-2">
                  Sprite URL *
                </label>
                <input
                  type="url"
                  id="sprite"
                  value={formData.sprite}
                  onChange={(e) => handleInputChange('sprite', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.sprite ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/pokemon-sprite.png"
                />
                {errors.sprite && <p className="text-red-500 text-sm mt-1">{errors.sprite}</p>}
              </div>
            </div>

            {/* Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type_1" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Type *
                </label>
                <select
                  id="type_1"
                  value={formData.type_1}
                  onChange={(e) => handleInputChange('type_1', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.type_1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select primary type</option>
                  {POKEMON_TYPES.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type_1 && <p className="text-red-500 text-sm mt-1">{errors.type_1}</p>}
              </div>

              <div>
                <label htmlFor="type_2" className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Type (Optional)
                </label>
                <select
                  id="type_2"
                  value={formData.type_2 || ''}
                  onChange={(e) => handleInputChange('type_2', e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No secondary type</option>
                  {POKEMON_TYPES.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Physical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  Height (meters) *
                </label>
                <input
                  type="number"
                  id="height"
                  step="0.1"
                  min="0.1"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.height ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1.5"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  id="weight"
                  step="0.1"
                  min="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="25.5"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>

            {/* Battle Stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Battle Stats (1-255)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="hp" className="block text-sm font-medium text-red-700 mb-2">
                    HP *
                  </label>
                  <input
                    type="number"
                    id="hp"
                    min="1"
                    max="255"
                    value={formData.hp}
                    onChange={(e) => handleInputChange('hp', parseInt(e.target.value) || 1)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.hp ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.hp && <p className="text-red-500 text-sm mt-1">{errors.hp}</p>}
                </div>

                <div>
                  <label htmlFor="attack" className="block text-sm font-medium text-orange-700 mb-2">
                    Attack *
                  </label>
                  <input
                    type="number"
                    id="attack"
                    min="1"
                    max="255"
                    value={formData.attack}
                    onChange={(e) => handleInputChange('attack', parseInt(e.target.value) || 1)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.attack ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.attack && <p className="text-red-500 text-sm mt-1">{errors.attack}</p>}
                </div>

                <div>
                  <label htmlFor="defense" className="block text-sm font-medium text-yellow-700 mb-2">
                    Defense *
                  </label>
                  <input
                    type="number"
                    id="defense"
                    min="1"
                    max="255"
                    value={formData.defense}
                    onChange={(e) => handleInputChange('defense', parseInt(e.target.value) || 1)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                      errors.defense ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.defense && <p className="text-red-500 text-sm mt-1">{errors.defense}</p>}
                </div>

                <div>
                  <label htmlFor="sp_atk" className="block text-sm font-medium text-blue-700 mb-2">
                    Sp. Attack *
                  </label>
                  <input
                    type="number"
                    id="sp_atk"
                    min="1"
                    max="255"
                    value={formData.sp_atk}
                    onChange={(e) => handleInputChange('sp_atk', parseInt(e.target.value) || 1)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.sp_atk ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.sp_atk && <p className="text-red-500 text-sm mt-1">{errors.sp_atk}</p>}
                </div>

                <div>
                  <label htmlFor="sp_def" className="block text-sm font-medium text-green-700 mb-2">
                    Sp. Defense *
                  </label>
                  <input
                    type="number"
                    id="sp_def"
                    min="1"
                    max="255"
                    value={formData.sp_def}
                    onChange={(e) => handleInputChange('sp_def', parseInt(e.target.value) || 1)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.sp_def ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.sp_def && <p className="text-red-500 text-sm mt-1">{errors.sp_def}</p>}
                </div>

                <div>
                  <label htmlFor="speed" className="block text-sm font-medium text-pink-700 mb-2">
                    Speed *
                  </label>
                  <input
                    type="number"
                    id="speed"
                    min="1"
                    max="255"
                    value={formData.speed}
                    onChange={(e) => handleInputChange('speed', parseInt(e.target.value) || 1)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                      errors.speed ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.speed && <p className="text-red-500 text-sm mt-1">{errors.speed}</p>}
                </div>
              </div>
            </div>

            {/* Move Selection */}
            <div>
              <MoveSelector 
                selectedMoves={selectedMoves}
                onMovesChange={handleMovesChange}
                maxMoves={4}
              />
            </div>

            {/* Preview Section */}
            {formData.sprite && isValidUrl(formData.sprite) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={formData.sprite} 
                    alt={formData.name || 'Pokemon preview'} 
                    className="w-24 h-24 object-contain bg-white rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmB3wsaDEOe_tyGXvaryIjttZtSP7L0b-KoA&s';
                    }}
                  />
                  <div>
                    <h4 className="text-xl font-semibold capitalize text-gray-800">
                      {formData.name || 'Pokemon'}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {formData.type_1 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium capitalize mr-2">
                          {formData.type_1}
                        </span>
                      )}
                      {formData.type_2 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium capitalize">
                          {formData.type_2}
                        </span>
                      )}
                    </p>
                    {selectedMoves.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Moves:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedMoves.map(move => (
                            <span key={move.id} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                              {move.name.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {updatePokemonMutation.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  Error updating Pokemon: {updatePokemonMutation.error instanceof Error ? updatePokemonMutation.error.message : 'Unknown error'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={updatePokemonMutation.isPending}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updatePokemonMutation.isPending ? 'Updating Pokemon...' : 'Update Pokemon'}
              </button>
              <Link
                to={`/pokemon/${id}`}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPokemon;