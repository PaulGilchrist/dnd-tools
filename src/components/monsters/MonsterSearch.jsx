import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMonsters } from '../../data/dataService';
import Monster from './Monster';
import { useMonsterFilter } from '../../hooks/useMonsterFilter';
import { useMonsterBookmarks } from '../../hooks/useMonsterBookmarks';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';
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
    const { filter, updateFilter, showMonster } = useMonsterFilter();
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
            const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_FILTER_5E);
            if (savedFilter) {
                     // Filter already has defaults from hook, just need to update if saved exists
                } else {
                setLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_FILTER_5E, filter);
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

    const filteredMonsters = (updateMonstersWithBookmarks(monstersData) || []).filter(showMonster);

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
