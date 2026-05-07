// Get the base URL from Vite's environment variables (set by vite.config.js)
// Using lazy evaluation to avoid issues in test environments
export function getBaseUrl() {
    if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
        return import.meta.env.BASE_URL;
    }
    return '';
}

// Import the cache objects for __clearCache
import { dataCache, loadingPromises } from './dataServiceCore.js';

// Helper function to sort array of objects by property name
export function sort(inputObjectArray, propertyName, descending = false) {
    if (inputObjectArray && propertyName) {
        inputObjectArray.sort((a, b) => {
            const aValue = a[propertyName];
            const bValue = b[propertyName];
            if (aValue < bValue) {
                return descending ? 1 : -1;
            }
            if (bValue < aValue) {
                return descending ? -1 : 1;
            }
            return 0;
          });
      }
}

// Error handler function
export function handleError(error) {
    console.error(error);
    throw error;
}

// Clear cache helper for testing
export function __clearCache() {
    Object.keys(dataCache).forEach(key => delete dataCache[key]);
    Object.keys(loadingPromises).forEach(key => delete loadingPromises[key]);
}
