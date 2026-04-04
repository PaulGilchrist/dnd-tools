import { useState, useEffect } from 'react';

export function useMonsterBookmarks(monsters = []) {
    const [monstersBookmarked, setMonstersBookmarked] = useState([]);

    // Load bookmarked monsters from localStorage on mount
    useEffect(() => {
        const monstersBookmarkedJson = localStorage.getItem('monstersBookmarked');
        if (monstersBookmarkedJson) {
            setMonstersBookmarked(JSON.parse(monstersBookmarkedJson));
        }
    }, []);

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

        localStorage.setItem('monstersBookmarked', JSON.stringify(newBookmarks));
    };

    const saveBookmark = () => {
        localStorage.setItem('monstersBookmarked', JSON.stringify(monstersBookmarked));
    };

    return {
        monstersBookmarked,
        updateMonstersWithBookmarks,
        handleBookmarkChange,
        saveBookmark
    };
}
