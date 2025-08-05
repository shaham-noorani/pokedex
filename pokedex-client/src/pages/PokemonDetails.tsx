import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemonDetails, type PokemonDetails as PokemonDetailsType } from '@/api/pokemon';

function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { 
    data: pokemon, 
    isLoading, 
    error 
  } = useQuery<PokemonDetailsType>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonDetails(id!),
    enabled: !!id, // Only run query if id exists
  });

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-2xl text-red-600 mb-4">
          Error: {error instanceof Error ? error.message : 'Pokemon not found'}
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
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline mb-6 inline-block">
          ← Back to Pokédex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Pokemon Image */}
            <div className="flex-shrink-0">
              <img 
                src={pokemon.sprite} 
                alt={pokemon.name} 
                className="w-48 h-48 object-contain bg-gray-100 rounded-lg"
              />
            </div>
            
            {/* Pokemon Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 capitalize mb-2">
                {pokemon.name}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
              
              {/* Types */}
              <div className="flex gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {pokemon.type_1}
                </span>
                {pokemon.type_2 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {pokemon.type_2}
                  </span>
                )}
              </div>
              
              {/* Physical Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Height</h3>
                  <p className="text-2xl font-bold text-gray-800">{pokemon.height / 10} m</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Weight</h3>
                  <p className="text-2xl font-bold text-gray-800">{pokemon.weight / 10} kg</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Battle Stats */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Battle Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="text-sm font-medium text-red-700 mb-1">HP</h4>
                <p className="text-2xl font-bold text-red-800">{pokemon.hp}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="text-sm font-medium text-orange-700 mb-1">Attack</h4>
                <p className="text-2xl font-bold text-orange-800">{pokemon.attack}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-700 mb-1">Defense</h4>
                <p className="text-2xl font-bold text-yellow-800">{pokemon.defense}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-700 mb-1">Sp. Attack</h4>
                <p className="text-2xl font-bold text-blue-800">{pokemon.sp_atk}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-sm font-medium text-green-700 mb-1">Sp. Defense</h4>
                <p className="text-2xl font-bold text-green-800">{pokemon.sp_def}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <h4 className="text-sm font-medium text-pink-700 mb-1">Speed</h4>
                <p className="text-2xl font-bold text-pink-800">{pokemon.speed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;