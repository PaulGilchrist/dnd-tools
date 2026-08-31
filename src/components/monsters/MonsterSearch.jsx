import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMonsterFilter } from '../../hooks/useMonsterFilter';
import { useMonsterBookmarks } from '../../hooks/useMonsterBookmarks';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { useMonsters } from '../../data/dataServiceHooks';
import { use2024Monsters } from '../../data/dataServiceHooks';
import FilterForm from './FilterForm';
import FilterControls from './FilterControls';
import MonsterList from './MonsterList';
import Monster2024List from '../2024/monsters/Monster2024List';
import Monster2024FilterForm from '../2024/monsters/Monster2024FilterForm';
import Monster2024FilterControls from '../2024/monsters/Monster2024FilterControls';
import Loading from './Loading';

function MonsterSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { ruleVersion } = useRuleVersion();

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

    // Fetch both 5e and 2024 monsters
    const { data: monstersData, loading: monstersLoading } = useMonsters();
    const { data: monsters2024Data, loading: monsters2024Loading } = use2024Monsters();

    // Use custom hooks for filter and bookmark logic (pass ruleVersion for versioned localStorage)
    const { filter, updateFilter, showMonster } = useMonsterFilter({ ruleVersion });
    const { updateMonstersWithBookmarks, handleBookmarkChange } = useMonsterBookmarks({ ruleVersion });

    const expandCard = (index, expanded) => {
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    const isLoading = monstersLoading || monsters2024Loading;

    if (isLoading) {
        return <Loading />;
    }

    const allMonsters = [...(monstersData || []), ...(monsters2024Data || [])];
    const seen = new Set();
    const uniqueMonsters = allMonsters.filter((monster) => {
        if (seen.has(monster.index)) return false;
        seen.add(monster.index);
        return true;
    });
    const filteredMonsters = updateMonstersWithBookmarks(uniqueMonsters).filter(showMonster);

    return (
            <>
            {ruleVersion === '2024' ? (
                <Monster2024FilterForm>
                    <Monster2024FilterControls filter={filter} updateFilter={updateFilter} />
                </Monster2024FilterForm>
            ) : (
                <FilterForm>
                    <FilterControls filter={filter} updateFilter={updateFilter} />
                </FilterForm>
            )}

            {ruleVersion === '2024' ? (
                <Monster2024List
                    monsters={filteredMonsters}
                    shownCard={shownCard}
                    expandCard={expandCard}
                    handleBookmarkChange={handleBookmarkChange}
                />
            ) : (
                <MonsterList
                    monsters={filteredMonsters}
                    shownCard={shownCard}
                    expandCard={expandCard}
                    handleBookmarkChange={handleBookmarkChange}
                />
            )}
            </>
        );
}

export default MonsterSearch;
