// ===== CONSTANTS =====
const API_BASE_URL = 'http://localhost:8000/api';

// ===== CORE TYPES =====

// Move-related types
export type MoveCategory = 'physical' | 'special' | 'status';

export type Move = {
  id: number;
  name: string;
  description: string;
  type: string;
  power: number | null;
  effect: string | null;
  category: MoveCategory;
  accuracy: number | null;
};

// Pokemon-related types
export type PokemonType = 
  | 'Bug' | 'Dark' | 'Dragon' | 'Electric' | 'Fairy' | 'Fighting'
  | 'Fire' | 'Flying' | 'Ghost' | 'Grass' | 'Ground' | 'Ice'
  | 'Normal' | 'Poison' | 'Psychic' | 'Rock' | 'Steel' | 'Water';

export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
};

export type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  type_1: string;
  type_2: string | null;
};

export type PokemonDetails = Pokemon & PokemonStats & {
  height: number;
  weight: number;
  moves: Move[];
};

// Sorting and filtering types
export type SortOption = 
  | 'id' | 'name' | 'type_1' | 'type_2'
  | 'hp' | 'attack' | 'defense' | 'sp_atk' | 'sp_def' | 'speed';

export type SortOrderString = SortOption | `-${SortOption}`;
export type SortDirection = 'asc' | 'desc';

// API response types
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ApiError = {
  message: string;
  status: number;
  details?: Record<string, unknown>;
};

// ===== FILTER PARAMS =====
export type BaseFilterParams = {
  page?: number;
  search?: string;
  ordering?: string;
};

export type PokemonFilterParams = BaseFilterParams & {
  type_1?: string;
  type_2?: string;
  ordering?: SortOrderString;
};

export type MoveFilterParams = BaseFilterParams & {
  type?: string;
  category?: MoveCategory;
};

// ===== CREATE/UPDATE TYPES =====
export type CreatePokemonData = Omit<PokemonDetails, 'id' | 'moves'> & {
  moves: number[]; // Array of move IDs
};

export type UpdatePokemonData = CreatePokemonData;

// ===== LEGACY TYPES (for backwards compatibility) =====
export type PokemonListItem = PokemonDetails;
export type PokemonWithStats = Pokemon & Partial<PokemonStats>;

// ===== UTILITY FUNCTIONS =====

/**
 * Builds URLSearchParams from an object, filtering out undefined values
 */
function buildQueryParams(params: Record<string, unknown>): URLSearchParams {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  return queryParams;
}

/**
 * Creates a standardized API error from a response
 */
async function createApiError(response: Response): Promise<ApiError> {
  let details: Record<string, unknown> = {};
  
  try {
    details = await response.json();
  } catch {
    // If we can't parse JSON, just use the status text
    details = { message: response.statusText };
  }
  
  return {
    message: `API Error ${response.status}: ${response.statusText}`,
    status: response.status,
    details,
  };
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await createApiError(response);
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw new Error(`Network error: ${error.message}`);
    }
    throw error;
  }
}

// ===== POKEMON API FUNCTIONS =====

/**
 * Fetches a paginated list of Pokemon with optional filtering
 */
export async function fetchPokemonList(
  params: PokemonFilterParams = {}
): Promise<PaginatedResponse<PokemonDetails>> {
  const { page = 1, ...filterParams } = params;
  const queryParams = buildQueryParams({ page, ...filterParams });
  
  return apiRequest<PaginatedResponse<PokemonDetails>>(
    `/pokemon/?${queryParams.toString()}`
  );
}

/**
 * Fetches detailed information for a specific Pokemon
 */
export async function fetchPokemonDetails(id: string | number): Promise<PokemonDetails> {
  return apiRequest<PokemonDetails>(`/pokemon/${id}/`);
}

/**
 * Creates a new Pokemon
 */
export async function createPokemon(pokemonData: CreatePokemonData): Promise<PokemonDetails> {
  return apiRequest<PokemonDetails>('/pokemon/', {
    method: 'POST',
    body: JSON.stringify(pokemonData),
  });
}

/**
 * Updates an existing Pokemon
 */
export async function updatePokemon(
  id: string | number,
  pokemonData: UpdatePokemonData
): Promise<PokemonDetails> {
  return apiRequest<PokemonDetails>(`/pokemon/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(pokemonData),
  });
}

/**
 * Deletes a Pokemon (if supported by API)
 */
export async function deletePokemon(id: string | number): Promise<void> {
  return apiRequest<void>(`/pokemon/${id}/`, {
    method: 'DELETE',
  });
}

// ===== MOVES API FUNCTIONS =====

/**
 * Fetches a paginated list of moves with optional filtering
 */
export async function fetchMovesList(
  params: MoveFilterParams = {}
): Promise<PaginatedResponse<Move>> {
  const { page = 1, ...filterParams } = params;
  const queryParams = buildQueryParams({ page, ...filterParams });
  
  return apiRequest<PaginatedResponse<Move>>(
    `/moves/?${queryParams.toString()}`
  );
}

/**
 * Fetches all moves by handling pagination internally
 */
export async function fetchAllMoves(): Promise<Move[]> {
  const allMoves: Move[] = [];
  let nextPage: number | null = 1;
  
  while (nextPage !== null) {
    const response = await fetchMovesList({ page: nextPage });
    allMoves.push(...response.results);
    
    // Check if there's a next page
    nextPage = response.next ? nextPage + 1 : null;
  }
  
  return allMoves;
}

/**
 * Fetches detailed information for a specific move
 */
export async function fetchMoveDetails(id: string | number): Promise<Move> {
  return apiRequest<Move>(`/moves/${id}/`);
}