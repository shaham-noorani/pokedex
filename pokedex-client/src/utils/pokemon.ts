import { TYPE_COLORS, CATEGORY_COLORS } from '@/constants/pokemon';

// ===== URL VALIDATION =====
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// ===== FORMATTING UTILITIES =====
export const formatNumber = (num: number, decimals = 1): string => {
  return (Math.floor(num * Math.pow(10, decimals)) / Math.pow(10, decimals)).toString();
};

// ===== COLOR UTILITIES =====
export const getTypeColor = (type: string): string => {
  return TYPE_COLORS[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// ===== CSS CLASS UTILITIES =====
export const getInputClassName = (hasError: boolean): string => 
  `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;

export const getStatInputClassName = (hasError: boolean, color: string): string => 
  `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;