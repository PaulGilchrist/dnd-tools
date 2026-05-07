import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Monsters } from '../../../data/dataService';
import Monster2024 from './Monster2024';
import Monster2024List from './Monster2024List';
import FilterForm from './Monster2024FilterForm';
import FilterControls from './Monster2024FilterControls';
import Loading from './Monster2024Loading';
import { scrollIntoView } from '../../../data/utils';
import { useMonsterFilter } from '../../../hooks/useMonsterFilter';

/**
 * Monster2024Search component - Main search and filter page for 2024 monsters
 */
function Monster2024Search() {
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: monstersData, loading: monstersLoading } = use2024Monsters();

    // Use custom hook for filter state, persistence, and showMonster predicate
    const { filter, updateFilter, showMonster } = useMonsterFilter({ ruleVersion: '2024' });

    const handleUrlIndex = (data, params) => {
        if (data && data.length > 0) {
            const updatedMonsters = data.map(monster => ({
                ...monster,
                bookmarked: monster.bookmarked || false
            }));

            // Check for index parameter in URL
            const index = params.get('index');
            if (index) {
                const monster = updatedMonsters.find((monster) => monster.index === index);
                if (monster) {
                    setShownCard(index);
                    // Scroll after state update completes
                    requestAnimationFrame(() => scrollIntoView(index));
                }
            }
        }
    };

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            requestAnimationFrame(() => scrollIntoView(index));
        } else {
            setShownCard('');
        }

        // Update URL query params using setSearchParams
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    const handleBookmarkChange = () => {
        // Update local state immediately so UI reflects the change
        // This would typically use a hook, but for now we'll update the filter state
    };

    // Process URL index when data is available
    useEffect(() => {
        handleUrlIndex(monstersData, searchParams);
    }, [monstersData, searchParams]);

    if (monstersLoading) {
        return <Loading />;
    }

    const filteredMonsters = (monstersData || []).filter(showMonster);

    return (
        <>
            <FilterForm>
                <FilterControls filter={filter} updateFilter={updateFilter} />
            </FilterForm>

            <Monster2024List
                monsters={filteredMonsters}
                shownCard={shownCard}
                expandCard={expandCard}
                handleBookmarkChange={handleBookmarkChange}
            />
        </>
    );
}

export default Monster2024Search;
