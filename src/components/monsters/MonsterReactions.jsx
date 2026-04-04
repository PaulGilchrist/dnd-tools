import { getNameString } from '../../utils/monsterUtils';

function MonsterReactions({ monster }) {
    if (!monster || !monster.reactions) {
        return null;
    }

    return (
        <div className="removeExtraLine">
            {monster.reactions.map((reaction, index) => (
                <span key={index}>
                    <b>{reaction.name}:</b>&nbsp;{reaction.desc}<br /><br />
                </span>
            ))}
        </div>
    );
}

export default MonsterReactions;
