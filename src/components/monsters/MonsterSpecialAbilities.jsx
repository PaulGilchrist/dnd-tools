import { getNameString } from '../../utils/monsterUtils';
import { renderHtmlContent } from '../../utils/htmlUtils';

function MonsterSpecialAbilities({ monster }) {
    if (!monster || !monster.special_abilities || monster.special_abilities.length === 0) {
        return null;
    }

    return (
        <div>
            <h5>Special Traits</h5>
            {monster.special_abilities.map((special_ability, index) => (
                <span key={index}>
                    <b>
                        {special_ability.name}
                        {special_ability.usage && special_ability.usage.type === 'per day' && (
                            <span>&nbsp;({special_ability.usage.times}/day)</span>
                        )}:
                    </b>&nbsp;
                    <span dangerouslySetInnerHTML={renderHtmlContent(special_ability.desc)} />
                </span>
            ))}
        </div>
    );
}

export default MonsterSpecialAbilities;
