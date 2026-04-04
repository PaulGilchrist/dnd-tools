import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useRules } from '../data/dataService';
import RulesItem from './RulesItem';
// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function GeneralRules() {
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
                    utils.scrollIntoView(index);
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
            utils.scrollIntoView(index);
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

    if (rulesLoading) {
        return <div className="list"><div>Loading rules...</div></div>;
    }

    return (
        <>
            <div className="list">
                {rules.map((rule) => (
                    <div key={rule.index} id={rule.index}>
                        <RulesItem
                            rule={rule}
                            expand={shownCard === rule.index}
                            onExpand={(expanded) => expandCard(rule.index, expanded)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default GeneralRules;

