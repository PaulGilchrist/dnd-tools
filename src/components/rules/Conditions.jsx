import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useConditions } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import ConditionItem from './ConditionItem';

function Conditions() {
    const [conditions, setConditions] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: conditionsData, loading: conditionsLoading } = useConditions();

    useEffect(() => {
        if (conditionsData && conditionsData.length > 0) {
            setConditions(conditionsData);
            console.log(`${conditionsData.length} conditions`);

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
    }, [conditionsData]);

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
        <>
            <div className="list">
                {conditions.map((condition) => (
                    <div key={condition.index} id={condition.index}>
                        <ConditionItem 
                            condition={condition}
                            expand={shownCard === condition.index}
                            onExpand={(expanded) => expandCard(condition.index, expanded)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Conditions;
