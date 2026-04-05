import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMonsters } from '../../data/dataService';
import Monster from './Monster';
import { useMonsterFilter } from '../../hooks/useMonsterFilter';
import { useMonsterBookmarks } from '../../hooks/useMonsterBookmarks';
import FilterForm from './FilterForm';
import FilterControls from './FilterControls';
import MonsterList from './MonsterList';
import Loading from './Loading';

function MonsterSearch() {
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: monstersData, loading: monstersLoading } = useMonsters();

    // Use custom hooks for filter and bookmark logic
    const { filter, updateFilter } = useMonsterFilter();
    const { updateMonstersWithBookmarks, handleBookmarkChange } = useMonsterBookmarks();

    useEffect(() => {
        if (monstersData && monstersData.length > 0) {
            const updatedMonsters = updateMonstersWithBookmarks(monstersData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const monster = updatedMonsters.find((monster) => monster.index === index);
                if (monster) {
                    setShownCard(index);
                    // Get the DOM element by ID and scroll it into view
            const element = document.getElementById(index);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
            }

            // Set search filters from localStorage, only defaulting to "All" when there's no saved data
            const savedFilter = localStorage.getItem('monsterFilter');
            if (savedFilter) {
                // Filter already has defaults from hook, just need to update if saved exists
            } else {
                localStorage.setItem('monsterFilter', JSON.stringify(filter));
            }

            console.log(`${updatedMonsters.length} monsters`);
        }
    }, [monstersData, updateMonstersWithBookmarks]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            const element = document.getElementById(index);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

            // Update URL query params using setSearchParams
            if (expanded) {
                setSearchParams({ index });
            } else {
                setSearchParams({});
        }
        }

        // Update URL query params using setSearchParams
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    if (monstersLoading) {
        return <Loading />;
    }

    const filteredMonsters = updateMonstersWithBookmarks(monstersData).filter((monster) => {
        // Bookmarked filter
        if (filter.bookmarked !== 'All' && !monster.bookmarked) {
            return false;
        }
        // Challenge Range
        if (monster.challenge_rating < filter.challengeRatingMin || monster.challenge_rating > filter.challengeRatingMax) {
            return false;
        }
        // Environment filter
        if (filter.environment !== 'All' && (!monster.environments || !monster.environments.includes(filter.environment))) {
            return false;
        }
        // Name filter
        if (filter.name !== '' && !monster.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }
        // Size filter
        if (filter.size !== 'All' && filter.size !== monster.size) {
            return false;
        }
        // Type filter
        if (filter.type !== 'All' && filter.type !== monster.type) {
            return false;
        }
        // XP
        if (monster.xp < filter.xpMin || monster.xp > filter.xpMax) {
            return false;
        }
        return true;
    });

    return (
        <>
            <FilterForm>
                <FilterControls filter={filter} updateFilter={updateFilter} />
            </FilterForm>

            <MonsterList
                monsters={filteredMonsters}
                shownCard={shownCard}
                expandCard={expandCard}
                handleBookmarkChange={handleBookmarkChange}
            />
        </>
    );
}

export default MonsterSearch;

