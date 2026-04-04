export function useSpellFilter(filter, spell) {
    // Casting Time filter
    if (filter.castingTime !== 'All' && (
        (filter.castingTime === 'Action' && !(spell.casting_time === '1 action')) ||
        (filter.castingTime === 'Bonus Action' && !(spell.casting_time === '1 bonus action')) ||
        (filter.castingTime === 'Non-Ritual, Long Cast Time' && 
            !(spell.ritual || spell.casting_time === '1 action' || spell.casting_time === '1 bonus action' || spell.casting_time === '1 reaction')) ||
        (filter.castingTime === 'Reaction' && !(spell.casting_time === '1 reaction')) ||
        (filter.castingTime === 'Ritual' && !spell.ritual)
    )) {
        return false;
    }

    // Class filter
    if (filter.class !== 'All' && !spell.classes.some(c => c === filter.class)) {
        return false;
    }

    // Level filter
    if (spell.level < filter.levelMin || spell.level > filter.levelMax) {
        return false;
    }

    // Name filter
    if (filter.name !== '' && !spell.name.toLowerCase().includes(filter.name.toLowerCase())) {
        return false;
    }

    // Status filter
    if (filter.status !== 'All' && (
        (filter.status === 'Known' && !spell.known) ||
        (filter.status === 'Prepared or Known Ritual' && (!spell.known || (!spell.prepared && !spell.ritual)))
    )) {
        return false;
    }

    return true;
}
