import { getNameString } from '../../utils/monsterUtils';

function MonsterLegendaryActions({ monster }) {
    if (!monster || !monster.legendary_actions) {
        return null;
    }

    return (
        <div>
            {monster.legendary_actions.map((legendary_action, index) => (
                <span key={index}>
                    <b>{legendary_action.name}:</b>&nbsp;{legendary_action.desc}<br /><br />
                </span>
            ))}
        </div>
    );
}

export default MonsterLegendaryActions;
