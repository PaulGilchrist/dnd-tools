function SorcererStats({ class_specific }) {
    if (!class_specific) return null;

    const renderSpellSlots = () => {
        if (!class_specific.creating_spell_slots || class_specific.creating_spell_slots.length === 0) {
            return null;
        }

        return class_specific.creating_spell_slots.map((spellSlot) => (
            <span key={spellSlot.spell_slot_level}>
                &nbsp;&nbsp;&nbsp;&nbsp;Level {spellSlot.spell_slot_level} Point Cost = {spellSlot.sorcery_point_cost}<br />
            </span>
        ));
    };

    return (
        <div>
            {class_specific.sorcery_points > 0 && (
                <div>
                    <b>Sorcery Points:</b>&nbsp;{class_specific.sorcery_points}<br />
                </div>
            )}

            {class_specific.metamagic_known > 0 && (
                <div>
                    <b>Metamagic Known:</b>&nbsp;{class_specific.metamagic_known}<br />
                </div>
            )}

            {class_specific.creating_spell_slots && class_specific.creating_spell_slots.length > 0 && (
                <div>
                    <b>Creating Spell Slots:</b><br />
                    {renderSpellSlots()}
                </div>
            )}
        </div>
    );
}

export default SorcererStats;
