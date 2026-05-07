import { useState } from 'react';
import { renderHtmlContent } from '../../utils/htmlUtils';
import '../common/index.css';
import Subraces from './Subraces';

function RaceItem({ race, expand, onExpand }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    // Update local state when prop changes
    if (expand !== isExpanded) {
        setIsExpanded(expand);
    }

    const getAbilityBonuses = () => {
        if (!race.ability_bonuses || race.ability_bonuses.length === 0) {
            return null;
        }
        const bonuses = race.ability_bonuses.map(bonus => 
            `${bonus.ability_score} +${bonus.bonus}`
        ).join(', ');
        return bonuses;
    };

    const getLanguages = () => {
        if (!race.languages || race.languages.length === 0) {
            return null;
        }
        if (race.language_desc) {
            return race.language_desc;
        }
        return race.languages.join(', ');
    };

    const getTraits = () => {
        if (!race.traits || race.traits.length === 0) {
            return null;
        }

        // Separate traits with details from those without
        const traitsWithoutDetails = [];
        race.traits.forEach(trait => {
            traitsWithoutDetails.push(trait);
        });

        // Build content for traits without details (text only)
        const traitsWithoutDetailsContent = traitsWithoutDetails.map(trait => {
                        const traitName = trait.name || 'Trait';
            const traitDesc = trait.description || '';
            return (
                 <div key={trait.index} className="trait-container">
                    <b>{traitName}</b>
                    {traitDesc && (
                         <div className="trait-description-md">
                            <div dangerouslySetInnerHTML={renderHtmlContent(traitDesc)} />
                        </div>
                    )}
                </div>
            );
        });

        // Combine all traits
        return [...traitsWithoutDetailsContent];
    };

    if (!race) {
        return null;
    }

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={race.index}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div>
                    <div className="card-title">{race.name}</div>
                    <div>
                        <i>Size: {race.size}, Speed: {race.speed} feet</i>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="card-body">
                    {/* Basic Information */}
                    <div>
                        {getAbilityBonuses() && (
                            <div>
                                <b>Ability Bonuses:</b>&nbsp;{getAbilityBonuses()}<br />
                            </div>
                        )}
                        
                        <b>Age:</b>&nbsp;{race.age}<br />
                        {race.alignment && (
                            <div>
                                <b>Alignment:</b>&nbsp;{race.alignment}<br />
                            </div>
                        )}
                        
                        <b>Size:</b>&nbsp;{race.size_description}<br />
                    </div>

                    {/* Languages */}
                    {getLanguages() && (
                         <div className="section-divider">
                            <hr />
                            <h5>Languages</h5>
                            {getLanguages()}
                        </div>
                    )}

                    {/* Traits */}
                    {getTraits() && (
                         <div className="section-divider">
                            <hr />
                            <h5>Racial Traits</h5>
                            {getTraits()}
                        </div>
                    )}

                    {/* Subraces */}
                    {race.subraces && race.subraces.length > 0 && (
                        <Subraces subraces={race.subraces} />
                    )}

                    {/* Book Reference */}
                    {race.book && (
                         <div className="book-reference">
                            <b>Source:</b>&nbsp;{race.book} (page {race.page})
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RaceItem;

