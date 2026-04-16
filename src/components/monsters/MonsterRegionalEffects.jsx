import { getNameString } from '../../utils/monsterUtils';
import { renderHtmlContent } from '../../utils/htmlUtils';

function MonsterRegionalEffects({ monster }) {
    if (!monster || !monster.regional_effects) {
        return null;
    }

    return (
        <div>
            <h5>Regional Effects</h5>
            <span dangerouslySetInnerHTML={renderHtmlContent(monster.regional_effects.summary)} /><br />
            <ul>
                {monster.regional_effects.effects.map((effect, index) => (
                    <li key={index}>
                        <span dangerouslySetInnerHTML={renderHtmlContent(effect)} />
                    </li>
                ))}
            </ul>
            <span dangerouslySetInnerHTML={renderHtmlContent(monster.regional_effects.usage)} /><br />
        </div>
    );
}

export default MonsterRegionalEffects;
