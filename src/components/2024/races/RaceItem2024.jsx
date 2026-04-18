import './RaceItem2024.css';

function RaceItem2024({ race, expand, onExpand }) {

    const getAbilityBonuses = () => {
        if (!race.ability_score_increase && (!race.ability_score_options || race.ability_score_options.length === 0)) {
            return null;
        }
        
        let bonuses = '';
        
        // Handle ability_score_increase (single choice)
        if (race.ability_score_increase) {
            bonuses = `${race.ability_score_increase} +1`;
        }
        
        // Handle ability_score_options (multiple choices)
        if (race.ability_score_options && race.ability_score_options.length > 0) {
            const options = race.ability_score_options.map(option => 
                `${option.ability_score} +${option.bonus}`
            ).join(', ');
            bonuses = options;
        }
        
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
            
            if (trait.description) {
                traitDesc = trait.description;
            }
            
            return (
                <div key={trait.name} className="raceItem2024-race-trait">
                    <span className="raceItem2024-trait-name">{traitName}</span>
                    {traitDesc && (
                        <div className="raceItem2024-trait-description">
                            {traitDesc}
                        </div>
                    )}
                </div>
            );
        });

        // Build content for traits without details (text only)
        const traitsWithoutDetailsContent = traitsWithoutDetails.map(trait => {
            const traitName = trait.name || 'Trait';
            let traitDesc = '';

            if (trait.description) {
                traitDesc = trait.description;
            }

            return (
                <div key={trait.name} className="raceItem2024-race-trait">
                    <span className="raceItem2024-trait-name">{traitName}</span>
                    {traitDesc && (
                        <div className="raceItem2024-trait-description">
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
        onExpand(!expand);
    };

    return (
        <div className={`card w-100 ${expand ? 'active' : ''}`} id={race.index}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div>
                    <div className="card-title">{race.name}</div>
                    <div>
                        <i>Size: {race.size}, Speed: {race.speed} feet</i>
                    </div>
                </div>
            </div>

            {expand && (
                <div className="card-body">
                    {/* Basic Information */}
                    <div>
                        {getAbilityBonuses() && (
                            <div className="raceItem2024-ability-bonus">
                                <b>Ability Bonuses:</b>&nbsp;{getAbilityBonuses()}<br />
                            </div>
                        )}
                        
                        <div className="raceItem2024-speed">
                            <b>Speed:</b>&nbsp;{race.speed} feet<br />
                        </div>
                        
                        {race.size && (
                            <div className="raceItem2024-size">
                                <b>Size:</b>&nbsp;{race.size}<br />
                            </div>
                        )}
                        
                        {race.age && (
                            <div className="raceItem2024-age">
                                <b>Age:</b>&nbsp;{race.age}<br />
                            </div>
                        )}
                        
                        {race.alignment && (
                            <div className="raceItem2024-alignment">
                                <b>Alignment:</b>&nbsp;{race.alignment}<br />
                            </div>
                        )}
                    </div>

                    {/* Languages */}
                    {getLanguages() && (
                        <div className="raceItem2024-section-divider">
                            <h5>Languages</h5>
                            {getLanguages()}
                        </div>
                    )}

                    {/* Traits */}
                    {getTraits() && (
                        <div className="raceItem2024-section-divider">
                            <h5>Racial Traits</h5>
                            {getTraits()}
                        </div>
                    )}

                    {/* Lineages (2024 format - stored within traits as sub_traits) */}
                    {race.traits && race.traits.some(trait => trait.sub_traits) && (
                        <div className="raceItem2024-subspecies-section">
                            <h5>Lineages</h5>
                            {race.traits.filter(trait => trait.sub_traits).map(trait => (
                                <div key={trait.name} className="raceItem2024-lineage-container">
                                    <div className="raceItem2024-lineage-header">
                                        <b>{trait.name}</b>
                                        {trait.description && (
                                            <div className="raceItem2024-lineage-desc">
                                                {trait.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="raceItem2024-lineage-options">
                                        {trait.sub_traits.map((subTrait, idx) => (
                                            <div key={idx} className="raceItem2024-subtrait">
                                                <b>{subTrait.name}</b>
                                                {subTrait.description && (
                                                    <div className="raceItem2024-subtrait-desc">
                                                        {subTrait.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Book Reference */}
                    {race.book && (
                        <div className="raceItem2024-book-reference">
                            <b>Source:</b>&nbsp;{race.book} (page {race.page})
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RaceItem2024;