import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVersionedData } from '../../hooks/useVersionedData';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { scrollIntoView } from '../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, getVersionedStorageKey } from '../../utils/localStorage';
import RaceItem from './RaceItem';
import RaceItem2024 from '../2024/rules/races/RaceItem2024';

function Races() {
    // Derive shownCard from URL params to avoid setState-in-effect
    const [searchParams, setSearchParams] = useSearchParams();
    const shownCard = searchParams.get('index') || '';
    const { ruleVersion } = useRuleVersion();

    // Fetch versioned data
    const { data: racesData, loading: racesLoading } = useVersionedData('races');

    // Scroll to card when URL index param is present and data is loaded
    useEffect(() => {
        if (racesData && racesData.length > 0 && shownCard) {
            // 2024 uses name as identifier, 5e uses index
            const race = racesData.find(r =>
                ruleVersion === '2024' ? r.name === shownCard : r.index === shownCard
            );
            if (race) {
                scrollIntoView(shownCard);
            }
        }
    }, [racesData, shownCard, ruleVersion]);

    // Initialize filter in localStorage if not already set
    useEffect(() => {
        if (racesData && racesData.length > 0) {
            const storageKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.RACES_FILTER, ruleVersion);
            if (!getLocalStorageItem(storageKey)) {
                setLocalStorageItem(storageKey, { category: 'All' });
            }
        }
    }, [racesData, ruleVersion]);

    // Derive the unique key field for each race based on version
    const getRaceKey = useCallback((race) => {
        return ruleVersion === '2024' ? race.name : race.index;
    }, [ruleVersion]);

    const expandCard = useCallback((key, expanded) => {
        if (expanded) {
            setSearchParams({ index: key });
            scrollIntoView(key);
        } else {
            setSearchParams({});
        }
    }, [setSearchParams]);

    if (racesLoading) {
        return <div className="list"><div>Loading races...</div></div>;
    }

    return (
        <div className="list">
            <div className="page-header">
                <h1 className="card-title">Races</h1>
                <div className="page-description">Choose a race for your character. Each race offers unique traits and abilities that reflect their culture, biology, and heritage.</div>
            </div>
            {racesData?.map((race) => {
                const key = getRaceKey(race);
                return (
                    <div key={key} id={key}>
                        {ruleVersion === '2024' ? (
                            <RaceItem2024
                                race={race}
                                expand={shownCard === key}
                                onExpand={(expanded) => expandCard(key, expanded)}
                            />
                        ) : (
                            <RaceItem
                                race={race}
                                expand={shownCard === key}
                                onExpand={(expanded) => expandCard(key, expanded)}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Races;
