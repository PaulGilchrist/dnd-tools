import '../../../common/index.css';
function Subrace2024({ subrace }) {
    if (!subrace) {
        return null;
    }

    // Process racial traits - separate those with descriptions from those without
    const traitsWithDesc = [];
    const traitsWithoutDesc = [];

    if (subrace.racial_traits) {
        subrace.racial_traits.forEach(trait => {
            if (trait.desc && trait.desc.length > 0) {
                traitsWithDesc.push(trait);
            } else {
                traitsWithoutDesc.push(trait);
            }
        });
    }

    // Build traits with descriptions
    const traitsWithDescContent = traitsWithDesc.map(trait => (
        <div key={trait.name} className="subrace-trait-sm">
            <span className="trait-name-sm">{trait.name}</span>
            <span className="trait-description-sm">
                {Array.isArray(trait.desc) ? trait.desc.join(' ') : trait.desc}
            </span>
        </div>
    ));

    // Build traits without descriptions
    const traitsWithoutDescContent = traitsWithoutDesc.map(trait => (
        <div key={trait.name} className="subrace-trait-sm">
            <span className="trait-name-sm">{trait.name}</span>
        </div>
    ));

    const allTraits = [...traitsWithDescContent, ...traitsWithoutDescContent];

    return (
        <div key={subrace.name} className="subrace-card">
            <h5 className="subrace-heading-sm">{subrace.name}</h5>

            {subrace.desc && (
                <div className="subrace-description-sm">
                                    {subrace.desc}
                                </div>
                            )}

            {/* Ability Bonuses */}
            {subrace.ability_bonuses && subrace.ability_bonuses.length > 0 && (
                <div className="subrace-info-sm">
                    <b>Ability Bonuses:</b>&nbsp;
                    {subrace.ability_bonuses.map(bonus => (
                        <span key={bonus.ability_score}>
                            {bonus.ability_score} +{bonus.bonus},&nbsp;
                        </span>
                    ))}
                </div>
            )}

            {/* Speed */}
            {subrace.speed && (
                <div className="subrace-info-sm">
                    <b>Speed:</b>&nbsp;{subrace.speed} feet<br />
                </div>
            )}

            {/* Starting Proficiencies */}
            {subrace.starting_proficiencies && subrace.starting_proficiencies.length > 0 && (
                <div className="subrace-info-sm">
                    <b>Starting Proficiencies:</b>&nbsp;
                    {subrace.starting_proficiencies.join(', ')}<br />
                </div>
            )}

            {/* Racial Traits */}
            {subrace.racial_traits && subrace.racial_traits.length > 0 && (
                <div className="subrace-traits-sm">
                    <b>Racial Traits:</b><br />
                    {allTraits}
                </div>
            )}

            {/* Language Options */}
            {subrace.language_options && (
                <div className="subrace-info-sm">
                    <b>Language Options:</b>&nbsp;
                    Choose 1 from: {subrace.language_options.from.join(', ')}<br />
                </div>
            )}

            {/* Special Options */}
            {subrace.racial_traits && subrace.racial_traits.length > 0 && (
                <div className="subrace-special-sm">
                    <b>Special Options:</b><br />
                    {subrace.racial_traits.map((trait) => (
                        <div key={trait.name}>
                            {trait.name}:&nbsp;
                            {trait.desc && (
                                Array.isArray(trait.desc) ? trait.desc.join(' ') : trait.desc
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default Subrace2024;