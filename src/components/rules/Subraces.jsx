import '../common/index.css';

function Subraces({ subraces }) {
    if (!subraces || subraces.length === 0) {
        return null;
    }

    const subracesList = subraces.map(subrace => {
        // Separate racial traits with and without descriptions
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
        const traitsWithDescContent = traitsWithDesc.map(trait => {
            return (
                <div key={trait.index} className="subrace-trait">
                    <b>{trait.name}</b>
                    {Array.isArray(trait.desc) ? trait.desc.join(' ') : trait.desc}
                </div>
            );
        });

        // Build traits without descriptions
        const traitsWithoutDescContent = traitsWithoutDesc.map(trait => {
            return (
                <div key={trait.index} className="subrace-trait">
                    <b>{trait.name}</b>
                </div>
            );
        });

        // Combine all traits
        const allTraits = [...traitsWithDescContent, ...traitsWithoutDescContent];

        return (
            <div key={subrace.index} className="subrace-card">
                <h5>{subrace.name}</h5>

                {subrace.desc && (
                    <div className="subrace-description-sm">
                        {subrace.desc}
                    </div>
                )}

                {/* Ability Bonuses */}
                {subrace.ability_bonuses && subrace.ability_bonuses.length > 0 && (
                    <div className="subrace-info">
                        <b>Ability Bonuses:</b>&nbsp;
                        {subrace.ability_bonuses.map(bonus =>
                            <span key={bonus.ability_score}>{bonus.ability_score} +{bonus.bonus}, </span>
                        )}
                    </div>
                )}

                {/* Speed */}
                {subrace.speed && (
                    <div className="subrace-info">
                        <b>Speed:</b>&nbsp;{subrace.speed} feet<br />
                    </div>
                )}

                {/* Starting Proficiencies */}
                {subrace.starting_proficiencies && subrace.starting_proficiencies.length > 0 && (
                    <div className="subrace-info">
                        <b>Starting Proficiencies:</b>&nbsp;{subrace.starting_proficiencies.join(', ')}<br />
                    </div>
                )}

                {/* Racial Traits */}
                {subrace.racial_traits && subrace.racial_traits.length > 0 && (
                    <div className="subrace-traits">
                        <b>Racial Traits:</b><br />
                        {allTraits}
                    </div>
                )}

                {/* Language Options */}
                {subrace.language_options && (
                    <div className="subrace-info">
                        <b>Language Options:</b>&nbsp;Choose 1 from: {subrace.language_options.from.join(', ')}<br />
                    </div>
                )}

                {/* Trait-specific options (like spells) */}
                {subrace.racial_traits && subrace.racial_traits.length > 0 && (
                    <div className="subrace-special">
                        <b>Special Options:</b><br />
                        {subrace.racial_traits.map((trait, idx) => (
                            <div key={idx}>
                                {trait.name}:
                                {trait.desc && (Array.isArray(trait.desc) ? trait.desc.join(' ') : trait.desc)}
                            </div>
                        ))}
                    </div>
                )}

                <hr />
            </div>
        );
    });

    return (
        <div className="subrace-section">
            <hr />
            <h5>Subraces</h5>
            {subracesList}
        </div>
    );
}

export default Subraces;

