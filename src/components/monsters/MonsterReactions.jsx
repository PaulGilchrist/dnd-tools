import { getNameString } from '../../utils/monsterUtils';
import { renderHtmlContent } from '../../utils/htmlUtils';

function MonsterReactions({ monster }) {
    if (!monster || !monster.reactions) {
        return null;
    }

    return (
        <div>
            {monster.reactions.map((reaction, index) => (
                <span key={index}>
                    <b>{reaction.name}:</b>&nbsp;
                    <span dangerouslySetInnerHTML={renderHtmlContent(reaction.desc)} />
                    <br /><br />
                </span>
            ))}
        </div>
    );
}

export default MonsterReactions;
