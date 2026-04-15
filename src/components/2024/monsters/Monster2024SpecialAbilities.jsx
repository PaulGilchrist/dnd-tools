import { getNameString } from '../../../utils/monsterUtils';

/**
 * Monster2024SpecialAbilities component - Displays monster special abilities and traits
 * @param {object} monster - The monster data object
 */
function Monster2024SpecialAbilities({ monster }) {
    if (!monster || !monster.traits) {
        return null;
    }

    return (
        <div className="removeExtraLine">
            <h5>Special Traits</h5>
            {monster.traits.map((trait, index) => (
                <div key={index}>
                    <b>{trait.name}:</b>&nbsp;{trait.description}<br /><br />
                </div>
            ))}
        </div>
    );
}

export default Monster2024SpecialAbilities;