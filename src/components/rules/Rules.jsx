import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useRules } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import RulesSearch from './RulesSearch';

function GeneralRules() {
    const { ruleVersion } = useRuleVersion();
    const [rules, setRules] = useState([]);
    const [rulesLoading, setRulesLoading] = useState(true);

       // Fetch data
    const { data: rulesData } = useRules();

    useEffect(() => {
        if (rulesData && rulesData.length > 0) {
            setRules(rulesData);
            console.log(`${rulesData.length} rules`);
            setRulesLoading(false);
         }
       }, [rulesData]);

    if (rulesLoading) {
        return <div className="list"><div>Loading rules...</div></div>;
    }

    return (
          <RulesSearch rules={rules} ruleVersion={ruleVersion} />
      );
}

export default GeneralRules;

