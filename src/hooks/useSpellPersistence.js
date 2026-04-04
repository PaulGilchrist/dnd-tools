import { useState, useEffect } from 'react';

export function useSpellPersistence() {
    const [knownSpells, setKnownSpells] = useState([]);
    const [preparedSpells, setPreparedSpells] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const knownSpellsJson = localStorage.getItem('spellsKnown');
        if (knownSpellsJson) {
            setKnownSpells(JSON.parse(knownSpellsJson));
        }

        const preparedSpellsJson = localStorage.getItem('spellsPrepared');
        if (preparedSpellsJson) {
            setPreparedSpells(JSON.parse(preparedSpellsJson));
        }
    }, []);

    const saveKnown = (spellsList) => {
        const spellsKnown = spellsList
            .filter(spell => spell.known === true)
            .map(spell => spell.index);
        localStorage.setItem('spellsKnown', JSON.stringify(spellsKnown));
        return spellsKnown;
    };

    const savePrepared = (spellsList) => {
        const spellsPrepared = spellsList
            .filter(spell => spell.prepared === true)
            .map(spell => spell.index);
        localStorage.setItem('spellsPrepared', JSON.stringify(spellsPrepared));
        return spellsPrepared;
    };

    const updateKnown = (index, isKnown, currentSpells) => {
        let spellsKnown;
        if (isKnown) {
            spellsKnown = [...knownSpells, index];
        } else {
            spellsKnown = knownSpells.filter(i => i !== index);
        }
        localStorage.setItem('spellsKnown', JSON.stringify(spellsKnown));
        setKnownSpells(spellsKnown);
        return spellsKnown;
    };

    const updatePrepared = (index, isPrepared, currentSpells) => {
        let spellsPrepared;
        if (isPrepared) {
            spellsPrepared = [...preparedSpells, index];
        } else {
            spellsPrepared = preparedSpells.filter(i => i !== index);
        }
        localStorage.setItem('spellsPrepared', JSON.stringify(spellsPrepared));
        setPreparedSpells(spellsPrepared);
        return spellsPrepared;
    };

    const addKnown = (index) => {
        const spellsKnown = [...knownSpells, index];
        localStorage.setItem('spellsKnown', JSON.stringify(spellsKnown));
        setKnownSpells(spellsKnown);
    };

    const removeKnown = (index) => {
        const spellsKnown = knownSpells.filter(i => i !== index);
        localStorage.setItem('spellsKnown', JSON.stringify(spellsKnown));
        setKnownSpells(spellsKnown);
    };

    const addPrepared = (index) => {
        const spellsPrepared = [...preparedSpells, index];
        localStorage.setItem('spellsPrepared', JSON.stringify(spellsPrepared));
        setPreparedSpells(spellsPrepared);
    };

    const removePrepared = (index) => {
        const spellsPrepared = preparedSpells.filter(i => i !== index);
        localStorage.setItem('spellsPrepared', JSON.stringify(spellsPrepared));
        setPreparedSpells(spellsPrepared);
    };

    return {
        knownSpells,
        preparedSpells,
        saveKnown,
        savePrepared,
        updateKnown,
        updatePrepared,
        addKnown,
        removeKnown,
        addPrepared,
        removePrepared
    };
}
