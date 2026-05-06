import { useState } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

export function useMonsterBookmarks(monsters = []) {
    const [monstersBookmarked, setMonstersBookmarked] = useState(() => {
        return getLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTERS_BOOKMARKED) || [];
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
        // Update local state immediately so UI reflects the change
        setMonstersBookmarked(prevBookmarks => {
            if (isBookmarked) {
                return [...prevBookmarks, index];
            } else {
                return prevBookmarks.filter(i => i !== index);
             }
         });

        // Save to localStorage
        const newBookmarks = isBookmarked 
             ? [...monstersBookmarked, index]
             : monstersBookmarked.filter(i => i !== index);

        setLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTERS_BOOKMARKED, newBookmarks);
     };

    const saveBookmark = () => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTERS_BOOKMARKED, monstersBookmarked);
     };

    return {
        monstersBookmarked,
        updateMonstersWithBookmarks,
        handleBookmarkChange,
        saveBookmark
    };
}
