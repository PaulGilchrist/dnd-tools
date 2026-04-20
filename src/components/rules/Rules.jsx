import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useRules } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import RulesItem from './RulesItem';

function GeneralRules() {
    const { ruleVersion } = useRuleVersion();
    const [rules, setRules] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: rulesData, loading: rulesLoading } = useRules();

    useEffect(() => {
        if (rulesData && rulesData.length > 0) {
            setRules(rulesData);
            console.log(`${rulesData.length} rules`);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const rule = rulesData.find(rule => rule.index === index);
                if (rule) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage - default to "All" when no saved data
                const savedFilter = localStorage.getItem('rulesFilter');
                if (savedFilter) {
                    // Filter logic can be added here in the future
                } else {
                    localStorage.setItem('rulesFilter', JSON.stringify({ category: 'All' }));
                }
            }
        }
    }, [rulesData]);

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

    const filterByRuleVersion = (rule) => {
        // If rule.rules does not exist, show the item
        if (!rule.rules) {
            return true;
        }
        
        // If rule.rules exists and matches ruleVersion, show the item
        if (rule.rules === ruleVersion) {
            return true;
        }
        
        // If rule.rules exists but does not match ruleVersion, skip the item
        return false;
    };

    const filterSubsections = (rule) => {
        if (!rule.subsections) return rule;
        
        const filteredSubsections = rule.subsections.filter((subsection) => {
            // If subsection.rules does not exist, show the item
            if (!subsection.rules) {
                return true;
            }
            
            // If subsection.rules exists and matches ruleVersion, show the item
            if (subsection.rules === ruleVersion) {
                return true;
            }
            
            // If subsection.rules exists but does not match ruleVersion, skip the item
            return false;
        });
        
        return { ...rule, subsections: filteredSubsections };
    };

    const filteredRules = rules
        .filter(filterByRuleVersion)
        .map(filterSubsections);

    if (rulesLoading) {
        return <div className="list"><div>Loading rules...</div></div>;
    }

    return (
        <>
            <div className="list">
                {filteredRules.map((rule) => (
                    <div key={rule.index} id={rule.index}>
                        <RulesItem
                            rule={rule}
                            expand={shownCard === rule.index}
                            onExpand={(expanded) => expandCard(rule.index, expanded)}
                            ruleVersion={ruleVersion}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default GeneralRules;

