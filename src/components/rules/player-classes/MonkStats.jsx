function MonkStats({ class_specific }) {
    if (!class_specific) return null;

    return (
        <div>
            {class_specific.martial_arts && (
                <div>
                    <b>Martial Arts:</b>&nbsp;{class_specific.martial_arts.dice_count}d{class_specific.martial_arts.dice_value}<br />
                </div>
            )}

            {class_specific.ki_points > 0 && (
                <div>
                    <b>Ki Points:</b>&nbsp;{class_specific.ki_points}<br />
                </div>
            )}

            {class_specific.unarmored_movement > 0 && (
                <div>
                    <b>Unarmored Movement:</b>&nbsp;{class_specific.unarmored_movement}<br />
                </div>
            )}
        </div>
    );
}

export default MonkStats;
