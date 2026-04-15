import { getNameString } from '../../../utils/monsterUtils';

/**
 * Monster2024LegendaryActions component - Displays legendary actions
 * @param {object} monster - The monster data object
 */
function Monster2024LegendaryActions({ monster }) {
    if (!monster || !monster.legendary_actions) {
        return null;
    }

    return (
        <div>
            <p>{monster.legendary_actions.find(a => a.name)?.uses ? `Monster can take ${monster.legendary_actions.find(a => a.name)?.uses} legendary actions, only one at a time. At the end of another creature's turn, the monster can take one of the following actions.` : ''}</p>
            {monster.legendary_actions.map((legendary_action, index) => (
                <span key={index}>
                    <b>{legendary_action.name}:</b>&nbsp;{legendary_action.description}<br /><br />
                </span>
            ))}
        </div>
    );
}

export default Monster2024LegendaryActions;
