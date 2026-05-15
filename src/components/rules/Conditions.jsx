import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConditions } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import ConditionItem from './ConditionItem';

function Conditions() {
    const { ruleVersion } = useRuleVersion();
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive shownCard from URL params
    const shownCard = searchParams.get('index') || '';

    // Scroll to shown card when it changes
    useEffect(() => {
        if (shownCard) {
            requestAnimationFrame(() => scrollIntoView(shownCard));
        }
    }, [shownCard]);

    // Fetch data
    const { data: conditionsData, loading: conditionsLoading } = useConditions();

    const expandCard = (index, expanded) => {
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
