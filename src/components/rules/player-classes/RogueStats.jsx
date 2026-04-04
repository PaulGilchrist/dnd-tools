function RogueStats({ class_specific }) {
    if (!class_specific || !class_specific.sneak_attack) return null;

    return (
        <div>
            <b>Sneak Attack:</b>&nbsp;{class_specific.sneak_attack.dice_count}d{class_specific.sneak_attack.dice_value}<br />
        </div>
    );
}

export default RogueStats;
