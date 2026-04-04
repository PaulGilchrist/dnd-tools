function RangerStats({ class_specific }) {
    if (!class_specific) return null;

    return (
        <div>
            {class_specific.favored_enemies > 0 && (
                <div>
                    <b>Favored Enemies:</b>&nbsp;{class_specific.favored_enemies}<br />
                </div>
            )}

            {class_specific.favored_terrain > 0 && (
                <div>
                    <b>Favored Terrain:</b>&nbsp;{class_specific.favored_terrain}<br />
                </div>
            )}
        </div>
    );
}

export default RangerStats;
