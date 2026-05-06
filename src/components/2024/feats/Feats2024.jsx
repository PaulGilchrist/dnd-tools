import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { use2024Feats } from '../../../data/dataService';
import Feat2024 from './Feat2024';
import Feat2024Filter from './Feat2024Filter';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../../utils/localStorage';
import { scrollIntoView } from '../../../data/utils';

function Feats2024() {
    const [feats, setFeats] = useState([]);
    const [filter, setFilter] = useState({
        name: '',
        type: 'All',
        repeatable: 'All',
        minLevel: 0,
        abilityScore: 'All'
    });
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: featsData, loading: featsLoading } = use2024Feats();

    useEffect(() => {
        if (featsData && featsData.length > 0) {
            setFeats(featsData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const feat = featsData.find(feat => feat.name === index);
                if (feat) {
                    setShownCard(index);
                    scrollIntoView(index);
                      }
                  } else {
                      // Set search filters from localStorage
                const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.FEAT_FILTER_2024);
                if (savedFilter) {
                    setFilter(savedFilter);
                      } else {
                    setLocalStorageItem(LOCAL_STORAGE_KEYS.FEAT_FILTER_2024, filter);
                      }
                  }
            }
               }, [featsData, searchParams]);

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

    const filterChanged = (newFilter) => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.FEAT_FILTER_2024, newFilter);
             };

    const filterFeats = (feat) => {
        // Name filter
        if (filter.name && !feat.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }

        // Type filter
        if (filter.type !== 'All' && feat.type !== filter.type) {
            return false;
        }

        // Repeatable filter
        if (filter.repeatable === 'Yes' && !feat.repeatable) {
            return false;
        }
        if (filter.repeatable === 'No' && feat.repeatable) {
            return false;
        }

        // Minimum level filter
        const minLevel = filter.minLevel || 0;
        if (feat.prerequisites?.level && feat.prerequisites.level < minLevel) {
            return false;
        }

        // Ability score filter
        if (filter.abilityScore !== 'All') {
            if (!feat.prerequisites?.ability_scores) {
                return false;
            }
            const hasAbility = feat.prerequisites.ability_scores.some(
                abs => abs.name === filter.abilityScore
            );
            if (!hasAbility) {
                return false;
        }
              }

        return true;
    };

    if (featsLoading) {
        return <div className="list"><div>Loading 2024 feats...</div></div>;
    }

    const filteredFeats = feats.filter(filterFeats);

    return (
              <div className="feats-2024">
                  <Feat2024Filter 
                filter={filter} 
                onFilterChange={(newFilter) => { 
                    setFilter(newFilter); 
                    filterChanged(newFilter); 
                  }} 
                  />
                 
                  {/* Feats List */}
                  <div className="list">
                      {filteredFeats.map((feat) => (
                          <div key={feat.name} id={feat.name}>
                              {filterFeats(feat) && (
                                  <Feat2024
                                    feat={feat}
                                    expand={shownCard === feat.name}
                                    onExpand={(expanded) => expandCard(feat.name, expanded)}
                                  />
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          );
}

export default Feats2024;