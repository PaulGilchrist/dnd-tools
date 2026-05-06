import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useConditions } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import ConditionItem from './ConditionItem';

function Conditions() {
    const { ruleVersion } = useRuleVersion();
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: conditionsData, loading: conditionsLoading } = useConditions();

    useEffect(() => {
        if (conditionsData && conditionsData.length > 0) {
            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const condition = conditionsData.find(condition => condition.index === index);
                if (condition) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            } else {
                // No filter needed for conditions - just display all
            }
        }
    }, [conditionsData, searchParams]);

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

    if (conditionsLoading) {
        return <div className="list"><div>Loading conditions...</div></div>;
    }

    return (
                    <div className="list">
                        <div className="page-header">
                            <h1 className="card-title">Conditions</h1>
                            <div className="page-description">A condition is a tempotrary game state. The definition of a condition says how it affects its recipient, and various rules define how to end a condition. A condition doesn't stack with itself; a recipient either has a condition or doesn't. The Exhaustion condition is an exception to that rule.</div>
                        </div>
                        {conditionsData?.map((condition) => {
                            // Filter conditions based on ruleVersion
                            // If condition has a rules property, only show if it matches the current ruleVersion
                            // Otherwise, show the condition (default to 5e behavior)
                          if (condition.rules && condition.rules !== ruleVersion) {
                              return null;
                           }
                          return (
                                <div key={condition.index} id={condition.index}>
                                    <ConditionItem 
                                      condition={condition}
                                      expand={shownCard === condition.index}
                                      onExpand={(expanded) => expandCard(condition.index, expanded)}
                                      ruleVersion={ruleVersion}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
}

export default Conditions;
