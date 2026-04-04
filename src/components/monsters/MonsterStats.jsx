function MonsterStats({ monster, handleImageClick }) {
    if (!monster) {
        return null;
    }

    return (
        <div className="stats">
            <div>
                <b>Armor Class:</b>&nbsp;{monster.armor_class}<br />
                <b>Hit Points:</b>&nbsp;{monster.hit_points}&nbsp;({monster.hit_dice})<br />
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
