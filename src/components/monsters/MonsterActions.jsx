import { getNameString } from '../../utils/monsterUtils';
import { renderHtmlContent } from '../../utils/htmlUtils';

function MonsterActions({ monster }) {
    if (!monster || !monster.actions) {
        return null;
    }

    return (
        <div>
            {monster.actions.map((action, index) => (
                <div key={index}>
                    <b>
                        {action.name}
                        {action.usage && action.usage.type === 'recharge on roll' && (
                            <span>&nbsp;(Recharge {action.usage.min_value}-6)</span>
                        )}
                        {action.usage && action.usage.type === 'per day' && (
                            <span>&nbsp;({action.usage.times}/Day)</span>
                        )}:
                    </b>&nbsp;
                    <span dangerouslySetInnerHTML={renderHtmlContent(action.desc)} />
                    <br /><br />
                </div>
            ))}
        </div>
    );
}

export default MonsterActions;
