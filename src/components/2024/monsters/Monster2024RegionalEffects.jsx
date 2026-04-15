import { getNameString } from '../../../utils/monsterUtils';

/**
 * Monster2024RegionalEffects component - Displays regional effects
 * @param {object} monster - The monster data object
 */
function Monster2024RegionalEffects({ monster }) {
    if (!monster || !monster.regional_effects) {
        return null;
    }

    return (
        <div>
            {monster.regional_effects.summary && <p>{monster.regional_effects.summary}</p>}
            {monster.regional_effects.effects && monster.regional_effects.effects.length > 0 && (
                <ul>
                    {monster.regional_effects.effects.map((effect, index) => (
                        <li key={index}>{effect}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Monster2024RegionalEffects;
