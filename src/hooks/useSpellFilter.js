export function filterSpells(filter, spell) {
    // Casting Time filter
    if (filter.castingTime !== 'All') {
        const ct = (spell.casting_time || '').toString().toLowerCase().trim();
        const isRitual = spell.ritual === true;
        let matches = false;
        
        switch (filter.castingTime) {
            case 'Action':
                // Matches "1 action" (5e) or "Action" (2024)
                matches = ct === '1 action' || ct === 'action';
                break;
            case 'Bonus Action':
                // Matches "1 bonus action" (5e) or "Bonus Action" (2024)
                matches = ct === '1 bonus action' || ct === 'bonus action';
                break;
            case 'Reaction':
                // Matches "1 reaction" (5e) or "Reaction" (2024)
                matches = ct === '1 reaction' || ct === 'reaction';
                break;
            case 'Ritual':
                matches = isRitual;
                break;
            case 'Non-Ritual, Long Cast Time': {
                // Not a ritual AND not a standard quick casting time
                // 5e: "1 action", "1 bonus action", "1 reaction"
                // 2024: "Action", "Bonus Action", "Reaction"
                const isQuick = ct === '1 action' || ct === 'action' || 
                    ct === '1 bonus action' || ct === 'bonus action' ||
                    ct === '1 reaction' || ct === 'reaction';
                matches = !isRitual && !isQuick;
                break;
            }
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
