import { describe, it, expect } from 'vitest';
import { filterSpells } from '../hooks/useSpellFilter';

const createSpell = (overrides = {}) => ({
   index: 'test-spell',
   name: 'Fireball',
   casting_time: '1 action',
   ritual: false,
   classes: ['Wizard'],
   level: 3,
   known: false,
   prepared: false,
   ...overrides,
});

const createFilter = (overrides = {}) => ({
   castingTime: 'All',
   class: 'All',
   levelMin: 0,
   levelMax: 9,
   name: '',
   status: 'All',
   ...overrides,
});

describe('filterSpells', () => {
   describe('casting time filter', () => {
      it('passes when castingTime is All', () => {
         const spell = createSpell();
         const filter = createFilter();
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('filters by Action casting time', () => {
         const spell = createSpell({ casting_time: '1 action' });
         const filter = createFilter({ castingTime: 'Action' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects non-action spells when filtering for Action', () => {
         const spell = createSpell({ casting_time: '1 bonus action' });
         const filter = createFilter({ castingTime: 'Action' });
         expect(filterSpells(filter, spell)).toBe(false);
       });

      it('filters by Bonus Action casting time', () => {
         const spell = createSpell({ casting_time: '1 bonus action' });
         const filter = createFilter({ castingTime: 'Bonus Action' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('filters by Reaction casting time', () => {
         const spell = createSpell({ casting_time: '1 reaction' });
         const filter = createFilter({ castingTime: 'Reaction' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('filters ritual spells', () => {
         const spell = createSpell({ ritual: true });
         const filter = createFilter({ castingTime: 'Ritual' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects non-ritual spells when filtering for Ritual', () => {
         const spell = createSpell({ ritual: false });
         const filter = createFilter({ castingTime: 'Ritual' });
         expect(filterSpells(filter, spell)).toBe(false);
       });
     });

   describe('class filter', () => {
      it('passes when class filter is All', () => {
         const spell = createSpell({ classes: ['Wizard'] });
         const filter = createFilter();
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('matches spell by class', () => {
         const spell = createSpell({ classes: ['Wizard', 'Sorcerer'] });
         const filter = createFilter({ class: 'Wizard' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects spell when class does not match', () => {
         const spell = createSpell({ classes: ['Wizard'] });
         const filter = createFilter({ class: 'Cleric' });
         expect(filterSpells(filter, spell)).toBe(false);
       });
     });

   describe('level filter', () => {
      it('passes when spell level is within range', () => {
         const spell = createSpell({ level: 3 });
         const filter = createFilter({ levelMin: 1, levelMax: 5 });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects spell below minimum level', () => {
         const spell = createSpell({ level: 1 });
         const filter = createFilter({ levelMin: 3, levelMax: 5 });
         expect(filterSpells(filter, spell)).toBe(false);
       });

      it('rejects spell above maximum level', () => {
         const spell = createSpell({ level: 9 });
         const filter = createFilter({ levelMin: 1, levelMax: 5 });
         expect(filterSpells(filter, spell)).toBe(false);
       });

      it('passes cantrip (level 0) when min is 0', () => {
         const spell = createSpell({ level: 0 });
         const filter = createFilter({ levelMin: 0, levelMax: 0 });
         expect(filterSpells(filter, spell)).toBe(true);
       });
     });

   describe('name filter', () => {
      it('passes when name filter is empty', () => {
         const spell = createSpell({ name: 'Fireball' });
         const filter = createFilter();
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('matches name case-insensitively', () => {
         const spell = createSpell({ name: 'Fireball' });
         const filter = createFilter({ name: 'fire' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects when name does not match', () => {
         const spell = createSpell({ name: 'Fireball' });
         const filter = createFilter({ name: 'ice' });
         expect(filterSpells(filter, spell)).toBe(false);
       });
     });

   describe('status filter', () => {
      it('passes when status is All', () => {
         const spell = createSpell({ known: false, prepared: false });
         const filter = createFilter();
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('matches known spells', () => {
         const spell = createSpell({ known: true });
         const filter = createFilter({ status: 'Known' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects unknown spells when filtering for Known', () => {
         const spell = createSpell({ known: false });
         const filter = createFilter({ status: 'Known' });
         expect(filterSpells(filter, spell)).toBe(false);
       });

      it('matches prepared or known ritual spells', () => {
         const spell = createSpell({ known: true, prepared: true, ritual: false });
         const filter = createFilter({ status: 'Prepared or Known Ritual' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('matches known ritual spells even if not prepared', () => {
         const spell = createSpell({ known: true, prepared: false, ritual: true });
         const filter = createFilter({ status: 'Prepared or Known Ritual' });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects unknown spells for Prepared or Known Ritual', () => {
         const spell = createSpell({ known: false, prepared: false, ritual: false });
         const filter = createFilter({ status: 'Prepared or Known Ritual' });
         expect(filterSpells(filter, spell)).toBe(false);
       });
     });

   describe('combined filters', () => {
      it('applies all filters together', () => {
         const spell = createSpell({
            name: 'Fireball',
            casting_time: '1 action',
            classes: ['Wizard'],
            level: 3,
            known: true,
          });
         const filter = createFilter({
            castingTime: 'Action',
            class: 'Wizard',
            levelMin: 1,
            levelMax: 5,
            name: 'fire',
            status: 'Known',
          });
         expect(filterSpells(filter, spell)).toBe(true);
       });

      it('rejects when any filter fails', () => {
         const spell = createSpell({
            name: 'Fireball',
            casting_time: '1 action',
            classes: ['Wizard'],
            level: 3,
          });
         const filter = createFilter({
            class: 'Cleric', // This will fail
            levelMin: 1,
            levelMax: 5,
          });
         expect(filterSpells(filter, spell)).toBe(false);
       });
     });
});