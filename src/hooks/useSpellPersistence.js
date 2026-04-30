import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

export function useSpellPersistence() {
    const [knownSpells, setKnownSpells] = useState([]);
    const [preparedSpells, setPreparedSpells] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const knownSpellsJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_KNOWN);
        if (knownSpellsJson) {
            setKnownSpells(knownSpellsJson);
          }

        const preparedSpellsJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_PREPARED);
        if (preparedSpellsJson) {
            setPreparedSpells(preparedSpellsJson);
          }
      }, []);

    const saveKnown = (spellsList) => {
        const spellsKnown = spellsList
             .filter(spell => spell.known === true)
             .map(spell => spell.index);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_KNOWN, spellsKnown);
        return spellsKnown;
    };

    const savePrepared = (spellsList) => {
        const spellsPrepared = spellsList
             .filter(spell => spell.prepared === true)
             .map(spell => spell.index);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_PREPARED, spellsPrepared);
        return spellsPrepared;
    };

    const updateKnown = (index, isKnown, currentSpells) => {
        let spellsKnown;
        if (isKnown) {
            spellsKnown = [...knownSpells, index];
        } else {
            spellsKnown = knownSpells.filter(i => i !== index);
          }
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_KNOWN, spellsKnown);
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
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_PREPARED, spellsPrepared);
        setPreparedSpells(spellsPrepared);
        return spellsPrepared;
    };

    const addKnown = (index) => {
        const spellsKnown = [...knownSpells, index];
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_KNOWN, spellsKnown);
        setKnownSpells(spellsKnown);
    };

    const removeKnown = (index) => {
        const spellsKnown = knownSpells.filter(i => i !== index);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_KNOWN, spellsKnown);
        setKnownSpells(spellsKnown);
    };

    const addPrepared = (index) => {
        const spellsPrepared = [...preparedSpells, index];
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_PREPARED, spellsPrepared);
        setPreparedSpells(spellsPrepared);
    };

    const removePrepared = (index) => {
        const spellsPrepared = preparedSpells.filter(i => i !== index);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELLS_PREPARED, spellsPrepared);
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
