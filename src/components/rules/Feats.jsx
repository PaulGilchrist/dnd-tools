import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFeats } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import Feat from './Feat';


function Feats() {
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: featsData, loading: featsLoading } = useFeats();

    useEffect(() => {
        if (featsData && featsData.length > 0) {
            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const feat = featsData.find(item => item.index === index);
                if (feat) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            }
        }
    }, [featsData]);

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

    if (featsLoading) {
        return <div className="list"><div>Loading feats...</div></div>;
    }

    return (
        <div className="list">
            {featsData.map((feat) => (
                <div key={feat.index} id={feat.index}>
                    <Feat 
                        feat={feat}
                        expand={shownCard === feat.index}
                        onExpand={(expanded) => expandCard(feat.index, expanded)}
                    />
                </div>
            ))}
        </div>
    );
}

export default Feats;