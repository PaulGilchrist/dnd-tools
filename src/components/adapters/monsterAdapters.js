import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Normalize a 2024 monster into a common data shape
 */
export function normalizeMonster2024(monster) {
    if (!monster) return null;

    // Extract saving throws and skills
    const savingThrows = monster.saving_throws || {};
    const skills = monster.skills || {};

    // Normalize actions, traits, reactions, legendary actions
    const normalizedActions = normalizeActionsList2024(monster.actions);
    const normalizedTraits = normalizeActionsList2024(monster.traits);
    const normalizedReactions = normalizeActionsList2024(monster.reactions);
    const normalizedLegendaryActions = normalizeActionsList2024(monster.legendary_actions);

    // Normalize lair actions (2024 format)
    const lairActions = normalizeLairActions2024(monster.lair_actions);

    // Normalize senses and speed
    const senses = monster.senses || {};
    const speed = monster.speed || {};

    return {
        // Basic info
        index: monster.index,
        name: monster.name,
        size: monster.size,
        type: monster.type,
        subtype: monster.subtype,
        alignment: monster.alignment,
        image: monster.image,
        bookmarked: monster.bookmarked,

        // Stats
        armorClass: monster.armor_class,
        armorClassDetails: monster.armor_class_details,
        hitPoints: monster.hit_points,
        hitDice: monster.hit_dice,
        initiativeDetails: monster.initiative_details,
        speed: speed,

        // Abilities
        abilityScores: monster.ability_scores,
        abilityScoreModifiers: monster.ability_score_modifiers,

        // Defenses
        savingThrows,
        skills,
        senses,
        immunities: monster.immunities || [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
        conditionImmunities: [],
        languages: monster.languages,
        environments: null,
        allies: null,
        enemies: null,
        challengeRating: monster.challenge_rating,
        xp: monster.xp,
        legendaryResistance: monster.legendary_resistance,
        equipment: monster.equipment,
        habitat: monster.habitat,
        treasure: monster.treasure,

        // Combat
        actions: normalizedActions,
        traits: normalizedTraits,
        reactions: normalizedReactions,
        legendaryActions: normalizedLegendaryActions,
        lairActions: lairActions,
        regionalEffects: monster.regional_effects,

        // Description
        description: monster.description,
        book: monster.book,
        page: monster.page,

        // Version metadata
        version: '2024'
    };
}

// ─── Helper Functions ───────────────────────────────────────────────

function normalizeActionsList2024(actions) {
    return (actions || []).map(action => ({
        name: action.name,
        description: action.description,
        recharge: action.recharge,
        attackBonus: action.attack_bonus,
        damageDice: action.damage_dice,
        damage: action.damage,
        saveDc: action.save_dc,
        saveType: action.save_type,
        saveEffect: action.save_effect,
        renderDescription: () => renderHtmlContent(action.description)
    }));
}

function normalizeLairActions2024(lairActions) {
    const result = {};
    if (lairActions) {
        if (Array.isArray(lairActions)) {
            result.summary = null;
            result.actions = lairActions.map(action => {
                if (typeof action === 'string') return action;
                if (action && typeof action === 'object') return action.description || '';
                return '';
            });
            result.usage = null;
        } else if (typeof lairActions === 'object') {
            result.summary = lairActions.summary || null;
            result.actions = lairActions.actions || [];
            result.usage = lairActions.usage || null;
        } else {
            result.summary = null;
            result.actions = [lairActions];
            result.usage = null;
        }
    }
    return result;
}
