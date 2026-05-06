import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, getVersionedStorageKey } from '../utils/localStorage';

export function useSpellPersistence({ ruleVersion } = {}) {
    const version = ruleVersion || '5e';
    const knownKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.SPELLS_KNOWN, version);
    const preparedKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.SPELLS_PREPARED, version);

    const [knownSpells, setKnownSpells] = useState(() => getLocalStorageItem(knownKey) || []);
    const [preparedSpells, setPreparedSpells] = useState(() => getLocalStorageItem(preparedKey) || []);

    // Reload from localStorage when version changes
    useEffect(() => {
        setKnownSpells(getLocalStorageItem(knownKey) || []);
        setPreparedSpells(getLocalStorageItem(preparedKey) || []);
    }, [knownKey, preparedKey]);

    const saveKnown = (spellsList) => {
        const spellsKnown = spellsList
             .filter(spell => spell.known === true)
             .map(spell => spell.index);
        setLocalStorageItem(knownKey, spellsKnown);
        return spellsKnown;
    };

    const savePrepared = (spellsList) => {
        const spellsPrepared = spellsList
             .filter(spell => spell.prepared === true)
             .map(spell => spell.index);
        setLocalStorageItem(preparedKey, spellsPrepared);
        return spellsPrepared;
    };

    const updateKnown = (index, isKnown) => {
        let spellsKnown;
        if (isKnown) {
            spellsKnown = knownSpells.includes(index) ? knownSpells : [...knownSpells, index];
        } else {
            spellsKnown = knownSpells.filter(i => i !== index);
          }
        setLocalStorageItem(knownKey, spellsKnown);
        setKnownSpells(spellsKnown);
        return spellsKnown;
    };

    const updatePrepared = (index, isPrepared) => {
        let spellsPrepared;
        if (isPrepared) {
            spellsPrepared = preparedSpells.includes(index) ? preparedSpells : [...preparedSpells, index];
        } else {
            spellsPrepared = preparedSpells.filter(i => i !== index);
          }
        setLocalStorageItem(preparedKey, spellsPrepared);
        setPreparedSpells(spellsPrepared);
        return spellsPrepared;
    };

    const addKnown = (index) => {
        if (knownSpells.includes(index)) return;
        const spellsKnown = [...knownSpells, index];
        setLocalStorageItem(knownKey, spellsKnown);
        setKnownSpells(spellsKnown);
    };

    const removeKnown = (index) => {
        const spellsKnown = knownSpells.filter(i => i !== index);
        setLocalStorageItem(knownKey, spellsKnown);
        setKnownSpells(spellsKnown);
    };

    const addPrepared = (index) => {
        if (preparedSpells.includes(index)) return;
        const spellsPrepared = [...preparedSpells, index];
        setLocalStorageItem(preparedKey, spellsPrepared);
        setPreparedSpells(spellsPrepared);
    };

    const removePrepared = (index) => {
        const spellsPrepared = preparedSpells.filter(i => i !== index);
        setLocalStorageItem(preparedKey, spellsPrepared);
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
