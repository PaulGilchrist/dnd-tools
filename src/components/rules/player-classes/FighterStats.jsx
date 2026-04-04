function FighterStats({ class_specific }) {
    if (!class_specific) return null;

    return (
        <div>
            {class_specific.action_surges > 0 && (
                <div>
                    <b>Action Surges:</b>&nbsp;{class_specific.action_surges}<br />
                </div>
            )}

            {class_specific.indomitable_uses > 0 && (
                <div>
                    <b>Indomitable Uses:</b>&nbsp;{class_specific.indomitable_uses}<br />
                </div>
            )}

            {class_specific.extra_attacks > 0 && (
                <div>
                    <b>Extra Attacks:</b>&nbsp;{class_specific.extra_attacks}<br />
                </div>
            )}
        </div>
    );
}

export default FighterStats;
