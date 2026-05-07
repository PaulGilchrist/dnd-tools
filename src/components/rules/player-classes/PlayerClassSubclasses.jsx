import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';
import { renderHtmlContent } from '../../../utils/htmlUtils';

function PlayerClassSubclasses({ playerClass, shownLevel, shownSubclass, onShowSubclass, getSpells, subclassFeatures }) {
    useEffect(() => {
        if (shownSubclass) {
            scrollIntoView(shownSubclass);
        }
    }, [shownSubclass]);

    if (!playerClass || !playerClass.subclasses || playerClass.subclasses.length === 0) {
        return null;
    }

    const currentSubclass = playerClass.subclasses.find((subclass) => subclass.index === shownSubclass);

    return (
        <>
            <div>
                <br />
                <b>Choose {playerClass.subclasses[0].subclass_flavor}:</b>
                <div className="playerClass-subclass-group">
                    {playerClass.subclasses.map((subclass) => (
                        <div key={subclass.index} className="btn-group">
                            <button 
                                type="button" 
                                className={`btn btn-outline-primary playerClass-btn-subclass ${shownSubclass === subclass.index ? 'active' : ''}`}
                                onClick={() => onShowSubclass(subclass.index)}
                            >
                                {subclass.name}
                            </button>
                        </div>
                    ))}
                </div>
                <br/>
                {playerClass.subclasses.map((subclass) => (
                    <div key={subclass.index} id={subclass.index}>
                        {shownSubclass === subclass.index && (
                            <div className="playerClass-subtext">
                                <strong>{subclass.subclass_flavor} - {subclass.name}</strong> - <span dangerouslySetInnerHTML={renderHtmlContent(subclass.description)} /><br />
                                <br/>
                                {/* Subclass Spells */}
                                {subclass.spells && (
                                    <div className="playerClass-margin-bottom-small">
                                        <b>Spells:</b>
                                        <div dangerouslySetInnerHTML={renderHtmlContent(getSpells(subclass.spells))} className="playerClass-spell-list" />
                                    </div>
                                )}
                                {/* Features that are not level specific */}
                                {subclass.features && subclass.features.length > 0 && (
                                    <div>
                                        {subclass.features.map((feature, index) => (
                                            <div key={`${feature.name}-${index}`}>
                                                <div className="playerClass-feature">
                                                    <b>{feature.name}:</b>&nbsp;
                                                  {feature.description && (
                                                          <div className="margin-bottom-small">
                                                              <span dangerouslySetInnerHTML={renderHtmlContent(feature.description)} />
                                                          </div>
                                                      )}
                                                </div>
                                                {feature.prerequisites && feature.prerequisites.length > 0 && (
                                                    <div>
                                                        <b>Prerequisites:</b>&nbsp;{getPrerequisites(feature.prerequisites)}<br />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Subclass Features by Level */}
                                {subclassFeatures && subclassFeatures.length > 0 && (
                                    <div>
                                        {subclassFeatures.map((feature) => (
                                            <div key={`${feature.name}-${feature.level}`}>
                                                <div className="playerClass-feature">
                                                    <b>{feature.name}:</b>&nbsp;
                                                  {feature.description && (
                                                          <div>
                                                              <span dangerouslySetInnerHTML={renderHtmlContent(feature.description)} />
                                                          </div>
                                                      )}
                                                    {feature.details && (
                                                        <div>
                                                            <span dangerouslySetInnerHTML={renderHtmlContent(feature.details)} />
                                                        </div>
                                                    )}
                                                </div>
                                                <br />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Subclass Spellcasting by Level */}
                                {currentSubclass && currentSubclass.class_levels && (
                                    <div className="playerClass-subtext">
                                        {currentSubclass.class_levels.map((level) => (
                                            <div key={level.level}>
                                                {level.spellcasting && level.level === shownLevel && (
                                                    <div>
                                                        {level.spellcasting.cantrips_known > 0 && (
                                                            <div>
                                                                <b>Cantrips Known:</b>&nbsp;{level.spellcasting.cantrips_known}<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spells_known > 0 && (
                                                            <div>
                                                                <b>Spells Known:</b>&nbsp;{level.spellcasting.spells_known}<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_1 > 0 && (
                                                            <div>
                                                                <b>Spell Slots:</b><br />
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_1} of level 1<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_2 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_2} of level 2<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_3 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_3} of level 3<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_4 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_4} of level 4<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_5 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_5} of level 5<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_6 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_6} of level 6<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_7 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_7} of level 7<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_8 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_8} of level 8<br />
                                                            </div>
                                                        )}
                                                        {level.spellcasting.spell_slots_level_9 > 0 && (
                                                            <div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_9} of level 9<br />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

// Helper function for prerequisites (moved from PlayerClass)
function getPrerequisites(prerequisites) {
    if (!prerequisites || prerequisites.length === 0) return '';
    
    let prerequisitesText = '';
    prerequisites.forEach((prerequisite) => {
        switch (prerequisite.type) {
            case 'feature':
                prerequisitesText += `feature ${prerequisite.feature.substr(14)}, `;
                break;
            case 'level':
                break;
            case 'proficiency':
                prerequisitesText += `proficiency ${prerequisite.proficiency.substr(19)}, `;
                break;
            case 'Spell':
                prerequisitesText += `spell ${prerequisite.spell.substr(12)}, `;
                break;
            default:
                const key = Object.keys(prerequisite).find(key => key !== 'type');
                if (key) {
                    prerequisitesText += `${prerequisite.type} ${prerequisite[key]} , `;
                }
        }
    });
    
    return prerequisitesText.substring(0, prerequisitesText.length - 2);
}

export default PlayerClassSubclasses;
