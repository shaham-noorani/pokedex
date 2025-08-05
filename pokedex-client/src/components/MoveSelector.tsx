import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovesList, type Move } from '@/api/pokemon';

interface MoveSelectorProps {
  selectedMoves: Move[];
  onMovesChange: (moves: Move[]) => void;
  maxMoves?: number;
}

function MoveSelector({ selectedMoves, onMovesChange, maxMoves = 4 }: MoveSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: allMoves = [], isLoading, error } = useQuery<Move[]>({
    queryKey: ['moves'],
    queryFn: fetchMovesList,
  });

  // Get unique types and categories for filtering
  const { availableTypes, availableCategories } = useMemo(() => {
    const types = new Set<string>();
    const categories = new Set<string>();
    
    allMoves.forEach(move => {
      types.add(move.type);
      categories.add(move.category);
    });
    
    return {
      availableTypes: Array.from(types).sort(),
      availableCategories: Array.from(categories).sort()
    };
  }, [allMoves]);

  // Filter moves based on search and filters
  const filteredMoves = useMemo(() => {
    return allMoves.filter(move => {
      // Skip already selected moves
      if (selectedMoves.some(selected => selected.id === move.id)) {
        return false;
      }

      // Search filter
      const matchesSearch = move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (move.description && move.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Type filter
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(move.type);
      
      // Category filter
      const matchesCategory = !selectedCategory || move.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [allMoves, selectedMoves, searchTerm, selectedTypes, selectedCategory]);

  const handleAddMove = (move: Move) => {
    if (selectedMoves.length < maxMoves) {
      onMovesChange([...selectedMoves, move]);
    }
  };

  const handleRemoveMove = (moveId: number) => {
    onMovesChange(selectedMoves.filter(move => move.id !== moveId));
  };

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
    setSelectedCategory('');
  };

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      fire: 'bg-red-100 text-red-800',
      water: 'bg-blue-100 text-blue-800',
      grass: 'bg-green-100 text-green-800',
      electric: 'bg-yellow-100 text-yellow-800',
      psychic: 'bg-purple-100 text-purple-800',
      ice: 'bg-cyan-100 text-cyan-800',
      dragon: 'bg-indigo-100 text-indigo-800',
      dark: 'bg-gray-600 text-white',
      fairy: 'bg-pink-100 text-pink-800',
      fighting: 'bg-red-200 text-red-900',
      poison: 'bg-purple-200 text-purple-900',
      ground: 'bg-yellow-200 text-yellow-900',
      flying: 'bg-indigo-200 text-indigo-900',
      bug: 'bg-green-200 text-green-900',
      rock: 'bg-yellow-300 text-yellow-900',
      ghost: 'bg-purple-300 text-purple-900',
      steel: 'bg-gray-300 text-gray-900',
      normal: 'bg-gray-100 text-gray-800',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Moves</h3>
        <div className="text-center py-8">
          <div className="text-gray-600">Loading moves...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Moves</h3>
        <div className="text-center py-8">
          <div className="text-red-600">Error loading moves: {error instanceof Error ? error.message : 'Unknown error'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Moves ({selectedMoves.length}/{maxMoves})
      </h3>

      {/* Selected Moves */}
      {selectedMoves.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Moves</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedMoves.map((move) => (
              <div key={move.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800 capitalize">
                    {move.name.replace('-', ' ')}
                  </h5>
                  <button
                    onClick={() => handleRemoveMove(move.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(move.type)}`}>
                    {move.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    move.category === 'physical' ? 'bg-red-100 text-red-800' :
                    move.category === 'special' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {move.category}
                  </span>
                </div>
                {move.power && (
                  <div className="text-xs text-gray-600">
                    Power: {move.power} | Accuracy: {move.accuracy || 'N/A'}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add More Moves */}
      {selectedMoves.length < maxMoves && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add Moves</h4>
          
          {/* Search and Filters */}
          <div className="space-y-4 mb-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search moves by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Filter by Type</label>
              <div className="flex flex-wrap gap-1">
                {availableTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
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
          </div>

          {/* Available Moves */}
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
            {filteredMoves.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No moves found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredMoves.slice(0, 50).map((move) => (
                  <div key={move.id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-800 capitalize">
                            {move.name.replace('-', ' ')}
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(move.type)}`}>
                            {move.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            move.category === 'physical' ? 'bg-red-100 text-red-800' :
                            move.category === 'special' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {move.category}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-600 mb-1">
                          {move.power && <span>Power: {move.power}</span>}
                          {move.accuracy && <span>Accuracy: {move.accuracy}%</span>}
                        </div>
                        {move.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">{move.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddMove(move)}
                        className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
                {filteredMoves.length > 50 && (
                  <div className="p-3 text-center text-sm text-gray-500">
                    Showing first 50 results. Refine your search to see more.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MoveSelector;