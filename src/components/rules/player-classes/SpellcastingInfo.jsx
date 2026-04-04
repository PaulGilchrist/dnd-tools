function SpellcastingInfo({ spellcasting }) {
    if (!spellcasting) return null;

    const renderSpellSlots = () => {
        const slots = [];
        
        if (spellcasting.spell_slots_level_1 > 0) {
            slots.push(<div key="level1">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_1} of level 1</div>);
        }
        if (spellcasting.spell_slots_level_2 > 0) {
            slots.push(<div key="level2">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_2} of level 2</div>);
        }
        if (spellcasting.spell_slots_level_3 > 0) {
            slots.push(<div key="level3">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_3} of level 3</div>);
        }
        if (spellcasting.spell_slots_level_4 > 0) {
            slots.push(<div key="level4">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_4} of level 4</div>);
        }
        if (spellcasting.spell_slots_level_5 > 0) {
            slots.push(<div key="level5">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_5} of level 5</div>);
        }
        if (spellcasting.spell_slots_level_6 > 0) {
            slots.push(<div key="level6">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_6} of level 6</div>);
        }
        if (spellcasting.spell_slots_level_7 > 0) {
            slots.push(<div key="level7">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_7} of level 7</div>);
        }
        if (spellcasting.spell_slots_level_8 > 0) {
            slots.push(<div key="level8">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_8} of level 8</div>);
        }
        if (spellcasting.spell_slots_level_9 > 0) {
            slots.push(<div key="level9">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_9} of level 9</div>);
        }

        return slots;
    };

    return (
        <div>
            {spellcasting.cantrips_known > 0 && (
                <div>
                    <b>Cantrips Known:</b>&nbsp;{spellcasting.cantrips_known}<br />
                </div>
            )}

            {spellcasting.spells_known > 0 && (
                <div>
                    <b>Spells Known:</b>&nbsp;{spellcasting.spells_known}<br />
                </div>
            )}

            {renderSpellSlots().length > 0 && (
                <div>
                    <b>Spell Slots:</b><br />
                    {renderSpellSlots()}
                </div>
            )}
        </div>
    );
}

export default SpellcastingInfo;
