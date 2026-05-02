import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeSpell5e, normalizeSpell2024 } from './spellAdapters';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

describe('spellAdapters', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('normalizeSpell5e', () => {
        it('returns null when given null', () => {
            expect(normalizeSpell5e(null)).toBeNull();
        });

        it('returns null when given undefined', () => {
            expect(normalizeSpell5e(undefined)).toBeNull();
        });

        it('returns null when given 0', () => {
            expect(normalizeSpell5e(0)).toBeNull();
        });

        it('returns null when given empty string', () => {
            expect(normalizeSpell5e('')).toBeNull();
        });

        it('normalizes minimal spell data', () => {
            const spell = {
                index: 'fireball',
                name: 'Fireball'
            };
            const result = normalizeSpell5e(spell);

            expect(result).not.toBeNull();
            expect(result.index).toBe('fireball');
            expect(result.name).toBe('Fireball');
            expect(result.version).toBe('5e');
        });

        it('normalizes spell with all fields', () => {
            const spell = {
                index: 'fireball',
                name: 'Fireball',
                level: 3,
                school: 'evocation',
                ritual: false,
                casting_time: '1 action',
                range: '150 feet',
                components: 'V, S, M',
                material: 'A tiny ball of bat guano and sulfur.',
                duration: 'Instantaneous',
                concentration: false,
                classes: ['Sorcerer', 'Wizard'],
                area_of_effect: { type: 'sphere', size: 20 },
                damage: { dc: 'constitution', dice: '8d6', type: 'fire' },
                known: false,
                prepared: true,
                desc: ['<p>A bright flash erupts...</p>'],
                higher_level: '<p>2 additional d6 per slot level.</p>'
            };
            const result = normalizeSpell5e(spell);

            expect(result.index).toBe('fireball');
            expect(result.name).toBe('Fireball');
            expect(result.level).toBe(3);
            expect(result.school).toBe('evocation');
            expect(result.ritual).toBe(false);
            expect(result.castingTime).toBe('1 action');
            expect(result.range).toBe('150 feet');
            expect(result.components).toBe('V, S, M');
            expect(result.material).toBe('A tiny ball of bat guano and sulfur.');
            expect(result.duration).toBe('Instantaneous');
            expect(result.concentration).toBe(false);
            expect(result.classes).toEqual(['Sorcerer', 'Wizard']);
            expect(result.subclasses).toEqual([]);
            expect(result.areaOfEffect).toEqual({ type: 'sphere', size: 20 });
            expect(result.damage).toEqual({ dc: 'constitution', dice: '8d6', type: 'fire' });
            expect(result.savingThrow).toBeNull();
            expect(result.statusEffects).toEqual([]);
            expect(result.known).toBe(false);
            expect(result.prepared).toBe(true);
            expect(result.desc).toEqual(['<p>A bright flash erupts...</p>']);
            expect(result.higherLevel).toBe('<p>2 additional d6 per slot level.</p>');
            expect(result.version).toBe('5e');
        });

        it('defaults classes to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell5e(spell);
            expect(result.classes).toEqual([]);
        });

        it('defaults desc to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell5e(spell);
            expect(result.desc).toEqual([]);
        });

        it('defaults subclasses to empty array', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell5e(spell);
            expect(result.subclasses).toEqual([]);
        });

        it('defaults savingThrow to null', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell5e(spell);
            expect(result.savingThrow).toBeNull();
        });

        it('defaults statusEffects to empty array', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell5e(spell);
            expect(result.statusEffects).toEqual([]);
        });

        it('handles spell with empty desc string (falsy value defaults to [])', () => {
            const spell = { index: 'test', name: 'Test', desc: '' };
            const result = normalizeSpell5e(spell);
            expect(result.desc).toEqual([]);
         });

        it('preserves desc when provided as array', () => {
            const spell = {
                index: 'test',
                name: 'Test',
                desc: ['<p>Line 1</p>', '<p>Line 2</p>']
            };
            const result = normalizeSpell5e(spell);
            expect(result.desc).toEqual(['<p>Line 1</p>', '<p>Line 2</p>']);
        });
    });

    describe('normalizeSpell2024', () => {
        it('returns null when given null', () => {
            expect(normalizeSpell2024(null)).toBeNull();
        });

        it('returns null when given undefined', () => {
            expect(normalizeSpell2024(undefined)).toBeNull();
        });

        it('returns null when given 0', () => {
            expect(normalizeSpell2024(0)).toBeNull();
        });

        it('returns null when given empty string', () => {
            expect(normalizeSpell2024('')).toBeNull();
        });

        it('normalizes minimal spell data', () => {
            const spell = {
                index: 'fireball',
                name: 'Fireball'
            };
            const result = normalizeSpell2024(spell);

            expect(result).not.toBeNull();
            expect(result.index).toBe('fireball');
            expect(result.name).toBe('Fireball');
            expect(result.version).toBe('2024');
        });

        it('normalizes spell with all 2024 fields', () => {
            const spell = {
                index: 'fireball',
                name: 'Fireball',
                level: 3,
                school: 'evocation',
                ritual: false,
                casting_time: '1 action',
                range: '150 feet',
                components: ['Verbal', 'Somatic', 'Material'],
                material: 'A tiny ball of bat guano and sulfur.',
                duration: 'Instantaneous',
                concentration: false,
                classes: ['Sorcerer', 'Wizard'],
                subclasses: ['Warlock'],
                area_of_effect: { type: 'sphere', size: 20 },
                damage: { dc: 'constitution', dice: '8d6', type: 'fire' },
                saving_throw: 'Constitution',
                status_effects: ['blinded'],
                known: true,
                prepared: false,
                desc: ['<p>A bright flash erupts...</p>'],
                higher_level: ['<p>2 additional d6 per slot level.</p>']
            };
            const result = normalizeSpell2024(spell);

            expect(result.version).toBe('2024');
            expect(result.components).toEqual(['Verbal', 'Somatic', 'Material']);
            expect(result.classes).toEqual(['Sorcerer', 'Wizard']);
            expect(result.subclasses).toEqual(['Warlock']);
            expect(result.savingThrow).toBe('Constitution');
            expect(result.statusEffects).toEqual(['blinded']);
            expect(result.desc).toEqual(['<p>A bright flash erupts...</p>']);
            expect(result.higherLevel).toEqual(['<p>2 additional d6 per slot level.</p>']);
        });

        it('defaults components to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell2024(spell);
            expect(result.components).toEqual([]);
        });

        it('defaults classes to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell2024(spell);
            expect(result.classes).toEqual([]);
        });

        it('defaults subclasses to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell2024(spell);
            expect(result.subclasses).toEqual([]);
        });

        it('defaults statusEffects to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell2024(spell);
            expect(result.statusEffects).toEqual([]);
        });

        it('defaults desc to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell2024(spell);
            expect(result.desc).toEqual([]);
        });

        it('defaults higherLevel to empty array when missing', () => {
            const spell = { index: 'test', name: 'Test' };
            const result = normalizeSpell2024(spell);
            expect(result.higherLevel).toEqual([]);
        });

        it('handles spell with empty components', () => {
            const spell = { index: 'test', name: 'Test', components: [] };
            const result = normalizeSpell2024(spell);
            expect(result.components).toEqual([]);
        });

        it('preserves provided subclasses', () => {
            const spell = {
                index: 'test',
                name: 'Test',
                subclasses: ['Divination', 'Necromancy']
            };
            const result = normalizeSpell2024(spell);
            expect(result.subclasses).toEqual(['Divination', 'Necromancy']);
        });

        it('handles missing optional fields gracefully', () => {
            const spell = { name: 'Test Spell' };
            const result = normalizeSpell2024(spell);

            expect(result.index).toBeUndefined();
            expect(result.level).toBeUndefined();
            expect(result.school).toBeUndefined();
            expect(result.ritual).toBeUndefined();
            expect(result.material).toBeUndefined();
            expect(result.areaOfEffect).toBeUndefined();
            expect(result.damage).toBeUndefined();
            expect(result.savingThrow).toBeUndefined();
            expect(result.known).toBeUndefined();
            expect(result.prepared).toBeUndefined();
            expect(result.higherLevel).toEqual([]);
        });

        it('preserves higher_level when provided as string', () => {
            const spell = {
                index: 'test',
                name: 'Test',
                higher_level: '<p>2d6 per level.</p>'
            };
            const result = normalizeSpell2024(spell);
            expect(result.higherLevel).toBe('<p>2d6 per level.</p>');
        });
    });
});
