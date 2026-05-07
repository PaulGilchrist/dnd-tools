import { renderHtmlContent } from '../../../../utils/htmlUtils';

/**
 * RaceTraits - Renders racial traits for a race
 * Extracted from RaceItem2024
 */
function RaceTraits({ race }) {
    if (!race.traits || race.traits.length === 0) {
        return null;
    }

    const nonLineageTraits = race.traits.filter(trait => !trait.sub_traits);

    const buildTraitItem = (trait) => {
        const traitName = trait.name || 'Trait';
        const traitDesc = trait.description;

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
    };

    return (
        <div className="section-divider">
            <h5>Racial Traits</h5>
            {nonLineageTraits.map(buildTraitItem)}
        </div>
    );
}

/**
 * RaceSubraces - Renders subraces for a race
 * Extracted from RaceItem2024
 */
function RaceSubraces({ race }) {
    if (!race.subraces || race.subraces.length === 0) {
        return null;
    }

    return (
        <div className="section-divider">
            <h5>Subraces</h5>
            {race.subraces.map((subrace, idx) => (
                <div key={subrace.name} className="subrace-item">
                    <span className="subrace-item-name">{subrace.name || `Subrace ${idx + 1}`}</span>
                    {subrace.description && (
                        <div className="subrace-item-description">
                            <div dangerouslySetInnerHTML={renderHtmlContent(subrace.description)} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/**
 * RaceLineages - Renders lineages (sub-traits within traits)
 * Extracted from RaceItem2024
 */
function RaceLineages({ race }) {
    if (!race.traits || !race.traits.some(trait => trait.sub_traits)) {
        return null;
    }

    return (
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
                        {trait.sub_traits.map((subTrait) => (
                            <div key={subTrait.name} className="raceItem2024-subtrait">
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
    );
}

export { RaceTraits, RaceSubraces, RaceLineages };
