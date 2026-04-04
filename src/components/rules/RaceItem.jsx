import { useState, useEffect } from 'react';
import './RaceItem.css';
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
        const traitsWithDetails = [];
        const traitsWithoutDetails = [];
        race.traits.forEach(trait => {
            if (trait.details) {
                traitsWithDetails.push(trait);
            } else {
                traitsWithoutDetails.push(trait);
            }
        });

        // Build content for traits with details (HTML)
        const traitsWithDetailsContent = traitsWithDetails.map(trait => {
            const traitName = trait.name || 'Trait';
            let traitDesc = '';
            
            if (trait.desc && Array.isArray(trait.desc)) {
                traitDesc = trait.desc.join(' ');
            } else if (trait.desc) {
                traitDesc = trait.desc;
            }
            return (
                <div key={trait.index} className="race-trait">
                    <b>{traitName}</b>
                    {traitDesc && (
                        <div className="trait-desc">
                            <hr />
                            <h5>Description</h5>
                            {traitDesc}
                        </div>
                    )}
                    <hr />
                    <h5>Details</h5>
                    {trait.details && (
                        <div className="trait-details">
                            <div dangerouslySetInnerHTML={{ __html: trait.details }} />
                        </div>
                    )}
                </div>
            );
        });

        // Build content for traits without details (text only)
        const traitsWithoutDetailsContent = traitsWithoutDetails.map(trait => {
            const traitName = trait.name || 'Trait';
            let traitDesc = '';

            if (trait.desc && Array.isArray(trait.desc)) {
                traitDesc = trait.desc.join(' ');
            } else if (trait.desc) {
                traitDesc = trait.desc;
            }

            return (
                <div key={trait.index} className="race-trait">
                    <b>{traitName}</b>
                    {traitDesc && (
                        <div className="trait-desc">
                            <hr />
                            {traitDesc}
                        </div>
                    )}
                </div>
            );
        });

        // Combine all traits
        return [...traitsWithDetailsContent, ...traitsWithoutDetailsContent];
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

