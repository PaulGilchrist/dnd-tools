import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFeats } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import Feat from './Feat';


function Feats() {
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
    const { data: featsData, loading: featsLoading } = useFeats();

    const expandCard = (index, expanded) => {
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
            <div className="page-header">
                <h1 className="card-title">Feats</h1>
                <div className="page-description">Feats are special features not tied to a character class. A feat represents a talent or an area of expertise that gives a character special capabilities. It embodies training, experience, and abilities beyond what a class provides. The sections below explain the parts of a feat and list a variety of feat options separated into categories. Your background gives you a feat, and at certain levels, your class gives you the Ability Score lmprovement feat or the choice of another feat for which you qualify. By whatever means you acquire a feat, you can take it only once unless its description says otherwise.</div>
            </div>
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
