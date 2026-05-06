import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { usePlayerClasses } from '../../../data/dataService';
import { scrollIntoView } from '../../../data/utils';
import PlayerClass from './PlayerClass';


function PlayerClasses() {
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: playerClassesData, loading: playerClassesLoading } = usePlayerClasses();

    useEffect(() => {
        if (playerClassesData && playerClassesData.length > 0) {
            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const playerClass = playerClassesData.find(item => item.index === index);
                if (playerClass) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            }
        }
    }, [playerClassesData]);

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

    if (playerClassesLoading) {
        return <div className="list"><div>Loading player classes...</div></div>;
    }

    return (
              <div className="list">
                  <div className="page-header">
                      <h1 className="card-title">Classes</h1>
                      <p className="page-description">Choose a class for your character. Your class defines your character's role in the game and determines their abilities, skills, and progression.</p>
                  </div>
                  {playerClassesData?.map((playerClass) => (
                      <div key={playerClass.index} id={playerClass.index}>
                          <PlayerClass 
                             playerClass={playerClass}
                             expand={shownCard === playerClass.index}
                             onExpand={(expanded) => expandCard(playerClass.index, expanded)}
                          />
                      </div>
                  ))}
              </div>
          );
}

export default PlayerClasses;
