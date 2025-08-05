import type { CreatePokemonData } from '@/api/pokemon';
import { STAT_CONFIG, STAT_LIMITS } from '@/constants/pokemon';
import { isValidUrl } from '@/utils/pokemon';

// ===== TYPES =====
export type FormErrors = Partial<Record<keyof CreatePokemonData, string>>;

// ===== FORM VALIDATION =====
export const validateForm = (formData: CreatePokemonData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Pokemon name is required';
  }

  // Sprite validation
  if (!formData.sprite.trim()) {
    errors.sprite = 'Sprite URL is required';
  } else if (!isValidUrl(formData.sprite)) {
    errors.sprite = 'Please enter a valid URL';
  }

  // Type validation
  if (!formData.type_1) {
    errors.type_1 = 'Primary type is required';
  }

  // Physical stats validation
  if (formData.height <= 0) {
    errors.height = 'Height must be greater than 0';
  }

  if (formData.weight <= 0) {
    errors.weight = 'Weight must be greater than 0';
  }

  // Battle stats validation
  STAT_CONFIG.forEach(({ key }) => {
    const value = formData[key];
    if (value < STAT_LIMITS.MIN || value > STAT_LIMITS.MAX) {
      errors[key] = `${key.toUpperCase()} must be between ${STAT_LIMITS.MIN} and ${STAT_LIMITS.MAX}`;
    }
  });

  return errors;
};