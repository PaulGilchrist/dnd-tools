import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { use2024Monsters } from '../../../data/dataService';
import Monster2024 from './Monster2024';
import Monster2024List from './Monster2024List';
import FilterForm from './Monster2024FilterForm';
import FilterControls from './Monster2024FilterControls';
import Loading from './Monster2024Loading';
import { scrollIntoView } from '../../../data/utils';

/**
 * Monster2024Search component - Main search and filter page for 2024 monsters
 */
function Monster2024Search() {
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: monstersData, loading: monstersLoading } = use2024Monsters();

    // Filter state
    const [filter, setFilter] = useState({
        bookmarked: 'All',
        challengeRatingMin: 0,
        challengeRatingMax: 25,
        name: '',
        size: 'All',
        type: 'All',
        xpMin: 0,
        xpMax: 50000
    });

    useEffect(() => {
        if (monstersData && monstersData.length > 0) {
            const updatedMonsters = monstersData.map(monster => ({
                ...monster,
                bookmarked: monster.bookmarked || false
            }));

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const monster = updatedMonsters.find((monster) => monster.index === index);
                if (monster) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            }

            // Set search filters from localStorage
            const savedFilter = localStorage.getItem('monsterFilter2024');
            if (savedFilter) {
                setFilter(JSON.parse(savedFilter));
            } else {
                localStorage.setItem('monsterFilter2024', JSON.stringify(filter));
            }

            console.log(`${updatedMonsters.length} 2024 monsters`);
        }
    }, [monstersData, searchParams]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            scrollIntoView(index);
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

    const handleBookmarkChange = (index, isBookmarked) => {
        // Update local state immediately so UI reflects the change
        // This would typically use a hook, but for now we'll update the filter state
    };

    if (monstersLoading) {
        return <Loading />;
    }

    const filteredMonsters = (monstersData || []).filter((monster) => {
        // Bookmarked filter
        if (filter.bookmarked !== 'All' && !monster.bookmarked) {
            return false;
        }
        // Challenge Range
        if (monster.challenge_rating < filter.challengeRatingMin || monster.challenge_rating > filter.challengeRatingMax) {
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
                <FilterControls filter={filter} updateFilter={setFilter} />
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