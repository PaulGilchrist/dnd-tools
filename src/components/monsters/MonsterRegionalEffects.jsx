import { getNameString } from '../../utils/monsterUtils';

function MonsterRegionalEffects({ monster }) {
    if (!monster || !monster.regional_effects) {
        return null;
    }

    return (
        <div>
            <h5>Regional Effects</h5>
            {monster.regional_effects.summary}<br />
            <ul>
                {monster.regional_effects.effects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                ))}
            </ul>
            {monster.regional_effects.usage}<br />
        </div>
    );
}

export default MonsterRegionalEffects;
