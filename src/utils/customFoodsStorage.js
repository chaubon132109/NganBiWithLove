import { FOODS_DATA } from '../data/foodsData';

const STORAGE_KEY = 'nganbi_custom_ai_foods';
export const CUSTOM_FOODS_EVENT = 'nganbi_custom_foods_changed';

/**
 * Generate a clean URL-friendly slug from Vietnamese text
 */
export function toFoodSlug(name) {
  if (!name) return `ai-food-${Date.now()}`;
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `ai-${slug}` : `ai-food-${Date.now()}`;
}

/**
 * Get all user-added / AI-discovered foods from localStorage
 */
export function getStoredCustomFoods() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading custom foods from localStorage:', err);
    return [];
  }
}

/**
 * Save a new or updated AI-analyzed food into localStorage
 */
export function saveCustomFood(newFood) {
  if (!newFood || !newFood.name) return null;

  try {
    const currentList = getStoredCustomFoods();
    const slugId = newFood.id && !newFood.id.startsWith('slug-') 
      ? newFood.id 
      : toFoodSlug(newFood.name);

    const formatted = {
      ...newFood,
      id: slugId,
      isAiAnalyzed: true,
      addedAt: newFood.addedAt || new Date().toISOString()
    };

    // Remove any existing item with the same id or normalized name
    const filtered = currentList.filter(item => 
      item.id !== formatted.id && 
      item.name.trim().toLowerCase() !== formatted.name.trim().toLowerCase()
    );

    // Prepend the new food item
    const updated = [formatted, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch global event for reactive UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CUSTOM_FOODS_EVENT, { detail: { food: formatted } }));
    }

    return formatted;
  } catch (err) {
    console.error('Error saving custom food to localStorage:', err);
    return newFood;
  }
}

/**
 * Delete a custom food item by ID
 */
export function deleteCustomFood(foodId) {
  try {
    const currentList = getStoredCustomFoods();
    const updated = currentList.filter(item => item.id !== foodId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CUSTOM_FOODS_EVENT, { detail: { deletedId: foodId } }));
    }
    return true;
  } catch (err) {
    console.error('Error deleting custom food:', err);
    return false;
  }
}

/**
 * Returns all foods (Custom AI Foods + Built-in Foods)
 */
export function getAllFoodsList() {
  const custom = getStoredCustomFoods();
  return [...custom, ...FOODS_DATA];
}
