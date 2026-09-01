import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVersionedData } from '../../hooks/useVersionedData';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { scrollIntoView } from '../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../utils/localStorage';
import Feat from './Feat';
import Feat2024 from '../2024/feats/Feat2024';
import Feat2024Filter from '../2024/feats/Feat2024Filter';


function Feats() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { ruleVersion } = useRuleVersion();

    // Derive shownCard from URL params (normalize spaces to hyphens to match card indices)
    const shownCard = (searchParams.get('index') || '').replace(/[\s+]/g, '-');

    // Filter state for 2024 feats
    const [filter, setFilter] = useState(() => {
        if (ruleVersion !== '2024') return { name: '' };
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.FEAT_FILTER);
        if (savedFilter) {
            const defaultFilter = { name: '', type: 'All', repeatable: 'All', minLevel: 0, abilityScore: 'All' };
            return sanitizeFilter(defaultFilter, savedFilter);
        }
        return { name: '', type: 'All', repeatable: 'All', minLevel: 0, abilityScore: 'All' };
    });

    // Scroll to shown card when it changes
    useEffect(() => {
        if (shownCard) {
            requestAnimationFrame(() => scrollIntoView(shownCard));
        }
    }, [shownCard]);

    // Initialize localStorage filter on mount for 2024
    useEffect(() => {
        if (ruleVersion === '2024') {
            const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.FEAT_FILTER);
            if (!savedFilter) {
                setLocalStorageItem(LOCAL_STORAGE_KEYS.FEAT_FILTER, filter);
            }
        }
    }, []);

    // Fetch versioned data
    const { data: featsData, loading: featsLoading } = useVersionedData('feats');

    const expandCard = (key, expanded) => {
        if (expanded) {
            setSearchParams({ index: key });
        } else {
            setSearchParams({});
        }
    };

    const filterFeats = (feat) => {
        if (ruleVersion !== '2024') return true;

        if (filter.name && !feat.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }
        if (filter.type !== 'All' && feat.type !== filter.type) {
            return false;
        }
        if (filter.repeatable === 'Yes' && !feat.repeatable) {
            return false;
        }
        if (filter.repeatable === 'No' && feat.repeatable) {
            return false;
        }
        const minLevel = filter.minLevel || 0;
        if (feat.prerequisites?.level && feat.prerequisites.level < minLevel) {
            return false;
        }
        if (filter.abilityScore !== 'All') {
            if (!feat.prerequisites?.ability_scores) return false;
            const hasAbility = feat.prerequisites.ability_scores.some(
                abs => abs.name === filter.abilityScore
            );
            if (!hasAbility) return false;
        }

        return true;
    };

    if (featsLoading) {
        return <div className="list"><div>Loading feats...</div></div>;
    }

    const filteredFeats = featsData ? featsData.filter(filterFeats) : [];
    const is2024 = ruleVersion === '2024';

    return (
        <div className="list">
            {is2024 && (
                <Feat2024Filter
                    filter={filter}
                    onFilterChange={(newFilter) => {
                        setFilter(newFilter);
                        setLocalStorageItem(LOCAL_STORAGE_KEYS.FEAT_FILTER, newFilter);
                    }}
                />
            )}
            {!is2024 && (
                <div className="page-header">
                    <h1 className="card-title">Feats</h1>
                    <div className="page-description">Feats are special features not tied to a character class. A feat represents a talent or an area of expertise that gives a character special capabilities. It embodies training, experience, and abilities beyond what a class provides. The sections below explain the parts of a feat and list a variety of feat options separated into categories. Your background gives you a feat, and at certain levels, your class gives you the Ability Score lmprovement feat or the choice of another feat for which you qualify. By whatever means you acquire a feat, you can take it only once unless its description says otherwise.</div>
                </div>
            )}
            {is2024 ? (
                filteredFeats.map((feat) => (
                    <div key={feat.name} id={feat.name}>
                        <Feat2024
                            feat={feat}
                            expand={shownCard === feat.name}
                            onExpand={(expanded) => expandCard(feat.name, expanded)}
                        />
                    </div>
                ))
            ) : (
                filteredFeats.map((feat) => (
                    <div key={feat.index} id={feat.index}>
                        <Feat
                            feat={feat}
                            expand={shownCard === feat.index}
                            onExpand={(expanded) => expandCard(feat.index, expanded)}
                        />
                    </div>
                ))
            )}
        </div>
    );
}

export default Feats;
