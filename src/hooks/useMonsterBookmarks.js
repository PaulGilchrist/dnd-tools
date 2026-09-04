import { useState } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

export function useMonsterBookmarks() {
    const bookmarkedKey = LOCAL_STORAGE_KEYS.MONSTERS_BOOKMARKED;

    const [monstersBookmarked, setMonstersBookmarked] = useState(() => {
        return getLocalStorageItem(bookmarkedKey) || [];
    });

    // Update monsters with bookmarked status when monsters data changes
    const updateMonstersWithBookmarks = (monstersData) => {
        if (!monstersData || monstersData.length === 0) return [];

        const updatedMonsters = monstersData.map(monster => ({
            ...monster,
            bookmarked: monstersBookmarked.includes(monster.index)
        }));

        return updatedMonsters;
    };

    const handleBookmarkChange = (index, isBookmarked) => {
        // Compute new array inline to avoid stale closure, then use for both state and localStorage
        const newBookmarks = isBookmarked
            ? [...monstersBookmarked, index]
            : monstersBookmarked.filter(i => i !== index);

        setLocalStorageItem(bookmarkedKey, newBookmarks);
        setMonstersBookmarked(newBookmarks);
    };

    const saveBookmark = () => {
        setLocalStorageItem(bookmarkedKey, monstersBookmarked);
    };

    return {
        monstersBookmarked,
        updateMonstersWithBookmarks,
        handleBookmarkChange,
        saveBookmark
    };
}
