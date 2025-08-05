import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPokemon, type CreatePokemonData, type Move } from '@/api/pokemon';
import MoveSelector from '@/components/MoveSelector';
import { POKEMON_TYPES, STAT_CONFIG, STAT_LIMITS, FALLBACK_SPRITE } from '@/constants/pokemon';
import { isValidUrl, getInputClassName, getStatInputClassName } from '@/utils/pokemon';
import { validateForm, type FormErrors } from '@/utils/validation';



// ===== SUB-COMPONENTS =====
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required = false, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface TextInputProps {
  id: string;
  type?: 'text' | 'url' | 'number';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  min?: string;
  max?: string;
  step?: string;
}

function TextInput({ id, type = 'text', value, onChange, placeholder, error, ...props }: TextInputProps) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => {
        const newValue = type === 'number' 
          ? (parseFloat(e.target.value) || 0)
          : e.target.value;
        onChange(newValue);
      }}
      className={getInputClassName(!!error)}
      placeholder={placeholder}
      {...props}
    />
  );
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string | null) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  allowEmpty?: boolean;
}

function Select({ id, value, onChange, options, placeholder, error, allowEmpty = false }: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value || (allowEmpty ? null : ''))}
      className={getInputClassName(!!error)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface StatInputProps {
  stat: typeof STAT_CONFIG[number];
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

function StatInput({ stat, value, onChange, error }: StatInputProps) {
  return (
    <FormField 
      label={stat.label} 
      required 
      error={error}
    >
      <input
        type="number"
        id={stat.key}
        min={STAT_LIMITS.MIN}
        max={STAT_LIMITS.MAX}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || STAT_LIMITS.MIN)}
        className={getStatInputClassName(!!error, stat.color)}
      />
    </FormField>
  );
}

interface PokemonPreviewProps {
  formData: CreatePokemonData;
  selectedMoves: Move[];
}

function PokemonPreview({ formData, selectedMoves }: PokemonPreviewProps) {
  if (!formData.sprite || !isValidUrl(formData.sprite)) return null;

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <img 
          src={formData.sprite} 
          alt={formData.name || 'Pokemon preview'} 
          className="w-24 h-24 object-contain bg-white rounded border"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_SPRITE;
          }}
        />
        <div>
          <h4 className="text-xl font-semibold capitalize text-gray-800">
            {formData.name || 'New Pokemon'}
          </h4>
          <div className="mb-2">
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
          </div>
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
  );
}

// ===== MAIN COMPONENT =====
function AddPokemon() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State management
  const [formData, setFormData] = useState<CreatePokemonData>({
    name: '',
    sprite: '',
    type_1: '',
    type_2: null,
    height: 0,
    weight: 0,
    hp: STAT_LIMITS.MIN,
    attack: STAT_LIMITS.MIN,
    defense: STAT_LIMITS.MIN,
    sp_atk: STAT_LIMITS.MIN,
    sp_def: STAT_LIMITS.MIN,
    speed: STAT_LIMITS.MIN,
    moves: [],
  });

  const [selectedMoves, setSelectedMoves] = useState<Move[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  // API mutation
  const createPokemonMutation = useMutation({
    mutationFn: createPokemon,
    onSuccess: (newPokemon) => {
      queryClient.invalidateQueries({ queryKey: ['pokemon'] });
      navigate(`/pokemon/${newPokemon.id}`);
    },
    onError: (error) => {
      console.error('Failed to create Pokemon:', error);
    },
  });

  // Event handlers
  const handleInputChange = useCallback((field: keyof CreatePokemonData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleMovesChange = useCallback((moves: Move[]) => {
    setSelectedMoves(moves);
    setFormData(prev => ({ ...prev, moves: moves.map(move => move.id) }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      createPokemonMutation.mutate(formData);
    }
  }, [formData, createPokemonMutation]);

  // Prepare options for selects
  const typeOptions = POKEMON_TYPES.map(type => ({ value: type, label: type }));

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline mb-6 inline-block">
          ← Back to Pokédex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Pokemon</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Pokemon Name" required error={errors.name}>
                  <TextInput
                    id="name"
                    value={formData.name}
                    onChange={(value) => handleInputChange('name', value)}
                    placeholder="Enter Pokemon name"
                    error={errors.name}
                  />
                </FormField>

                <FormField label="Sprite URL" required error={errors.sprite}>
                  <TextInput
                    id="sprite"
                    type="url"
                    value={formData.sprite}
                    onChange={(value) => handleInputChange('sprite', value)}
                    placeholder="https://example.com/pokemon-sprite.png"
                    error={errors.sprite}
                  />
                </FormField>
              </div>
            </section>

            {/* Types */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Primary Type" required error={errors.type_1}>
                  <Select
                    id="type_1"
                    value={formData.type_1}
                    onChange={(value) => handleInputChange('type_1', value)}
                    options={typeOptions}
                    placeholder="Select primary type"
                    error={errors.type_1}
                  />
                </FormField>

                <FormField label="Secondary Type" error={errors.type_2}>
                  <Select
                    id="type_2"
                    value={formData.type_2 || ''}
                    onChange={(value) => handleInputChange('type_2', value)}
                    options={typeOptions}
                    placeholder="No secondary type"
                    allowEmpty
                  />
                </FormField>
              </div>
            </section>

            {/* Physical Stats */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Physical Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Height (meters)" required error={errors.height}>
                  <TextInput
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(value) => handleInputChange('height', value)}
                    placeholder="1.5"
                    step="0.1"
                    min="0.1"
                    error={errors.height}
                  />
                </FormField>

                <FormField label="Weight (kg)" required error={errors.weight}>
                  <TextInput
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(value) => handleInputChange('weight', value)}
                    placeholder="25.5"
                    step="0.1"
                    min="0.1"
                    error={errors.weight}
                  />
                </FormField>
              </div>
            </section>

            {/* Battle Stats */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Battle Stats ({STAT_LIMITS.MIN}-{STAT_LIMITS.MAX})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STAT_CONFIG.map(stat => (
                  <StatInput
                    key={stat.key}
                    stat={stat}
                    value={formData[stat.key]}
                    onChange={(value) => handleInputChange(stat.key, value)}
                    error={errors[stat.key]}
                  />
                ))}
              </div>
            </section>

            {/* Move Selection */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Moves</h2>
              <MoveSelector 
                selectedMoves={selectedMoves}
                onMovesChange={handleMovesChange}
                maxMoves={4}
              />
            </section>

            {/* Preview */}
            <PokemonPreview formData={formData} selectedMoves={selectedMoves} />

            {/* Error Display */}
            {createPokemonMutation.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  Error creating Pokemon: {
                    createPokemonMutation.error instanceof Error 
                      ? createPokemonMutation.error.message 
                      : 'Unknown error occurred'
                  }
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={createPokemonMutation.isPending}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {createPokemonMutation.isPending && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                )}
                {createPokemonMutation.isPending ? 'Creating Pokemon...' : 'Create Pokemon'}
              </button>
              <Link
                to="/"
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

export default AddPokemon;