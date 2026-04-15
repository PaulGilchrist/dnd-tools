import { getNameString } from '../../../utils/monsterUtils';

/**
 * Monster2024Reactions component - Displays monster reactions
 * @param {object} monster - The monster data object
 */
function Monster2024Reactions({ monster }) {
    if (!monster || !monster.reactions) {
        return null;
    }

    return (
        <div className="removeExtraLine">
            {monster.reactions.map((reaction, index) => (
                <span key={index}>
                    <b>{reaction.name}:</b>&nbsp;{reaction.trigger && <i>{reaction.trigger}</i>}{reaction.description}<br /><br />
                </span>
            ))}
        </div>
    );
}

export default Monster2024Reactions;