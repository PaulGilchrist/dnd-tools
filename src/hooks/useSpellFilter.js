export function filterSpells(filter, spell) {
    // Casting Time filter
    if (filter.castingTime !== 'All') {
        const ct = (spell.casting_time || '').toString().toLowerCase().trim();
        const isRitual = spell.ritual === true;
        let matches = false;
        
        switch (filter.castingTime) {
            case 'Action':
                matches = ct === '1 action';
                break;
            case 'Bonus Action':
                matches = ct === '1 bonus action';
                break;
            case 'Reaction':
                matches = ct === '1 reaction';
                break;
            case 'Ritual':
                matches = isRitual;
                break;
            case 'Non-Ritual, Long Cast Time':
                // Not a ritual AND not a standard quick casting time
                matches = !isRitual && ct !== '1 action' && ct !== '1 bonus action' && ct !== '1 reaction';
                break;
            default:
                matches = false;
        }
        
        if (!matches) return false;
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
