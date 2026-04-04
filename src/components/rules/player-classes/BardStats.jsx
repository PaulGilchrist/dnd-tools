function BardStats({ class_specific }) {
    if (!class_specific) return null;

    return (
        <div>
            {class_specific.bardic_inspiration_die > 0 && (
                <div>
                    <b>Bardic Inspiration Die:</b>&nbsp;d{class_specific.bardic_inspiration_die}<br />
                </div>
            )}

            {class_specific.song_of_rest_die > 0 && (
                <div>
                    <b>Song of Rest Die:</b>&nbsp;d{class_specific.song_of_rest_die}<br />
                </div>
            )}

            {class_specific.magical_secrets_max_5 > 0 && (
                <div>
                    <b>Magical Secrets:</b><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{class_specific.magical_secrets_max_5} of level 5 or below<br />
                </div>
            )}

            {class_specific.magical_secrets_max_7 > 0 && (
                <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;{class_specific.magical_secrets_max_7} of level 7 or below<br />
                </div>
            )}

            {class_specific.magical_secrets_max_9 > 0 && (
                <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;{class_specific.magical_secrets_max_9} of level 9 or below<br />
                </div>
            )}
        </div>
    );
}

export default BardStats;
