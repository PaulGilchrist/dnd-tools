import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeMonster2024 } from './monsterAdapters';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

vi.mock('../../utils/monsterUtils', () => ({
    getNameString: vi.fn((name) => name)
}));

describe('monsterAdapters', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
                regional_effects: [{ name: 'Wild Magic', description: '<p>Effects.</p>' }],
                description: '<p>Description.</p>',
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
            expect(result.regionalEffects).toEqual([{ name: 'Wild Magic', description: '<p>Effects.</p>' }]);
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
