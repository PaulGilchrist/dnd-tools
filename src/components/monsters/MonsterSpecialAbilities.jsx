import { getNameString } from '../../utils/monsterUtils';

function MonsterSpecialAbilities({ monster }) {
    if (!monster || !monster.special_abilities) {
        return null;
    }

    return (
        <div className="removeExtraLine">
            {monster.special_abilities.map((special_ability, index) => (
                <span key={index}>
                    <b>
                        {special_ability.name}
                        {special_ability.usage && special_ability.usage.type === 'per day' && (
                            <span>&nbsp;({special_ability.usage.times}/day)</span>
                        )}:
                    </b>&nbsp;{special_ability.desc}<br /><br />
                </span>
            ))}
        </div>
    );
}

export default MonsterSpecialAbilities;
