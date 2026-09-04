import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMonsterFilter } from '../../hooks/useMonsterFilter';
import { useMonsterBookmarks } from '../../hooks/useMonsterBookmarks';
import { useMonsters } from '../../data/dataServiceHooks';
import Monster2024List from '../2024/monsters/Monster2024List';
import Monster2024FilterForm from '../2024/monsters/Monster2024FilterForm';
import Monster2024FilterControls from '../2024/monsters/Monster2024FilterControls';
import Loading from './Loading';

function MonsterSearch() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive shownCard from URL params (normalize spaces to hyphens to match card indices)
    const shownCard = (searchParams.get('index') || '').replace(/[\s+]/g, '-');

    // Scroll to shown card when it changes
    useEffect(() => {
        if (shownCard) {
            requestAnimationFrame(() => {
                const element = document.getElementById(shownCard);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
    }, [shownCard]);

    // Fetch the consolidated monster list
    const { data: monstersData, loading: monstersLoading } = useMonsters();

    // Use custom hooks for filter and bookmark logic
    const { filter, updateFilter, showMonster } = useMonsterFilter();
    const { updateMonstersWithBookmarks, handleBookmarkChange } = useMonsterBookmarks();

    const expandCard = (index, expanded) => {
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    if (monstersLoading) {
        return <Loading />;
    }

    const filteredMonsters = updateMonstersWithBookmarks(monstersData || []).filter(showMonster);

    return (
            <>
            <Monster2024FilterForm>
                <Monster2024FilterControls filter={filter} updateFilter={updateFilter} />
            </Monster2024FilterForm>

            <Monster2024List
                monsters={filteredMonsters}
                shownCard={shownCard}
                expandCard={expandCard}
                handleBookmarkChange={handleBookmarkChange}
            />
            </>
        );
}

export default MonsterSearch;
