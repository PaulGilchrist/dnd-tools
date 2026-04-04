function BarbarianStats({ class_specific }) {
    if (!class_specific) return null;

    return (
        <div>
            {class_specific.rage_count > 0 && (
                <div>
                    <b>Rage Count:</b>&nbsp;{class_specific.rage_count}<br />
                </div>
            )}

            {class_specific.rage_damage_bonus > 0 && (
                <div>
                    <b>Rage Damage Bonus:</b>&nbsp;{class_specific.rage_damage_bonus}<br />
                </div>
            )}

            {class_specific.brutal_critical_dice > 0 && (
                <div>
                    <b>Brutal Critical Dice:</b>&nbsp;{class_specific.brutal_critical_dice}<br />
                </div>
            )}
        </div>
    );
}

export default BarbarianStats;
