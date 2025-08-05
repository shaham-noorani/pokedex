import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPokemonList, type Pokemon } from './api/pokemon';

function PokemonList() {
  const { data: pokemonList = [], isLoading, error } = useQuery<Pokemon[]>({
    queryKey: ['pokemon'],
    queryFn: fetchPokemonList,
  });

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading Pokédex...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">
          Error loading Pokemon: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex items-center justify-center gap-3 mb-8">
        <img 
          src="https://img.pokemondb.net/sprites/sword-shield/icon/pikachu.png" 
          alt="Pikachu" 
          className="w-12 h-12 object-contain"
        />
        <h1 className="text-4xl font-bold text-gray-800">Pokédex</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pokemonList.map(pokemon => (
          <Link 
            key={pokemon.id} 
            to={`/pokemon/${pokemon.id}`}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            <img 
              src={pokemon.sprite} 
              alt={pokemon.name} 
              className="w-24 h-24 mx-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmB3wsaDEOe_tyGXvaryIjttZtSP7L0b-KoA&s';
              }}
            />
            <h2 className="text-lg font-semibold mt-2 text-center text-gray-800 capitalize">
              {pokemon.name}
            </h2>
            <p className="text-center text-gray-600 text-sm mt-1">
              {pokemon.type_1}{pokemon.type_2 ? ` / ${pokemon.type_2}` : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PokemonList;