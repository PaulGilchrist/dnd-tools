import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useRules } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import RulesSearch from './RulesSearch';

function GeneralRules() {
    const { ruleVersion } = useRuleVersion();

    const { data: rulesData, loading: rulesLoading } = useRules();

    useEffect(() => {
        if (rulesData && rulesData.length > 0) {
            console.log(`${rulesData.length} rules`);
        }
    }, [rulesData]);

    if (rulesLoading) {
        return <div className="list"><div>Loading rules...</div></div>;
    }

    return (
        <RulesSearch rules={rulesData} ruleVersion={ruleVersion} />
    );
}

export default GeneralRules;
