function PaladinStats({ class_specific }) {
    if (!class_specific || class_specific.aura_range <= 0) return null;

    return (
        <div>
            <b>Aura Range:</b>&nbsp;{class_specific.aura_range}<br />
        </div>
    );
}

export default PaladinStats;
