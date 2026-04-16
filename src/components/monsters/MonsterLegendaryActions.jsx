import { getNameString } from '../../utils/monsterUtils';
import { renderHtmlContent } from '../../utils/htmlUtils';

function MonsterLegendaryActions({ monster }) {
    if (!monster || !monster.legendary_actions) {
        return null;
    }

    return (
        <div>
            {monster.legendary_actions.map((legendary_action, index) => (
                <span key={index}>
                    <b>{legendary_action.name}:</b>&nbsp;
                    <span dangerouslySetInnerHTML={renderHtmlContent(legendary_action.desc)} />
                    <br /><br />
                </span>
            ))}
        </div>
    );
}

export default MonsterLegendaryActions;
