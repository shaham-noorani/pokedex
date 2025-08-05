import type { PokemonStats } from '@/api/pokemon';

// ===== POKEMON TYPES =====
export const POKEMON_TYPES = [
  'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting',
  'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice',
  'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

// ===== STAT CONFIGURATION =====
export const STAT_CONFIG = [
  { key: 'hp' as keyof PokemonStats, label: 'HP', color: 'red' },
  { key: 'attack' as keyof PokemonStats, label: 'Attack', color: 'orange' },
  { key: 'defense' as keyof PokemonStats, label: 'Defense', color: 'yellow' },
  { key: 'sp_atk' as keyof PokemonStats, label: 'Sp. Attack', color: 'blue' },
  { key: 'sp_def' as keyof PokemonStats, label: 'Sp. Defense', color: 'green' },
  { key: 'speed' as keyof PokemonStats, label: 'Speed', color: 'pink' },
] as const;

// ===== STAT LIMITS =====
export const STAT_LIMITS = {
  MIN: 1,
  MAX: 255,
} as const;

// ===== SORT OPTIONS =====
export const SORT_OPTIONS = [
  { value: 'id', label: 'ID Number' },
  { value: 'name', label: 'Name' },
  { value: 'hp', label: 'HP' },
  { value: 'attack', label: 'Attack' },
  { value: 'defense', label: 'Defense' },
  { value: 'sp_atk', label: 'Special Attack' },
  { value: 'sp_def', label: 'Special Defense' },
  { value: 'speed', label: 'Speed' },
] as const;

// ===== IMAGES =====
export const FALLBACK_SPRITE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmB3wsaDEOe_tyGXvaryIjttZtSP7L0b-KoA&s';

// ===== COLORS =====
export const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-100 text-orange-800',
  water: 'bg-blue-100 text-blue-800',
  grass: 'bg-green-100 text-green-800',
  electric: 'bg-yellow-100 text-yellow-800',
  psychic: 'bg-purple-100 text-purple-800',
  fighting: 'bg-red-100 text-red-800',
  poison: 'bg-purple-100 text-purple-800',
  ground: 'bg-yellow-100 text-yellow-800',
  flying: 'bg-indigo-100 text-indigo-800',
  bug: 'bg-green-100 text-green-800',
  rock: 'bg-yellow-100 text-yellow-800',
  ghost: 'bg-purple-100 text-purple-800',
  dragon: 'bg-purple-100 text-purple-800',
  dark: 'bg-gray-100 text-gray-800',
  steel: 'bg-gray-100 text-gray-800',
  fairy: 'bg-pink-100 text-pink-800',
  ice: 'bg-cyan-100 text-cyan-800',
  normal: 'bg-gray-100 text-gray-800',
};

export const CATEGORY_COLORS: Record<string, string> = {
  physical: 'bg-red-100 text-red-800',
  special: 'bg-blue-100 text-blue-800',
  status: 'bg-gray-100 text-gray-800',
};

// ===== TIMING =====
export const DEBOUNCE_DELAY = 300;