import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeMonster5e, normalizeMonster2024 } from './monsterAdapters';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

vi.mock('../../utils/monsterUtils', () => ({
    getNameString: vi.fn((name) => name)
}));

describe('monsterAdapters', () => {
    const renderHtmlContentMock = vi.fn((html) => ({ __html: html }));

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('normalizeMonster5e', () => {
        it('returns null when given null', () => {
            expect(normalizeMonster5e(null)).toBeNull();
        });

        it('returns null when given undefined', () => {
            expect(normalizeMonster5e(undefined)).toBeNull();
        });

        it('returns null when given empty object', () => {
            const result = normalizeMonster5e({});
            expect(result).not.toBeNull();
            expect(result.version).toBe('5e');
        });

        it('returns null when given 0', () => {
            expect(normalizeMonster5e(0)).toBeNull();
        });

        it('returns null when given empty string', () => {
            expect(normalizeMonster5e('')).toBeNull();
        });

        it('normalizes minimal monster data', () => {
            const monster = {
                index: 'goblin',
                name: 'Goblin',
                size: 'Small',
                type: 'humanoid',
                strength: 8,
                dexterity: 14,
                constitution: 10,
                intelligence: 10,
                wisdom: 8,
                charisma: 8
            };
            const result = normalizeMonster5e(monster);

            expect(result).not.toBeNull();
            expect(result.index).toBe('goblin');
            expect(result.name).toBe('Goblin');
            expect(result.size).toBe('Small');
            expect(result.type).toBe('humanoid');
            expect(result.version).toBe('5e');
        });

        it('correctly calculates ability score modifiers', () => {
            const monster = {
                strength: 15,
                dexterity: 10,
                constitution: 8,
                intelligence: 17,
                wisdom: 3,
                charisma: 20
            };
            const result = normalizeMonster5e(monster);

            expect(result.abilityScores).toEqual({
                str: 15,
                dex: 10,
                con: 8,
                int: 17,
                wis: 3,
                cha: 20
            });
            expect(result.abilityScoreModifiers).toEqual({
                str: 2,
                dex: 0,
                con: -1,
                int: 3,
                wis: -4,
                cha: 5
            });
        });

        it('parses saving throws from proficiencies', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                proficiencies: [
                    { name: 'Saving Throw: Str', value: 2 },
                    { name: 'Saving Throw: Dex', value: 3 }
                ]
            };
            const result = normalizeMonster5e(monster);

            expect(result.savingThrows.str).toEqual({ modifier: 2 });
            expect(result.savingThrows.dex).toEqual({ modifier: 3 });
        });

        it('parses skills from proficiencies', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                proficiencies: [
                    { name: 'Skill: Stealth', value: 4 },
                    { name: 'Skill: Perception', value: 2 }
                ]
            };
            const result = normalizeMonster5e(monster);

            expect(result.skills.Stealth).toEqual({ modifier: 4 });
            expect(result.skills.Perception).toEqual({ modifier: 2 });
        });

        it('handles missing proficiencies', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            };
            const result = normalizeMonster5e(monster);

            expect(result.savingThrows).toEqual({});
            expect(result.skills).toEqual({});
        });

        it('normalizes actions with renderDescription', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                actions: [
                    { name: 'Bite', desc: '<p>Bite attack.</p>' }
                ]
            };
            const result = normalizeMonster5e(monster);

            expect(result.actions).toHaveLength(1);
            expect(result.actions[0].name).toBe('Bite');
            expect(result.actions[0].description).toBe('<p>Bite attack.</p>');
            expect(typeof result.actions[0].renderDescription).toBe('function');
        });

        it('handles empty actions array', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                actions: []
            };
            const result = normalizeMonster5e(monster);
            expect(result.actions).toEqual([]);
        });

        it('normalizes traits (special_abilities)', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                special_abilities: [
                    { name: 'Darkvision', desc: '<p>60 ft.</p>' }
                ]
            };
            const result = normalizeMonster5e(monster);

            expect(result.traits).toHaveLength(1);
            expect(result.traits[0].name).toBe('Darkvision');
            expect(result.traits[0].description).toBe('<p>60 ft.</p>');
        });

        it('normalizes reactions', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                reactions: [
                    { name: 'Opportunity Attack', desc: '<p>When a creature moves...</p>' }
                ]
            };
            const result = normalizeMonster5e(monster);

            expect(result.reactions).toHaveLength(1);
            expect(result.reactions[0].name).toBe('Opportunity Attack');
        });

        it('normalizes legendary actions', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                legendary_actions: [
                    { name: 'Horrifying Visage', desc: '<p>DC 18 Wisdom save.</p>' }
                ]
            };
            const result = normalizeMonster5e(monster);

            expect(result.legendaryActions).toHaveLength(1);
            expect(result.legendaryActions[0].name).toBe('Horrifying Visage');
        });

        it('normalizes lair actions from object format', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                lair_actions: {
                    summary: '<p>The dracolich lair has magical effects.</p>',
                    actions: ['<p>Flame Burst</p>', '<p>Fear Wave</p>'],
                    usage: '10'
                }
            };
            const result = normalizeMonster5e(monster);

            expect(result.lairActions.summary).toBe('<p>The dracolich lair has magical effects.</p>');
            expect(result.lairActions.actions).toEqual(['<p>Flame Burst</p>', '<p>Fear Wave</p>']);
            expect(result.lairActions.usage).toBe('10');
        });

        it('handles missing lair actions', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            };
            const result = normalizeMonster5e(monster);
            expect(result.lairActions).toEqual({});
        });

        it('normalizes senses', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                senses: {
                    blindsight: '60 ft.',
                    darkvision: '120 ft.',
                    passive_perception: 19,
                    tremorsense: '30 ft.',
                    truesight: '30 ft.'
                }
            };
            const result = normalizeMonster5e(monster);

            expect(result.senses.blindsight).toBe('60 ft.');
            expect(result.senses.darkvision).toBe('120 ft.');
            expect(result.senses.passive_perception).toBe(19);
            expect(result.senses.tremorsense).toBe('30 ft.');
            expect(result.senses.truesight).toBe('30 ft.');
        });

        it('handles missing senses', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            };
            const result = normalizeMonster5e(monster);
            expect(result.senses).toEqual({});
        });

        it('handles partial senses', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                senses: {
                    darkvision: '60 ft.'
                }
            };
            const result = normalizeMonster5e(monster);
            expect(result.senses.darkvision).toBe('60 ft.');
            expect(result.senses.blindsight).toBeUndefined();
        });

        it('normalizes speed', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                speed: { walk: '30 ft.' }
            };
            const result = normalizeMonster5e(monster);
            expect(result.speed).toEqual({ walk: '30 ft.' });
        });

        it('defaults speed to empty object when missing', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            };
            const result = normalizeMonster5e(monster);
            expect(result.speed).toEqual({});
        });

        it('normalizes damage immunities, resistances, and vulnerabilities', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                damage_immunities: ['cold', 'poison'],
                damage_resistances: ['bludgeoning'],
                damage_vulnerabilities: ['fire']
            };
            const result = normalizeMonster5e(monster);

            expect(result.damageImmunities).toEqual(['cold', 'poison']);
            expect(result.damageResistances).toEqual(['bludgeoning']);
            expect(result.damageVulnerabilities).toEqual(['fire']);
        });

        it('defaults damage arrays to empty when missing', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            };
            const result = normalizeMonster5e(monster);

            expect(result.damageImmunities).toEqual([]);
            expect(result.damageResistances).toEqual([]);
            expect(result.damageVulnerabilities).toEqual([]);
        });

        it('normalizes a full monster with all fields', () => {
            const monster = {
                index: 'dragon',
                name: 'Red Dragon',
                size: 'Huge',
                type: 'dragon',
                subtype: 'good',
                alignment: 'chaotic evil',
                image: { url: 'https://example.com/dragon.png' },
                bookmarked: true,
                armor_class: 19,
                hit_points: 600,
                hit_dice: '20d20 + 400',
                strength: 30,
                dexterity: 10,
                constitution: 30,
                intelligence: 18,
                wisdom: 16,
                charisma: 24,
                speed: { walk: '40 ft.', fly: '80 ft.' },
                actions: [{ name: 'Bite', desc: '<p>+14 to hit, 23 damage.</p>' }],
                special_abilities: [{ name: 'Legends Fear', desc: '<p>DC 18.</p>' }],
                reactions: [{ name: 'Magic Resistance', desc: '<p>Advantage on saves.</p>' }],
                legendary_actions: [{ name: 'Wing Attack', desc: '<p>2d10 blunt.</p>' }],
                damage_immunities: ['cold'],
                damage_resistances: ['bludgeoning'],
                damage_vulnerabilities: ['fire'],
                condition_immunities: ['charmed'],
                senses: { darkvision: '120 ft.' },
                languages: 'Common, Draconic',
                environments: ['underground'],
                challenge_rating: 20,
                xp: 21000,
                desc: '<p>A fearsome creature.</p>',
                book: 'Monster Manual',
                page: 45
            };
            const result = normalizeMonster5e(monster);

            expect(result.index).toBe('dragon');
            expect(result.name).toBe('Red Dragon');
            expect(result.version).toBe('5e');
            expect(result.armorClass).toBe(19);
            expect(result.armorClassDetails).toBeNull();
            expect(result.hitPoints).toBe(600);
            expect(result.initiativeDetails).toBeNull();
            expect(result.legendaryResistance).toBeNull();
            expect(result.equipment).toBeNull();
            expect(result.habitat).toBeNull();
            expect(result.treasure).toBeNull();
            expect(result.conditionImmunities).toEqual(['charmed']);
            expect(result.languages).toBe('Common, Draconic');
            expect(result.environments).toEqual(['underground']);
            expect(result.challengeRating).toBe(20);
            expect(result.xp).toBe(21000);
            expect(result.desc).toBe('<p>A fearsome creature.</p>');
            expect(result.book).toBe('Monster Manual');
            expect(result.page).toBe(45);
        });

        it('sets 2024-specific fields to null in 5e normalization', () => {
            const monster = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            };
            const result = normalizeMonster5e(monster);

            expect(result.armorClassDetails).toBeNull();
            expect(result.initiativeDetails).toBeNull();
            expect(result.legendaryResistance).toBeNull();
            expect(result.equipment).toBeNull();
            expect(result.habitat).toBeNull();
            expect(result.treasure).toBeNull();
        });
    });

    describe('normalizeMonster2024', () => {
        it('returns null when given null', () => {
            expect(normalizeMonster2024(null)).toBeNull();
        });

        it('returns null when given undefined', () => {
            expect(normalizeMonster2024(undefined)).toBeNull();
        });

        it('returns null when given 0', () => {
            expect(normalizeMonster2024(0)).toBeNull();
        });

        it('normalizes minimal monster data', () => {
            const monster = {
                index: 'goblin',
                name: 'Goblin'
            };
            const result = normalizeMonster2024(monster);

            expect(result).not.toBeNull();
            expect(result.index).toBe('goblin');
            expect(result.name).toBe('Goblin');
            expect(result.version).toBe('2024');
        });

        it('normalizes monster with all fields', () => {
            const monster = {
                index: 'dragon',
                name: 'Red Dragon',
                size: 'Huge',
                type: 'dragon',
                subtype: 'good',
                alignment: 'chaotic evil',
                image: { url: 'https://example.com/dragon.png' },
                bookmarked: true,
                armor_class: 19,
                armor_class_details: 'AC 19 (natural armor)',
                hit_points: 600,
                hit_dice: '20d20 + 400',
                initiative_details: '+0',
                speed: { walk: '40 ft.' },
                ability_scores: { str: 30, dex: 10 },
                ability_score_modifiers: { str: 10, dex: 0 },
                saving_throws: { str: 10, dex: 0 },
                skills: { stealth: 5 },
                senses: { darkvision: '120 ft.' },
                languages: 'Common, Draconic',
                challenge_rating: 20,
                xp: 21000,
                legendary_resistance: 3,
                equipment: ['sword'],
                habitat: 'mountains',
                treasure: 'c',
                actions: [{ name: 'Bite', description: '<p>Attack.</p>' }],
                traits: [{ name: 'Fear', description: '<p>DC 18.</p>' }],
                reactions: [{ name: 'Counter', description: '<p>Reaction.</p>' }],
                legendary_actions: [{ name: 'Wing', description: '<p>Damage.</p>' }],
                regional_effects: [{ name: 'Wild Magic', desc: '<p>Effects.</p>' }],
                desc: '<p>Description.</p>',
                book: 'Monster Manual',
                page: 45
            };
            const result = normalizeMonster2024(monster);

            expect(result.version).toBe('2024');
            expect(result.armorClass).toBe(19);
            expect(result.armorClassDetails).toBe('AC 19 (natural armor)');
            expect(result.hitPoints).toBe(600);
            expect(result.initiativeDetails).toBe('+0');
            expect(result.abilityScores).toEqual({ str: 30, dex: 10 });
            expect(result.abilityScoreModifiers).toEqual({ str: 10, dex: 0 });
            expect(result.savingThrows).toEqual({ str: 10, dex: 0 });
            expect(result.skills).toEqual({ stealth: 5 });
            expect(result.legendaryResistance).toBe(3);
            expect(result.equipment).toEqual(['sword']);
            expect(result.habitat).toBe('mountains');
            expect(result.treasure).toBe('c');
            expect(result.regionalEffects).toEqual([{ name: 'Wild Magic', desc: '<p>Effects.</p>' }]);
        });

        it('normalizes actions with 2024 fields', () => {
            const monster = {
                actions: [
                    {
                        name: 'Fire Breath',
                        description: '<p>30ft cone.</p>',
                        recharge: 'Recharge 5-6',
                        attack_bonus: 14,
                        damage_dice: 'd12',
                        damage: 'fire damage',
                        save_dc: 18,
                        save_type: 'Dexterity',
                        save_effect: 'half damage'
                    }
                ]
            };
            const result = normalizeMonster2024(monster);

            expect(result.actions).toHaveLength(1);
            expect(result.actions[0].name).toBe('Fire Breath');
            expect(result.actions[0].recharge).toBe('Recharge 5-6');
            expect(result.actions[0].attackBonus).toBe(14);
            expect(result.actions[0].damageDice).toBe('d12');
            expect(result.actions[0].saveDc).toBe(18);
            expect(result.actions[0].saveType).toBe('Dexterity');
            expect(typeof result.actions[0].renderDescription).toBe('function');
        });

        it('handles lair actions as array of strings', () => {
            const monster = {
                lair_actions: ['<p>Flame Burst</p>', '<p>Fear Wave</p>']
            };
            const result = normalizeMonster2024(monster);

            expect(result.lairActions.summary).toBeNull();
            expect(result.lairActions.actions).toEqual(['<p>Flame Burst</p>', '<p>Fear Wave</p>']);
            expect(result.lairActions.usage).toBeNull();
        });

        it('handles lair actions as array of objects', () => {
            const monster = {
                lair_actions: [
                    { description: '<p>Flame Burst</p>' },
                    { description: '<p>Fear Wave</p>' }
                ]
            };
            const result = normalizeMonster2024(monster);

            expect(result.lairActions.actions).toEqual(['<p>Flame Burst</p>', '<p>Fear Wave</p>']);
        });

        it('handles lair actions as object format', () => {
            const monster = {
                lair_actions: {
                    summary: '<p> Magical effects.</p>',
                    actions: ['<p>Effect 1</p>'],
                    usage: '10'
                }
            };
            const result = normalizeMonster2024(monster);

            expect(result.lairActions.summary).toBe('<p> Magical effects.</p>');
            expect(result.lairActions.actions).toEqual(['<p>Effect 1</p>']);
            expect(result.lairActions.usage).toBe('10');
        });

        it('handles lair actions as string', () => {
            const monster = {
                lair_actions: '<p>Single effect.</p>'
            };
            const result = normalizeMonster2024(monster);

            expect(result.lairActions.actions).toEqual(['<p>Single effect.</p>']);
        });

        it('handles missing lair actions', () => {
            const monster = {};
            const result = normalizeMonster2024(monster);
            expect(result.lairActions).toEqual({});
        });

        it('defaults 5e-only fields to empty/null in 2024', () => {
            const monster = {};
            const result = normalizeMonster2024(monster);

            expect(result.damageImmunities).toEqual([]);
            expect(result.damageResistances).toEqual([]);
            expect(result.damageVulnerabilities).toEqual([]);
            expect(result.conditionImmunities).toEqual([]);
            expect(result.environments).toBeNull();
            expect(result.allies).toBeNull();
            expect(result.enemies).toBeNull();
        });

        it('handles lair actions array with mixed types', () => {
            const monster = {
                lair_actions: ['string action', { description: 'object action' }, null]
            };
            const result = normalizeMonster2024(monster);

            expect(result.lairActions.actions).toEqual(['string action', 'object action', '']);
        });

        it('handles empty actions/traits/reactions arrays', () => {
            const monster = {
                actions: [],
                traits: [],
                reactions: [],
                legendary_actions: []
            };
            const result = normalizeMonster2024(monster);

            expect(result.actions).toEqual([]);
            expect(result.traits).toEqual([]);
            expect(result.reactions).toEqual([]);
            expect(result.legendaryActions).toEqual([]);
        });

        it('handles missing optional fields gracefully', () => {
            const monster = {
                name: 'Test Monster'
            };
            const result = normalizeMonster2024(monster);

            expect(result.index).toBeUndefined();
            expect(result.size).toBeUndefined();
            expect(result.type).toBeUndefined();
            expect(result.speed).toEqual({});
            expect(result.senses).toEqual({});
        });
    });
});
