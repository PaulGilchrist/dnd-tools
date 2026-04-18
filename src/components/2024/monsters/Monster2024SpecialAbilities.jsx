import { getNameString } from '../../../utils/monsterUtils';
import { renderHtmlContent } from '../../../utils/htmlUtils';

/**
 * Monster2024SpecialAbilities component - Displays monster special abilities and traits
 * @param {object} monster - The monster data object
 */
function Monster2024SpecialAbilities({ monster }) {
    if (!monster || !monster.traits || monster.traits.length === 0) {
        return null;
    }

    return (
        <div>
            <h5>Special Traits</h5>
            {monster.traits.map((trait, index) => (
                <div key={index}>
                    <b>{trait.name}:</b>&nbsp;
                    <span dangerouslySetInnerHTML={renderHtmlContent(trait.description)} />
                    <br /><br />
                </div>
            ))}
        </div>
    );
}

export default Monster2024SpecialAbilities;