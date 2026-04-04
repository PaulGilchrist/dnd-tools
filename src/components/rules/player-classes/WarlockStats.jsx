function WarlockStats({ class_specific }) {
    if (!class_specific) return null;

    const hasMysticAracanum = (
        class_specific.mystic_arcanum_level_6 > 0 || 
        class_specific.mystic_arcanum_level_7 > 0 || 
        class_specific.mystic_arcanum_level_8 > 0 || 
        class_specific.mystic_arcanum_level_9 > 0
    );

    if (!class_specific.invocations_known && !hasMysticAracanum) return null;

    return (
        <div>
            {class_specific.invocations_known > 0 && (
                <div>
                    <b>Invocations Known:</b>&nbsp;{class_specific.invocations_known}<br />
                </div>
            )}

            {hasMysticAracanum && (
                <div>
                    <b>Mystic Arcanum:</b><br />
                    {class_specific.mystic_arcanum_level_6 > 0 && (
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 6 = {class_specific.mystic_arcanum_level_6}<br /></div>
                    )}
                    {class_specific.mystic_arcanum_level_7 > 0 && (
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 7 = {class_specific.mystic_arcanum_level_7}<br /></div>
                    )}
                    {class_specific.mystic_arcanum_level_8 > 0 && (
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 8 = {class_specific.mystic_arcanum_level_8}<br /></div>
                    )}
                    {class_specific.mystic_arcanum_level_9 > 0 && (
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 9 = {class_specific.mystic_arcanum_level_9}<br /></div>
                    )}
                </div>
            )}
        </div>
    );
}

export default WarlockStats;
