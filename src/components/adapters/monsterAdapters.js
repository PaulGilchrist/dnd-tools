import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Normalize a 5e monster into a common data shape
 */
export function normalizeMonster5e(monster) {
    if (!monster) return null;

    // Extract ability scores and modifiers
    const abilityScores = {
        str: monster.strength,
        dex: monster.dexterity,
        con: monster.constitution,
        int: monster.intelligence,
        wis: monster.wisdom,
        cha: monster.charisma
    };

    const abilityScoreModifiers = getAbilityModifiers(
        monster.strength, monster.dexterity, monster.constitution,
        monster.intelligence, monster.wisdom, monster.charisma
    );

    // Extract saving throws and skills from proficiencies
    const { savingThrows, skills } = extractProficiencies(monster.proficiencies);

    // Normalize actions, traits, reactions, legendary actions
    const normalizedActions = normalizeActionsList(monster.actions, 'desc');
    const normalizedTraits = normalizeActionsList(monster.special_abilities, 'desc');
    const normalizedReactions = normalizeActionsList(monster.reactions, 'desc');
    const normalizedLegendaryActions = normalizeActionsList(monster.legendary_actions, 'desc');

    // Normalize lair actions (5e format)
    const lairActions = normalizeLairActions5e(monster.lair_actions);

    // Normalize senses
    const senses = normalizeSenses(monster.senses);

    // Normalize speed
    const speed = monster.speed || {};

    // Normalize immunities and resistances
    const immunities = monster.condition_immunities || [];
    const damageImmunities = monster.damage_immunities || [];
    const damageResistances = monster.damage_resistances || [];
    const damageVulnerabilities = monster.damage_vulnerabilities || [];

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
        armorClassDetails: null,
        hitPoints: monster.hit_points,
        hitDice: monster.hit_dice,
        initiativeDetails: null,
        speed: speed,

        // Abilities
        abilityScores,
        abilityScoreModifiers,

        // Defenses
        savingThrows,
        skills,
        senses,
        immunities,
        damageImmunities,
        damageResistances,
        damageVulnerabilities,
        conditionImmunities: monster.condition_immunities || [],
        languages: monster.languages,
        environments: monster.environments,
        allies: monster.allies,
        enemies: monster.enemies,
        challengeRating: monster.challenge_rating,
        xp: monster.xp,
        legendaryResistance: null,
        equipment: null,
        habitat: null,
        treasure: null,

        // Combat
        actions: normalizedActions,
        traits: normalizedTraits,
        reactions: normalizedReactions,
        legendaryActions: normalizedLegendaryActions,
        lairActions: lairActions,
        regionalEffects: monster.regional_effects,

        // Description
        desc: monster.desc,
        book: monster.book,
        page: monster.page,

        // Version metadata
        version: '5e'
    };
}

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
        desc: monster.desc,
        book: monster.book,
        page: monster.page,

        // Version metadata
        version: '2024'
    };
}

// ─── Helper Functions ───────────────────────────────────────────────

function getAbilityModifiers(str, dex, con, int, wis, cha) {
    const getModifier = (score) => Math.floor((score - 10) / 2);
    return {
        str: getModifier(str),
        dex: getModifier(dex),
        con: getModifier(con),
        int: getModifier(int),
        wis: getModifier(wis),
        cha: getModifier(cha)
    };
}

function extractProficiencies(proficiencies) {
    const savingThrows = {};
    const skills = {};

    if (proficiencies) {
        proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Saving Throw:')) {
                const abilityName = proficiency.name.substring(14, 17).toLowerCase();
                const abilityKey = abilityName === 'str' ? 'str' :
                                  abilityName === 'dex' ? 'dex' :
                                  abilityName === 'con' ? 'con' :
                                  abilityName === 'int' ? 'int' :
                                  abilityName === 'wis' ? 'wis' : 'cha';
                savingThrows[abilityKey] = { modifier: proficiency.value };
            } else if (proficiency.name.startsWith('Skill:')) {
                const skillName = proficiency.name.substring(7);
                skills[skillName] = { modifier: proficiency.value };
            }
        });
    }

    return { savingThrows, skills };
}

function normalizeActionsList(actions, descKey) {
    return (actions || []).map(action => ({
        name: action.name,
        description: action[descKey],
        usage: action.usage,
        renderDescription: () => renderHtmlContent(action[descKey])
    }));
}

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

function normalizeLairActions5e(lairActions) {
    const result = {};
    if (lairActions) {
        result.summary = lairActions.summary;
        result.actions = lairActions.actions || [];
        result.usage = lairActions.usage;
    }
    return result;
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

function normalizeSenses(senses) {
    const result = {};
    if (senses) {
        if (senses.blindsight) result.blindsight = senses.blindsight;
        if (senses.darkvision) result.darkvision = senses.darkvision;
        if (senses.passive_perception) result.passive_perception = senses.passive_perception;
        if (senses.tremorsense) result.tremorsense = senses.tremorsense;
        if (senses.truesight) result.truesight = senses.truesight;
    }
    return result;
}
