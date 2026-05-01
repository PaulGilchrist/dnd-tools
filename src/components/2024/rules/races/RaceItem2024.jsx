import { renderHtmlContent } from '../../../../utils/htmlUtils';
import '../../../common/index.css';

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

        // Filter out lineage traits (those with sub_traits) as they're displayed separately
        const nonLineageTraits = race.traits.filter(trait => !trait.sub_traits);

        // Separate traits with details from those without
        const traitsWithDetails = [];
        const traitsWithoutDetails = [];
        nonLineageTraits.forEach(trait => {
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
                 <div key={trait.name} className="trait-container-sm">
                     <span className="trait-name-sm">{traitName}</span>
                    {traitDesc && (
                         <div className="trait-description">
                            <div dangerouslySetInnerHTML={renderHtmlContent(traitDesc)} />
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
                 <div key={trait.name} className="trait-container-sm">
                     <span className="trait-name-sm">{traitName}</span>
                    {traitDesc && (
                         <div className="trait-description">
                            <div dangerouslySetInnerHTML={renderHtmlContent(traitDesc)} />
                        </div>
                    )}
                </div>
            );
        });

        // Combine all traits
        return [...traitsWithDetailsContent, ...traitsWithoutDetailsContent];
    };

    const getSubraces = () => {
        if (!race.subraces || race.subraces.length === 0) {
            return null;
        }

        return race.subraces.map((subrace, idx) => {
            const subraceName = subrace.name || `Subrace ${idx + 1}`;
            const subraceDesc = subrace.description || subrace.desc || '';

            return (
                 <div key={idx} className="subrace-item">
                     <span className="subrace-item-name">{subraceName}</span>
                    {subraceDesc && (
                         <div className="subrace-item-description">
                            <div dangerouslySetInnerHTML={renderHtmlContent(subraceDesc)} />
                        </div>
                    )}
                </div>
            );
        });
    };

    const getRaceDescription = () => {
        if (!race.description) {
            return null;
        }

        return (
             <div className="description-section">
                <div dangerouslySetInnerHTML={renderHtmlContent(race.description)} />
            </div>
        );
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
                        <i><b>Size:</b> {race.size}, <b>Speed:</b> {race.speed} feet</i>
                    </div>
                </div>
            </div>

            {expand && (
                <div className="card-body">
                    {/* Race Description */}
                    {getRaceDescription() && (
                         <div className="description-section">
                            {getRaceDescription()}
                        </div>
                    )}

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
                        <div className="raceItem2024-languages">
                            <b>Languages:</b>&nbsp;{getLanguages()}<br />
                        </div>
                    )}

                    {/* Traits */}
                    {getTraits() && (
                         <div className="section-divider">
                            <h5>Racial Traits</h5>
                            {getTraits()}
                        </div>
                    )}

                    {/* Subraces (2024 format - stored in subraces array) */}
                    {getSubraces() && (
                         <div className="section-divider">
                            <h5>Subraces</h5>
                            {getSubraces()}
                        </div>
                    )}

                    {/* Lineages (2024 format - stored within traits as sub_traits) */}
                    {race.traits && race.traits.some(trait => trait.sub_traits) && (
                        <div className="raceItem2024-subspecies-section">
                            <h5>Lineages</h5>
                            {race.traits.filter(trait => trait.sub_traits).map(trait => (
                                 <div key={trait.name} className="lineage-container">
                                     <div className="lineage-header">
                                        <b>{trait.name}</b>
                                        {trait.description && (
                                             <div className="lineage-description">
                                                <div dangerouslySetInnerHTML={renderHtmlContent(trait.description)} />
                                            </div>
                                        )}
                                    </div>
                                     <div className="lineage-options">
                                        {trait.sub_traits.map((subTrait, idx) => (
                                            <div key={idx} className="raceItem2024-subtrait">
                                                <b>{subTrait.name}</b>
                                                {subTrait.description && (
                                                     <div className="subtrait-description">
                                                        <div dangerouslySetInnerHTML={renderHtmlContent(subTrait.description)} />
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
                         <div className="book-reference">
                            <b>Source:</b>&nbsp;{race.book} (page {race.page})
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RaceItem2024;