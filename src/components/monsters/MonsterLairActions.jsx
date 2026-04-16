import { getNameString } from '../../utils/monsterUtils';
import { renderHtmlContent } from '../../utils/htmlUtils';

function MonsterLairActions({ monster }) {
    if (!monster || !monster.lair_actions) {
        return null;
    }

    return (
        <div>
            <span dangerouslySetInnerHTML={renderHtmlContent(monster.lair_actions.summary)} /><br />
            <ul>
                {monster.lair_actions.actions.map((action, index) => (
                    <li key={index}>
                        <span dangerouslySetInnerHTML={renderHtmlContent(action)} />
                    </li>
                ))}
            </ul>
            {monster.lair_actions.usage && (
                <div>
                    <span dangerouslySetInnerHTML={renderHtmlContent(monster.lair_actions.usage)} /><br />
                </div>
            )}
        </div>
    );
}

export default MonsterLairActions;
