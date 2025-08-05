import { useState, useMemo, useCallback, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  fetchPokemonList, 
  type PokemonDetails, 
  type PaginatedResponse, 
  type SortOption, 
  type SortDirection,
  type PokemonFilterParams,
  type SortOrderString
} from '@/api/pokemon';
import { POKEMON_TYPES, SORT_OPTIONS, DEBOUNCE_DELAY, FALLBACK_SPRITE } from '@/constants/pokemon';
import { useDebounced, useInfiniteScroll } from '@/hooks';



// Component props interfaces
interface SearchBarProps {
  searchTerm: string;
  debouncedSearchTerm: string;
  onSearchChange: (value: string) => void;
}

interface SortControlsProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortByChange: (value: SortOption) => void;
  onSortDirectionChange: (value: SortDirection) => void;
}

interface TypeFiltersProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
}

interface PokemonCardProps {
  pokemon: PokemonDetails;
}

// Sub-components
function SearchBar({ searchTerm, debouncedSearchTerm, onSearchChange }: SearchBarProps) {
  const isSearching = searchTerm !== debouncedSearchTerm;

  return (
    <div className="mb-6">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
        Search Pokemon
        {isSearching && (
          <span className="ml-2 text-xs text-blue-600 animate-pulse">Searching...</span>
        )}
      </label>
      <div className="relative">
        <input
          type="text"
          id="search"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}

function SortControls({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }: SortControlsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortOption)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-2">
          Direction
        </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value as SortDirection)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}

function TypeFilters({ selectedTypes, onTypeToggle }: TypeFiltersProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Type
      </label>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeToggle(type)}
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
  );
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_SPRITE;
  };

  return (
    <Link 
      to={`/pokemon/${pokemon.id}`}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
    >
      <img 
        src={pokemon.sprite} 
        alt={pokemon.name} 
        className="w-24 h-24 mx-auto object-contain"
        onError={handleImageError}
      />
      <h2 className="text-lg font-semibold mt-2 text-center text-gray-800 capitalize">
        {pokemon.name}
      </h2>
      <p className="text-center text-gray-600 text-sm mt-1">
        {pokemon.type_1}{pokemon.type_2 ? ` / ${pokemon.type_2}` : ''}
      </p>
    </Link>
  );
}

// Main component
function PokemonList() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Custom hooks
  const debouncedSearchTerm = useDebounced(searchTerm, DEBOUNCE_DELAY);

  // Filter params for API
  const filterParams = useMemo<PokemonFilterParams>(() => {
    let ordering: SortOrderString = sortBy;
    if (sortDirection === 'desc') {
      ordering = `-${sortBy}` as SortOrderString;
    }

    const params: PokemonFilterParams = {
      ordering,
      search: debouncedSearchTerm || undefined,
    };

    // Handle single type filter through search
    if (selectedTypes.length === 1) {
      params.search = debouncedSearchTerm 
        ? `${debouncedSearchTerm} ${selectedTypes[0]}` 
        : selectedTypes[0];
    }

    return params;
  }, [debouncedSearchTerm, selectedTypes, sortBy, sortDirection]);

  // API query
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery<PaginatedResponse<PokemonDetails>>({
    queryKey: ['pokemon', filterParams],
    queryFn: ({ pageParam = 1 }) => fetchPokemonList({ ...filterParams, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) => lastPage.next ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  // Computed values
  const pokemonList = useMemo(() => 
    data?.pages.flatMap(page => page.results) || [], 
    [data]
  );

  const totalCount = data?.pages[0]?.count || 0;

  const filteredPokemonList = useMemo(() => {
    if (selectedTypes.length <= 1) return pokemonList;
    
    return pokemonList.filter(pokemon => 
      selectedTypes.includes(pokemon.type_1) || 
      (pokemon.type_2 && selectedTypes.includes(pokemon.type_2))
    );
  }, [pokemonList, selectedTypes]);

  // Infinite scroll
  const observerRef = useInfiniteScroll(fetchNextPage, [hasNextPage, isFetchingNextPage]);

  // Event handlers
  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSortBy('id');
    setSortDirection('asc');
  }, []);

  // Effects
  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [filterParams, refetch, isLoading]);

  // Loading and error states
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
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://img.pokemondb.net/sprites/sword-shield/icon/pikachu.png" 
              alt="Pikachu" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = FALLBACK_SPRITE;
              }}
            />
            <h1 className="text-4xl font-bold text-gray-800">Pokédex</h1>
          </div>
          <Link 
            to="/add" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Pokemon
          </Link>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <SearchBar 
            searchTerm={searchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <SortControls
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={setSortBy}
            onSortDirectionChange={setSortDirection}
          />
          
          <TypeFilters
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
          />

          {/* Clear Filters Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
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
        {filteredPokemonList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No Pokemon found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPokemonList.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}

        {/* Infinite Scroll Loading */}
        {hasNextPage && (
          <div ref={observerRef} className="flex justify-center py-8">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                <span>Loading more Pokemon...</span>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        )}

        {/* End of Results */}
        {!hasNextPage && pokemonList.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You've seen all {totalCount} Pokemon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PokemonList;