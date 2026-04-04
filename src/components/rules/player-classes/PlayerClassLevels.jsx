import { useEffect } from 'react';
import './PlayerClass.css';
import LevelSelector from './LevelSelector';
import AbilityScoreBonuses from './AbilityScoreBonuses';
import ProficiencyBonus from './ProficiencyBonus';
import BarbarianStats from './BarbarianStats';
import BardStats from './BardStats';
import ClericStats from './ClericStats';
import DruidStats from './DruidStats';
import FighterStats from './FighterStats';
import MonkStats from './MonkStats';
import PaladinStats from './PaladinStats';
import RangerStats from './RangerStats';
import RogueStats from './RogueStats';
import SorcererStats from './SorcererStats';
import WarlockStats from './WarlockStats';
import WizardStats from './WizardStats';
import SpellcastingInfo from './SpellcastingInfo';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index, offset = 0) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function PlayerClassLevels({ playerClass, shownLevel, onShowLevel }) {
    useEffect(() => {
        if (shownLevel > 0) {
            utils.scrollIntoView(shownLevel, 120);
        }
    }, [shownLevel]);

    if (!playerClass || !playerClass.class_levels) return null;

    return (
        <>
            <LevelSelector playerClass={playerClass} shownLevel={shownLevel} onShowLevel={onShowLevel} />
                {playerClass.class_levels.map((level) => (
                <div key={level.level} id={shownLevel}>
                    {level.level === shownLevel && (
                        <div className="subtext">
                            {/* Ability Score Bonuses */}
                            {level.ability_score_bonuses !== undefined && (
                                <AbilityScoreBonuses ability_score_bonuses={level.ability_score_bonuses} />
                            )}
                            {/* Proficiency Bonus */}
                            {level.prof_bonus !== undefined && (
                                <ProficiencyBonus prof_bonus={level.prof_bonus} />
                            )}
                            {/* Class-specific stats */}
                            {playerClass.index === 'barbarian' && level.class_specific && (
                                <BarbarianStats class_specific={level.class_specific} />
                            )}

                            {playerClass.index === 'bard' && level.class_specific && (
                                <BardStats class_specific={level.class_specific} />
                            )}

                            {playerClass.index === 'cleric' && level.class_specific && (
                                <ClericStats class_specific={level.class_specific} />
                                    )}

                            {playerClass.index === 'druid' && level.class_specific && (
                                <DruidStats class_specific={level.class_specific} />
                            )}

                            {playerClass.index === 'fighter' && level.class_specific && (
                                <FighterStats class_specific={level.class_specific} />
                            )}

                            {playerClass.index === 'monk' && level.class_specific && (
                                <MonkStats class_specific={level.class_specific} />
                                    )}

                            {playerClass.index === 'paladin' && level.class_specific && (
                                <PaladinStats class_specific={level.class_specific} />
                            )}

                            {playerClass.index === 'ranger' && level.class_specific && (
                                <RangerStats class_specific={level.class_specific} />
                            )}

                            {playerClass.index === 'rogue' && level.class_specific && (
                                <RogueStats class_specific={level.class_specific} />
                                    )}

                            {playerClass.index === 'sorcerer' && level.class_specific && (
                                <SorcererStats class_specific={level.class_specific} />
                            )}
                            {playerClass.index === 'warlock' && level.class_specific && (
                                <WarlockStats class_specific={level.class_specific} />
                            )}

                            {playerClass.index === 'wizard' && level.class_specific && (
                                <WizardStats class_specific={level.class_specific} />
                            )}
                            {/* Spellcasting */}
                            {level.spellcasting && (
                                <SpellcastingInfo spellcasting={level.spellcasting} />
                                    )}
                                        </div>
                                    )}
                                        </div>
            ))}
        </>
    );
}

export default PlayerClassLevels;

