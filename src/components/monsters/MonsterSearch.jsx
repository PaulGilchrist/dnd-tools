import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Monster from './Monster';
import { useMonsterFilter } from '../../hooks/useMonsterFilter';
import { useMonsterBookmarks } from '../../hooks/useMonsterBookmarks';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { useVersionedData } from '../../hooks/useVersionedData';
import FilterForm from './FilterForm';
import FilterControls from './FilterControls';
import MonsterList from './MonsterList';
import Monster2024List from '../2024/monsters/Monster2024List';
import Monster2024FilterForm from '../2024/monsters/Monster2024FilterForm';
import Monster2024FilterControls from '../2024/monsters/Monster2024FilterControls';
import Loading from './Loading';

function MonsterSearch() {
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { ruleVersion } = useRuleVersion();

    // Fetch data using version-aware hook
    const { data: monstersData, loading: monstersLoading } = useVersionedData('monsters');

    // Use custom hooks for filter and bookmark logic (pass ruleVersion for versioned localStorage)
    const { filter, updateFilter, showMonster } = useMonsterFilter({ ruleVersion });
    const { updateMonstersWithBookmarks, handleBookmarkChange } = useMonsterBookmarks({ ruleVersion });

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
        }
    }, [monstersData, searchParams, updateMonstersWithBookmarks]);

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

    const filteredMonsters = updateMonstersWithBookmarks(monstersData).filter(showMonster);

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
