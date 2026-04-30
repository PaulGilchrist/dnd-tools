/**
 * Common MonsterStats component - Displays basic monster statistics
 * Works with normalized monster data from both 5e and 2024 versions
 * @param {object} monster - The normalized monster data object
 * @param {function} handleImageClick - Callback to open image modal
 */
function MonsterStats({ monster, handleImageClick }) {
    if (!monster) {
        return null;
    }

    return (
        <div className="stats">
            <div>
                <b>Armor Class:</b>&nbsp;{monster.armorClass}
                {monster.armorClassDetails && <span>({monster.armorClassDetails})</span>}<br />
                <b>Hit Points:</b>&nbsp;{monster.hitPoints}&nbsp;({monster.hitDice})<br />
                {monster.initiativeDetails && (
                    <>
                        <b>Initiative:</b>&nbsp;{monster.initiativeDetails}<br />
                    </>
                )}
                <b>Speed:</b>&nbsp;{monster.speed?.walk ? monster.speed.walk : '0 ft.'}
                {monster.speed?.burrow && (
                    <span>, burrow {monster.speed.burrow}</span>
                )}
                {monster.speed?.climb && (
                    <span>, climb {monster.speed.climb}</span>
                )}
                {monster.speed?.fly && (
                    <span>, fly {monster.speed.fly}</span>
                )}
                {monster.speed?.hover && (
                    <span> (hover)</span>
                )}
                {monster.speed?.swim && (
                    <span>, swim {monster.speed.swim}</span>
                )}
                {monster.speed?.other && monster.speed.other.length > 0 && (
                    <span>, {monster.speed.other.join(', ')}</span>
                )}<br />
            </div>
            <div>
                {monster.image && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleImageClick}
                    >
                        Image
                    </button>
                )}
            </div>
        </div>
    );
}

export default MonsterStats;