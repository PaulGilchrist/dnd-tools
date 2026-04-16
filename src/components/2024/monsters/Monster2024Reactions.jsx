import { getNameString } from '../../../utils/monsterUtils';
import { renderHtmlContent } from '../../../utils/htmlUtils';

/**
 * Monster2024Reactions component - Displays monster reactions
 * @param {object} monster - The monster data object
 */
function Monster2024Reactions({ monster }) {
    if (!monster || !monster.reactions) {
        return null;
    }

    return (
        <div>
            {monster.reactions.map((reaction, index) => (
                <span key={index} className="reaction-item">
                    <b>{reaction.name}:</b>&nbsp;
                    {reaction.trigger && <i>{reaction.trigger}</i>}
                    <span dangerouslySetInnerHTML={renderHtmlContent(reaction.description)} />
                </span>
            ))}
        </div>
    );
}

export default Monster2024Reactions;