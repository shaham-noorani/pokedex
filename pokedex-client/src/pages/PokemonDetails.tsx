import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { 
  fetchPokemonDetails, 
  type PokemonDetails as PokemonDetailsType, 
  type Move
} from '@/api/pokemon';
import { FALLBACK_SPRITE, STAT_CONFIG } from '@/constants/pokemon';
import { formatNumber, getTypeColor, getCategoryColor } from '@/utils/pokemon';



// ===== SUB-COMPONENTS =====
interface PokemonHeaderProps {
  pokemonId: string;
}

function PokemonHeader({ pokemonId }: PokemonHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
        ← Back to Pokédex
      </Link>
      <Link 
        to={`/pokemon/${pokemonId}/edit`}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Pokemon
      </Link>
    </div>
  );
}

interface PokemonImageProps {
  pokemon: PokemonDetailsType;
}

function PokemonImage({ pokemon }: PokemonImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_SPRITE;
  };

  return (
    <div className="flex-shrink-0">
      <img 
        src={pokemon.sprite} 
        alt={pokemon.name} 
        className="w-48 h-48 object-contain bg-gray-100 rounded-lg"
        onError={handleImageError}
      />
    </div>
  );
}

interface PokemonBasicInfoProps {
  pokemon: PokemonDetailsType;
}

function PokemonBasicInfo({ pokemon }: PokemonBasicInfoProps) {
  return (
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
          <p className="text-2xl font-bold text-gray-800">{formatNumber(pokemon.height)} m</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Weight</h3>
          <p className="text-2xl font-bold text-gray-800">{formatNumber(pokemon.weight)} kg</p>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  stat: typeof STAT_CONFIG[number];
  value: number;
}

function StatCard({ stat, value }: StatCardProps) {
  return (
    <div className={`bg-${stat.color}-50 p-4 rounded-lg border border-${stat.color}-200`}>
      <h4 className={`text-sm font-medium text-${stat.color}-700 mb-1`}>{stat.label}</h4>
      <p className={`text-2xl font-bold text-${stat.color}-800`}>{value}</p>
    </div>
  );
}

interface BattleStatsProps {
  pokemon: PokemonDetailsType;
}

function BattleStats({ pokemon }: BattleStatsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Battle Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_CONFIG.map(stat => (
          <StatCard
            key={stat.key}
            stat={stat}
            value={pokemon[stat.key]}
          />
        ))}
      </div>
    </div>
  );
}

interface MoveCardProps {
  move: Move;
}

function MoveCard({ move }: MoveCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-gray-800 capitalize">
          {move.name.replace('-', ' ')}
        </h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(move.category)}`}>
          {move.category}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(move.type)}`}>
          {move.type}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
        {move.power && (
          <div>
            <span className="font-medium">Power:</span> {move.power}
          </div>
        )}
        {move.accuracy && (
          <div>
            <span className="font-medium">Accuracy:</span> {move.accuracy}%
          </div>
        )}
      </div>
      
      {move.description && (
        <p className="text-sm text-gray-600 mt-2">
          {move.description}
        </p>
      )}
    </div>
  );
}

interface MovesListProps {
  moves: Move[];
}

function MovesList({ moves }: MovesListProps) {
  if (!moves || moves.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Moves</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moves.map(move => (
          <MoveCard key={move.id} move={move} />
        ))}
      </div>
    </div>
  );
}

// ===== MAIN COMPONENT =====
function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { 
    data: pokemon, 
    isLoading, 
    error 
  } = useQuery<PokemonDetailsType>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonDetails(id!),
    enabled: !!id,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <div className="text-2xl text-gray-600">Loading Pokemon details...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !pokemon) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-2xl text-red-600 mb-4 font-semibold">
            {error instanceof Error ? error.message : 'Pokemon not found'}
          </div>
          <p className="text-gray-600 mb-6">
            The Pokemon you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            ← Back to Pokédex
          </Link>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <PokemonHeader pokemonId={id!} />
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Pokemon Overview */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <PokemonImage pokemon={pokemon} />
            <PokemonBasicInfo pokemon={pokemon} />
          </div>
          
          {/* Battle Stats */}
          <BattleStats pokemon={pokemon} />

          {/* Moves */}
          <MovesList moves={pokemon.moves} />
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;