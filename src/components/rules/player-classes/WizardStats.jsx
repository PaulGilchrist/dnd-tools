function WizardStats({ class_specific }) {
    if (!class_specific || class_specific.arcane_recovery_levels <= 0) return null;

    return (
        <div>
            <b>Arcane Recovery Levels:</b>&nbsp;{class_specific.arcane_recovery_levels}<br />
        </div>
    );
}

export default WizardStats;
