import React from 'react';

/**
 * Generic component for rendering a single property from a level object.
 * Accepts a config object: { field: string, label: string, prefix: string, suffix: string }
 * Returns null if the field is missing/falsy, otherwise renders a formatted line.
 */
function SingleInfo({ level, config }) {
    if (!config || !level?.[config.field]) {
        return null;
    }
    return (
        <div>
            <b>{config.label}:</b>&nbsp;
            {config.prefix && <span>{config.prefix}</span>}
            {level[config.field]}
            {config.suffix && <span>{config.suffix}</span>}
        </div>
    );
}

/**
 * Generic component for rendering multiple properties from a level object.
 * Accepts a config object: { fields: Array<{field: string, label: string, prefix: string, suffix: string}>, className: string }
 * Returns null if no fields are present, otherwise renders a <div> with all present fields.
 */
function ClassInfo({ level, config }) {
    if (!config?.fields?.length) {
        return null;
    }

    const parts = config.fields
        .filter(f => level?.[f.field])
        .map((f) => (
            <div key={f.field}>
                <b>{f.label}:</b>&nbsp;
                {f.prefix && <span>{f.prefix}</span>}
                {level[f.field]}
                {f.suffix && <span>{f.suffix}</span>}
            </div>
        ));

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Generic component for rendering spell slots by level.
 * Accepts a config object: { maxLevel: number }
 * Renders cantrips known, prepared spells, and spell slots for each level.
 */
function SpellSlotsInfo({ spellcasting, config }) {
    if (!config?.maxLevel) {
        return null;
    }

    const slots = [];
    for (let level = 1; level <= config.maxLevel; level++) {
        const slotKey = `spell_slots_level_${level}`;
        const slotValue = spellcasting[slotKey];
        if (slotValue > 0) {
            slots.push(
                <div key={level}>
                    &nbsp;&nbsp;&nbsp;&nbsp;{slotValue} of level {level}
                </div>
            );
        }
    }

    return (
        <div className="playerClass-margin-bottom-small">
            {spellcasting.cantrips_known > 0 && (
                <div>
                    <b>Cantrips Known:</b>&nbsp;{spellcasting.cantrips_known}<br />
                </div>
            )}

            {spellcasting.prepared_spells > 0 && (
                <div>
                    <b>Prepared Spells:</b>&nbsp;{spellcasting.prepared_spells}<br />
                </div>
            )}

            {slots.length > 0 && (
                <div>
                    <b>Spell Slots:</b><br />
                    {slots}
                </div>
            )}
        </div>
    );
}

export { SingleInfo, ClassInfo, SpellSlotsInfo };
