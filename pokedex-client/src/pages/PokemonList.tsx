import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPokemonList, type Pokemon, type SortOption, type SortDirection } from '@/api/pokemon';

function PokemonList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: pokemonList = [], isLoading, error } = useQuery<Pokemon[]>({
    queryKey: ['pokemon'],
    queryFn: fetchPokemonList,
  });

  // Get unique types for filter options
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    pokemonList.forEach(pokemon => {
      types.add(pokemon.type_1);
      if (pokemon.type_2) types.add(pokemon.type_2);
    });
    return Array.from(types).sort();
  }, [pokemonList]);

  // Filter and sort Pokemon
  const filteredAndSortedPokemon = useMemo(() => {
    const filtered = pokemonList.filter(pokemon => {
      // Search filter
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = selectedTypes.length === 0 || 
        selectedTypes.includes(pokemon.type_1) ||
        (pokemon.type_2 && selectedTypes.includes(pokemon.type_2));

      return matchesSearch && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [pokemonList, searchTerm, selectedTypes, sortBy, sortDirection]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSortBy('id');
    setSortDirection('asc');
  };

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
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Pokédex</h1>
      
      {/* Search and Filter Controls */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Pokemon
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sort Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="id">ID Number</option>
                <option value="name">Name</option>
                <option value="type_1">Primary Type</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-2">
                Direction
              </label>
              <select
                id="sortDirection"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as SortDirection)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Type Filters */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary and Clear Button */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedPokemon.length} of {pokemonList.length} Pokemon
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredAndSortedPokemon.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No Pokemon found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedPokemon.map(pokemon => (
              <Link 
                key={pokemon.id} 
                to={`/pokemon/${pokemon.id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
              >
                <img 
                  src={pokemon.sprite} 
                  alt={pokemon.name} 
                  className="w-24 h-24 mx-auto object-contain"
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
        )}
      </div>
    </div>
  );
}

export default PokemonList;