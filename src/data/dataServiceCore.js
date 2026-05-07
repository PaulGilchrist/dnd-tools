// Cache for storing loaded data to avoid repeated fetches
export const dataCache = {};

// Track which datasets have been loaded (even if still loading)
export const loadingPromises = {};

// Import the utility function for sorting names
import { sort } from './dataServiceUtils.js';
// Import the base URL helper
import { getBaseUrl } from './dataServiceUtils.js';

// Fetch data with caching - never re-fetches once loaded or loading
export async function fetchAndCache(key, url) {
    // Return cached data if already loaded
    if (dataCache[key]) {
        return dataCache[key];
    }

    // Reuse existing in-flight request if loading
    if (loadingPromises[key]) {
        return loadingPromises[key];
    }

    // Create new fetch promise and cache it
    const promise = (async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();

            // Special handling for names - sort by name
            if (key === 'names') {
                sort(jsonData, 'name');
            }

            dataCache[key] = jsonData;
            return jsonData;
        } finally {
            // Clean up the promise reference after completion
            delete loadingPromises[key];
        }
    })();

    loadingPromises[key] = promise;
    return promise;
}
