import { describe, it, expect } from 'vitest';
import { resolveMonsterIRV } from './monsterIrv';

describe('resolveMonsterIRV', () => {
    it('returns empty lists for empty data', () => {
        expect(resolveMonsterIRV({})).toEqual({
            immunities: [],
            resistances: [],
            vulnerabilities: [],
            conditionImmunities: [],
        });
    });

    it('returns empty lists for null data', () => {
        expect(resolveMonsterIRV(null)).toEqual({
            immunities: [],
            resistances: [],
            vulnerabilities: [],
            conditionImmunities: [],
        });
    });

    it('uses 2024 damage_* keys when present', () => {
        const result = resolveMonsterIRV({
            damage_immunities: ['lightning', 'poison'],
            damage_resistances: ['necrotic'],
            damage_vulnerabilities: [],
            condition_immunities: ['charmed', 'frightened'],
        });

        expect(result.immunities).toEqual(['lightning', 'poison']);
        expect(result.resistances).toEqual(['necrotic']);
        expect(result.vulnerabilities).toEqual([]);
        expect(result.conditionImmunities).toEqual(['charmed', 'frightened']);
    });

    it('prefers 2024 keys over legacy keys when both have entries', () => {
        const result = resolveMonsterIRV({
            damage_immunities: ['fire'],
            damage_resistances: ['cold'],
            damage_vulnerabilities: ['slashing'],
            condition_immunities: ['poisoned'],
            immunities: ['acid'],
            resistances: ['bludgeoning'],
            vulnerabilities: ['piercing'],
        });

        expect(result.immunities).toEqual(['fire']);
        expect(result.resistances).toEqual(['cold']);
        expect(result.vulnerabilities).toEqual(['slashing']);
        expect(result.conditionImmunities).toEqual(['poisoned']);
    });

    it('falls back to legacy keys when 2024 keys are empty', () => {
        const result = resolveMonsterIRV({
            damage_immunities: [],
            damage_resistances: [],
            damage_vulnerabilities: [],
            condition_immunities: [],
            resistances: ['Cold', 'Fire'],
            vulnerabilities: ['Acid'],
        });

        expect(result.immunities).toEqual([]);
        expect(result.resistances).toEqual(['Cold', 'Fire']);
        expect(result.vulnerabilities).toEqual(['Acid']);
        expect(result.conditionImmunities).toEqual([]);
    });

    it('splits legacy mixed immunities into damage types and conditions', () => {
        const result = resolveMonsterIRV({
            immunities: ['Poison', 'Thunder', 'Exhaustion', 'Grappled', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone'],
        });

        expect(result.immunities).toEqual(['Poison', 'Thunder']);
        expect(result.conditionImmunities).toEqual(['Exhaustion', 'Grappled', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone']);
    });

    it('matches legacy condition names case-insensitively', () => {
        const result = resolveMonsterIRV({
            immunities: ['ACID', 'charmed', 'POISONED'],
        });

        expect(result.immunities).toEqual(['ACID']);
        expect(result.conditionImmunities).toEqual(['charmed', 'POISONED']);
    });

    it('uses condition_immunities when legacy list has no conditions', () => {
        const result = resolveMonsterIRV({
            immunities: ['acid'],
            condition_immunities: ['charmed'],
        });

        expect(result.immunities).toEqual(['acid']);
        expect(result.conditionImmunities).toEqual(['charmed']);
    });
});
