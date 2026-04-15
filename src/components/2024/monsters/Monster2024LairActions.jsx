import { getNameString } from '../../../utils/monsterUtils';

/**
 * Monster2024LairActions component - Displays lair actions
 * @param {object} monster - The monster data object
 */
function Monster2024LairActions({ monster }) {
    if (!monster || !monster.lair_actions) {
        return null;
    }

    return (
        <div className="removeExtraLine">
            {monster.lair_actions.summary && <p>{monster.lair_actions.summary}</p>}
            {monster.lair_actions.actions && monster.lair_actions.actions.length > 0 && (
                <ul>
                    {monster.lair_actions.actions.map((action, index) => (
                        <li key={index}>
                            <b>{action.name}:</b>&nbsp;{action.description}
                            {action.save_dc && <span> (DC {action.save_dc} save)</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Monster2024LairActions;
