function ClericStats({ class_specific }) {
    if (!class_specific) return null;

    return (
        <div>
            {class_specific.channel_divinity_charges > 0 && (
                <div>
                    <b>Channel Divinity Charges:</b>&nbsp;{class_specific.channel_divinity_charges}<br />
                </div>
            )}

            {class_specific.destroy_undead_cr > 0 && (
                <div>
                    <b>Destroy Undead CR:</b>&nbsp;{class_specific.destroy_undead_cr}<br />
                </div>
            )}
        </div>
    );
}

export default ClericStats;
