import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Common MonsterRegionalEffects component - Displays regional effects
 * Works with normalized monster data from both 5e and 2024 versions
 * @param {object} monster - The normalized monster data object
 */
function MonsterRegionalEffects({ monster }) {
    if (!monster || !monster.regionalEffects) {
        return null;
        }

    return (
            <div>
                <h5>Regional Effects</h5>
                {monster.regionalEffects.summary && (
                    <span dangerouslySetInnerHTML={renderHtmlContent(monster.regionalEffects.summary)} />
                )}
                <br />
                {monster.regionalEffects.effects && monster.regionalEffects.effects.length > 0 && (
                    <ul>
                        {monster.regionalEffects.effects.map((effect, index) => (
                            <li key={index}>
                                <span dangerouslySetInnerHTML={renderHtmlContent(effect)} />
                            </li>
                        ))}
                    </ul>
                )}
                {monster.regionalEffects.usage && (
                    <span dangerouslySetInnerHTML={renderHtmlContent(monster.regionalEffects.usage)} />
                )}
                <br />
            </div>
        );
}

export default MonsterRegionalEffects;