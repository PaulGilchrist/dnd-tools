import { useState } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, getVersionedStorageKey } from '../utils/localStorage';

export function useSpellPersistence({ ruleVersion } = {}) {
    const version = ruleVersion || '5e';
    const knownKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.SPELLS_KNOWN, version);
    const preparedKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.SPELLS_PREPARED, version);

    const [knownSpells] = useState(() => getLocalStorageItem(knownKey) || []);
    const [preparedSpells] = useState(() => getLocalStorageItem(preparedKey) || []);

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
        return spellsKnown;
    };

    const updatePrepared = (index, isPrepared) => {
        let spellsPrepared;
        if (isPrepared) {
            spellsPrepared = preparedSpells.includes(index) ? spellsPrepared : [...spellsPrepared, index];
        } else {
            spellsPrepared = spellsPrepared.filter(i => i !== index);
          }
        setLocalStorageItem(preparedKey, spellsPrepared);
        return spellsPrepared;
    };

    const addKnown = (index) => {
        if (knownSpells.includes(index)) return;
        const spellsKnown = [...knownSpells, index];
        setLocalStorageItem(knownKey, spellsKnown);
        return spellsKnown;
    };

    const removeKnown = (index) => {
        const spellsKnown = knownSpells.filter(i => i !== index);
        setLocalStorageItem(knownKey, spellsKnown);
        return spellsKnown;
    };

    const addPrepared = (index) => {
        if (preparedSpells.includes(index)) return;
        const spellsPrepared = [...spellsPrepared, index];
        setLocalStorageItem(preparedKey, spellsPrepared);
        return spellsPrepared;
    };

    const removePrepared = (index) => {
        const spellsPrepared = spellsPrepared.filter(i => i !== index);
        setLocalStorageItem(preparedKey, spellsPrepared);
        return spellsPrepared;
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
