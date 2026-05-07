import { useEffect } from 'react';
import { useRules } from '../../data/dataService';
import { useRuleVersion } from '../../context/RuleVersionContext';
import RulesSearch from './RulesSearch';

function GeneralRules() {
    const { ruleVersion } = useRuleVersion();

    const { data: rulesData, loading: rulesLoading } = useRules();

    useEffect(() => {
        // Data loaded
    }, [rulesData]);

    if (rulesLoading) {
        return <div className="list"><div>Loading rules...</div></div>;
    }

    return (
        <RulesSearch rules={rulesData} ruleVersion={ruleVersion} />
    );
}

export default GeneralRules;
