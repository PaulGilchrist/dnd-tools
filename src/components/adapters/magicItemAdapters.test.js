import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeMagicItem5e, normalizeMagicItem2024 } from './magicItemAdapters';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

describe('magicItemAdapters', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('normalizeMagicItem5e', () => {
        it('returns null when given null', () => {
            expect(normalizeMagicItem5e(null)).toBeNull();
        });

        it('returns null when given undefined', () => {
            expect(normalizeMagicItem5e(undefined)).toBeNull();
        });

        it('returns null when given 0', () => {
            expect(normalizeMagicItem5e(0)).toBeNull();
        });

        it('returns null when given empty string', () => {
            expect(normalizeMagicItem5e('')).toBeNull();
        });

        it('normalizes minimal magic item data', () => {
            const item = {
                index: 'sword-of-fire',
                name: 'Sword of Fire'
            };
            const result = normalizeMagicItem5e(item);

            expect(result).not.toBeNull();
            expect(result.index).toBe('sword-of-fire');
            expect(result.name).toBe('Sword of Fire');
            expect(result.version).toBe('5e');
        });

        it('normalizes magic item with all fields', () => {
            const item = {
                index: 'sword-of-fire',
                name: 'Sword of Fire',
                type: 'weapon',
                rarity: 'uncommon',
                requiresAttunement: true,
                subtype: 'longsword',
                bookmarked: true,
                description: '<p>This weapon radiates heat.</p>'
            };
            const result = normalizeMagicItem5e(item);

            expect(result.index).toBe('sword-of-fire');
            expect(result.name).toBe('Sword of Fire');
            expect(result.type).toBe('weapon');
            expect(result.rarity).toBe('uncommon');
            expect(result.requiresAttunement).toBe(true);
            expect(result.subtype).toBe('longsword');
            expect(result.bookmarked).toBe(true);
            expect(result.description).toBe('<p>This weapon radiates heat.</p>');
            expect(result.version).toBe('5e');
        });

        it('sets 2024-specific fields to null/empty in 5e normalization', () => {
            const item = { index: 'test', name: 'Test' };
            const result = normalizeMagicItem5e(item);

            expect(result.chargeSystem).toBeNull();
            expect(result.spellCasting).toBeNull();
            expect(result.damage).toBeNull();
            expect(result.savingThrows).toEqual([]);
            expect(result.bonuses).toBeNull();
            expect(result.advantageDisadvantage).toBeNull();
            expect(result.conditions).toEqual([]);
            expect(result.resistances).toEqual([]);
            expect(result.immunities).toEqual([]);
            expect(result.curse).toBeNull();
            expect(result.sentience).toBeNull();
            expect(result.itemSlot).toBeNull();
            expect(result.usageLimit).toBeNull();
            expect(result.duration).toBeNull();
            expect(result.actionTypes).toEqual([]);
            expect(result.properties).toEqual([]);
            expect(result.attunementRequirements).toBeNull();
        });

        it('handles missing optional fields gracefully', () => {
            const item = { name: 'Test Item' };
            const result = normalizeMagicItem5e(item);

            expect(result.index).toBeUndefined();
            expect(result.type).toBeUndefined();
            expect(result.rarity).toBeUndefined();
            expect(result.requiresAttunement).toBeUndefined();
            expect(result.subtype).toBeUndefined();
            expect(result.bookmarked).toBeUndefined();
            expect(result.description).toBeUndefined();
        });

        it('preserves undefined optional fields', () => {
            const item = {};
            const result = normalizeMagicItem5e(item);
            expect(result.name).toBeUndefined();
            expect(result.version).toBe('5e');
        });
    });

    describe('normalizeMagicItem2024', () => {
        it('returns null when given null', () => {
            expect(normalizeMagicItem2024(null)).toBeNull();
        });

        it('returns null when given undefined', () => {
            expect(normalizeMagicItem2024(undefined)).toBeNull();
        });

        it('returns null when given 0', () => {
            expect(normalizeMagicItem2024(0)).toBeNull();
        });

        it('returns null when given empty string', () => {
            expect(normalizeMagicItem2024('')).toBeNull();
        });

        it('normalizes minimal magic item data', () => {
            const item = {
                index: 'sword-of-fire',
                name: 'Sword of Fire'
            };
            const result = normalizeMagicItem2024(item);

            expect(result).not.toBeNull();
            expect(result.index).toBe('sword-of-fire');
            expect(result.name).toBe('Sword of Fire');
            expect(result.version).toBe('2024');
        });

        it('normalizes magic item with all 2024 fields', () => {
            const item = {
                index: 'sword-of-fire',
                name: 'Sword of Fire',
                type: 'weapon',
                rarity: 'uncommon',
                requiresAttunement: true,
                subtype: 'longsword',
                bookmarked: true,
                description: '<p>This weapon radiates heat.</p>',
                charge_system: { charges: 3, recharge: 'duty moon' },
                spell_casting: { dc: 13, bonus: 4 },
                damage: { bonus: '+1', type: 'fire' },
                saving_throws: ['Constitution DC 15'],
                bonuses: '+1 to attack and damage',
                advantage_disadvantage: 'advantage on Strength checks',
                conditions: ['cursed'],
                resistances: ['fire'],
                immunities: ['cold'],
                curse: '<p>The sword cannot be removed.</p>',
                sentience: { alignment: 'neutral evil', personality: 'cruel' },
                item_slot: 'weapon',
                usage_limit: '3/day',
                duration: '1 hour',
                action_types: ['action', 'bonus action'],
                properties: ['magic'],
                attunement_requirements: 'chaotic alignment'
            };
            const result = normalizeMagicItem2024(item);

            expect(result.version).toBe('2024');
            expect(result.chargeSystem).toEqual({ charges: 3, recharge: 'duty moon' });
            expect(result.spellCasting).toEqual({ dc: 13, bonus: 4 });
            expect(result.damage).toEqual({ bonus: '+1', type: 'fire' });
            expect(result.savingThrows).toEqual(['Constitution DC 15']);
            expect(result.bonuses).toBe('+1 to attack and damage');
            expect(result.advantageDisadvantage).toBe('advantage on Strength checks');
            expect(result.conditions).toEqual(['cursed']);
            expect(result.resistances).toEqual(['fire']);
            expect(result.immunities).toEqual(['cold']);
            expect(result.curse).toBe('<p>The sword cannot be removed.</p>');
            expect(result.sentience).toEqual({ alignment: 'neutral evil', personality: 'cruel' });
            expect(result.itemSlot).toBe('weapon');
            expect(result.usageLimit).toBe('3/day');
            expect(result.duration).toBe('1 hour');
            expect(result.actionTypes).toEqual(['action', 'bonus action']);
            expect(result.properties).toEqual(['magic']);
            expect(result.attunementRequirements).toBe('chaotic alignment');
        });

        it('defaults savingThrows to empty array when missing', () => {
            const item = { index: 'test', name: 'Test' };
            const result = normalizeMagicItem2024(item);
            expect(result.savingThrows).toEqual([]);
        });

        it('defaults conditions to empty array when missing', () => {
            const item = { index: 'test', name: 'Test' };
            const result = normalizeMagicItem2024(item);
            expect(result.conditions).toEqual([]);
        });

        it('defaults resistances to empty array when missing', () => {
            const item = { index: 'test', name: 'Test' };
            const result = normalizeMagicItem2024(item);
            expect(result.resistances).toEqual([]);
        });

        it('defaults immunities to empty array when missing', () => {
            const item = { index: 'test', name: 'Test' };
            const result = normalizeMagicItem2024(item);
            expect(result.immunities).toEqual([]);
        });

        it('defaults actionTypes to empty array when missing', () => {
            const item = { index: 'test', name: 'Test' };
            const result = normalizeMagicItem2024(item);
            expect(result.actionTypes).toEqual([]);
        });

        it('defaults properties to empty array when missing', () => {
            const item = { index: 'test', name: 'Test' };
            const result = normalizeMagicItem2024(item);
            expect(result.properties).toEqual([]);
        });

        it('handles magic item with empty arrays for array fields', () => {
            const item = {
                index: 'test',
                name: 'Test',
                saving_throws: [],
                conditions: [],
                resistances: [],
                immunities: [],
                action_types: [],
                properties: []
            };
            const result = normalizeMagicItem2024(item);

            expect(result.savingThrows).toEqual([]);
            expect(result.conditions).toEqual([]);
            expect(result.resistances).toEqual([]);
            expect(result.immunities).toEqual([]);
            expect(result.actionTypes).toEqual([]);
            expect(result.properties).toEqual([]);
        });

        it('handles missing optional fields gracefully', () => {
            const item = { name: 'Test Item' };
            const result = normalizeMagicItem2024(item);

            expect(result.index).toBeUndefined();
            expect(result.type).toBeUndefined();
            expect(result.rarity).toBeUndefined();
            expect(result.requiresAttunement).toBeUndefined();
            expect(result.subtype).toBeUndefined();
            expect(result.bookmarked).toBeUndefined();
            expect(result.description).toBeUndefined();
            expect(result.chargeSystem).toBeUndefined();
            expect(result.spellCasting).toBeUndefined();
            expect(result.damage).toBeUndefined();
            expect(result.bonuses).toBeUndefined();
            expect(result.advantageDisadvantage).toBeUndefined();
            expect(result.curse).toBeUndefined();
            expect(result.sentience).toBeUndefined();
            expect(result.itemSlot).toBeUndefined();
            expect(result.usageLimit).toBeUndefined();
            expect(result.duration).toBeUndefined();
            expect(result.attunementRequirements).toBeUndefined();
        });

        it('preserves provided non-array fields', () => {
            const item = {
                index: 'amulet',
                name: 'Amulet of Health',
                rarity: 'uncommon',
                requiresAttunement: true,
                description: '<p>You have 20 Constitution.</p>'
            };
            const result = normalizeMagicItem2024(item);

            expect(result.index).toBe('amulet');
            expect(result.name).toBe('Amulet of Health');
            expect(result.rarity).toBe('uncommon');
            expect(result.requiresAttunement).toBe(true);
            expect(result.description).toBe('<p>You have 20 Constitution.</p>');
            expect(result.version).toBe('2024');
        });
    });
});
