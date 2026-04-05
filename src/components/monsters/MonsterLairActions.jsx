import { getNameString } from '../../utils/monsterUtils';

function MonsterLairActions({ monster }) {
    if (!monster || !monster.lair_actions) {
        return null;
    }

    return (
        <div>
            {monster.lair_actions.summary}<br />
            <ul>
                {monster.lair_actions.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                ))}
            </ul>
            {monster.lair_actions.usage && (
                <div>{monster.lair_actions.usage}<br /></div>
            )}
        </div>
    );
}

export default MonsterLairActions;
