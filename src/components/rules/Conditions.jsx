import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConditions } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import ConditionItem from './ConditionItem';

function Conditions() {
    const { ruleVersion } = useRuleVersion();
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: conditionsData, loading: conditionsLoading } = useConditions();

    const handleUrlIndex = (data, params) => {
        if (data && data.length > 0) {
            // Check for index parameter in URL
            const index = params.get('index');
            if (index) {
                const condition = data.find(condition => condition.index === index);
                if (condition) {
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

    // Process URL index when data is available
    useEffect(() => {
        handleUrlIndex(conditionsData, searchParams);
    }, [conditionsData, searchParams]);

    if (conditionsLoading) {
        return <div className="list"><div>Loading conditions...</div></div>;
    }

    return (
                    <div className="list">
                        <div className="page-header">
                            <h1 className="card-title">Conditions</h1>
                            <div className="page-description">A condition is a tempotary game state. The definition of a condition says how it affects its recipient, and various rules define how to end a condition. A condition doesn&apos;t stack with itself; a recipient either has a condition or doesn&apos;t. The Exhaustion condition is an exception to that rule.</div>
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
