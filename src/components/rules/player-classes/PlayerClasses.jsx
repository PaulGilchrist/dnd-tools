import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVersionedData } from '../../../hooks/useVersionedData';
import { useRuleVersion } from '../../../context/RuleVersionContext';
import { scrollIntoView } from '../../../data/utils';
import PlayerClass from './PlayerClass';
import PlayerClass2024 from '../../2024/rules/player-classes/PlayerClass2024';

const headerConfig = {
    '5e': {
        title: 'Classes',
        description: "Choose a class for your character. Your class defines your character's role in the game and determines their abilities, skills, and progression.",
    },
    '2024': {
        title: 'Player Classes',
        description: 'Classes from the 2024 Dungeons & Dragons rules update. Each class includes core traits, level progression, and major options (replacing traditional subclasses).',
    },
};

function PlayerClasses() {
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { ruleVersion } = useRuleVersion();

    // Fetch data directly from versioned hook — no local state copy
    const { data: playerClassesData, loading: playerClassesLoading } = useVersionedData('classes');

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

    const header = headerConfig[ruleVersion] || headerConfig['5e'];

    return (
        <div className="list">
            <div className="page-header">
                <h1 className="card-title">{header.title}</h1>
                <p className="page-description">{header.description}</p>
            </div>
            {playerClassesData?.map((playerClass) => (
                <div key={playerClass.index} id={playerClass.index}>
                    {ruleVersion === '2024' ? (
                        <PlayerClass2024
                            playerClass={playerClass}
                            expand={shownCard === playerClass.index}
                            onExpand={(expanded) => expandCard(playerClass.index, expanded)}
                        />
                    ) : (
                        <PlayerClass
                            playerClass={playerClass}
                            expand={shownCard === playerClass.index}
                            onExpand={(expanded) => expandCard(playerClass.index, expanded)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default PlayerClasses;
