export type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  type_1: string;
  type_2: string | null;
};

export type PokemonDetails = {
  id: number;
  name: string;
  sprite: string;
  type_1: string;
  type_2: string | null;
  height: number;
  weight: number;
  hp: number;
  attack: number;
  defense: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
};

// Extended Pokemon type for list view with additional filterable fields
export type PokemonWithStats = Pokemon & {
  hp?: number;
  attack?: number;
  defense?: number;
  sp_atk?: number;
  sp_def?: number;
  speed?: number;
};

export type SortOption = 
  | 'id'
  | 'name'
  | 'type_1';

export type SortDirection = 'asc' | 'desc';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchPokemonList = async (): Promise<Pokemon[]> => {
  const response = await fetch(`${API_BASE_URL}/pokemon/`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchPokemonDetails = async (id: string): Promise<PokemonDetails> => {
  const response = await fetch(`${API_BASE_URL}/pokemon/${id}/`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon details: ${response.statusText}`);
  }
  
  return response.json();
};