import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Normalize a 5e monster into a common data shape
 */
export function normalizeMonster5e(monster) {
    if (!monster) return null;

    // Extract ability scores
    const abilityScores = {
        str: monster.strength,
        dex: monster.dexterity,
        con: monster.constitution,
        int: monster.intelligence,
        wis: monster.wisdom,
        cha: monster.charisma
    };

    const getAbilityModifier = (score) => Math.floor((score - 10) / 2);
    const abilityScoreModifiers = {
        str: getAbilityModifier(monster.strength),
        dex: getAbilityModifier(monster.dexterity),
        con: getAbilityModifier(monster.constitution),
        int: getAbilityModifier(monster.intelligence),
        wis: getAbilityModifier(monster.wisdom),
        cha: getAbilityModifier(monster.charisma)
    };

    // Extract saving throws from proficiencies
    const savingThrows = {};
    if (monster.proficiencies) {
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Saving Throw:')) {
                const abilityName = proficiency.name.substring(14, 17).toLowerCase();
                const abilityKey = abilityName === 'str' ? 'str' :
                                  abilityName === 'dex' ? 'dex' :
                                  abilityName === 'con' ? 'con' :
                                  abilityName === 'int' ? 'int' :
                                  abilityName === 'wis' ? 'wis' : 'cha';
                savingThrows[abilityKey] = {
                    modifier: proficiency.value
                };
            }
        });
    }

    // Extract skills from proficiencies
    const skills = {};
    if (monster.proficiencies) {
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Skill:')) {
                const skillName = proficiency.name.substring(7);
                skills[skillName] = {
                    modifier: proficiency.value
                };
            }
        });
    }

    // Normalize actions
    const actions = monster.actions || [];
    const normalizedActions = actions.map(action => ({
        name: action.name,
        description: action.desc,
        usage: action.usage,
        renderDescription: () => renderHtmlContent(action.desc)
    }));

    // Normalize special abilities (traits)
    const traits = monster.special_abilities || [];
    const normalizedTraits = traits.map(trait => ({
        name: trait.name,
        description: trait.desc,
        renderDescription: () => renderHtmlContent(trait.desc)
    }));

    // Normalize reactions
    const reactions = monster.reactions || [];
    const normalizedReactions = reactions.map(reaction => ({
        name: reaction.name,
        description: reaction.desc,
        renderDescription: () => renderHtmlContent(reaction.desc)
    }));

    // Normalize legendary actions
    const legendaryActions = monster.legendary_actions || [];
    const normalizedLegendaryActions = legendaryActions.map(action => ({
        name: action.name,
        description: action.desc,
        renderDescription: () => renderHtmlContent(action.desc)
    }));

    // Normalize lair actions
    // 5e lair_actions is an object with summary, actions (array of HTML strings), and usage
    const lairActions = {};
    if (monster.lair_actions) {
       lairActions.summary = monster.lair_actions.summary;
       lairActions.actions = monster.lair_actions.actions || [];
       lairActions.usage = monster.lair_actions.usage;
    }

    // Normalize senses
    const senses = {};
    if (monster.senses) {
        if (monster.senses.blindsight) senses.blindsight = monster.senses.blindsight;
        if (monster.senses.darkvision) senses.darkvision = monster.senses.darkvision;
        if (monster.senses.passive_perception) senses.passive_perception = monster.senses.passive_perception;
        if (monster.senses.tremorsense) senses.tremorsense = monster.senses.tremorsense;
        if (monster.senses.truesight) senses.truesight = monster.senses.truesight;
    }

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

    // Extract saving throws
    const savingThrows = monster.saving_throws || {};

    // Extract skills
    const skills = monster.skills || {};

    // Normalize actions
    const actions = monster.actions || [];
    const normalizedActions = actions.map(action => ({
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

    // Normalize traits
    const traits = monster.traits || [];
    const normalizedTraits = traits.map(trait => ({
        name: trait.name,
        description: trait.description,
        renderDescription: () => renderHtmlContent(trait.description)
    }));

    // Normalize reactions
    const reactions = monster.reactions || [];
    const normalizedReactions = reactions.map(reaction => ({
        name: reaction.name,
        description: reaction.description,
        renderDescription: () => renderHtmlContent(reaction.description)
    }));

    // Normalize legendary actions
    const legendaryActions = monster.legendary_actions || [];
    const normalizedLegendaryActions = legendaryActions.map(action => ({
        name: action.name,
        description: action.description,
        renderDescription: () => renderHtmlContent(action.description)
    }));

    // Normalize lair actions
     // 2024 lair_actions might be an array, object, or undefined
    const lairActions = {};
    if (monster.lair_actions) {
       if (Array.isArray(monster.lair_actions)) {
           lairActions.summary = null;
           lairActions.actions = monster.lair_actions.map(action => {
               if (typeof action === 'string') {
                   return action;
               } else if (action && typeof action === 'object') {
                   return action.description || '';
               }
               return '';
           });
           lairActions.usage = null;
       } else if (typeof monster.lair_actions === 'object') {
           // Handle object format similar to 5e
           lairActions.summary = monster.lair_actions.summary || null;
           lairActions.actions = monster.lair_actions.actions || [];
           lairActions.usage = monster.lair_actions.usage || null;
       } else {
           // Handle string format
           lairActions.summary = null;
           lairActions.actions = [monster.lair_actions];
           lairActions.usage = null;
       }
    }

    // Normalize senses
    const senses = monster.senses || {};

    // Normalize speed
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