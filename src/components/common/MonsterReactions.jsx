import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Common MonsterReactions component - Displays monster reactions
 * Works with normalized monster data from both 5e and 2024 versions
 * @param {object} monster - The normalized monster data object
 */
function MonsterReactions({ monster }) {
    if (!monster || !monster.reactions || monster.reactions.length === 0) {
        return null;
       }

    return (
          <div>
              {monster.reactions.map((reaction, index) => (
                  <span key={index} className="reaction-item">
                      <b>{reaction.name}:</b>&nbsp;
                      {reaction.trigger && <i>{reaction.trigger}</i>}
                      {reaction.renderDescription && <span dangerouslySetInnerHTML={reaction.renderDescription()} />}
                  </span>
              ))}
          </div>
      );
}

export default MonsterReactions;