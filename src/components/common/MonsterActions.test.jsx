import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterActions from './MonsterActions';

vi.mock('../../utils/htmlUtils', () => ({
   renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('MonsterActions', () => {
   const createAction = (overrides = {}) => ({
      name: 'Longsword',
      usage: null,
      recharge: null,
      attackBonus: null,
      saveDc: null,
      renderDescription: vi.fn(() => ({ __html: 'Melee Weapon Attack' })),
         ...overrides,
         });

   const createMonster = (overrides = {}) => ({
      actions: [createAction()],
      traits: [],
      lairActions: [],
         ...overrides,
         });

   it('returns null when monster is not provided', () => {
      const { container } = render(<MonsterActions monster={null} />);
      expect(container.firstChild).toBeNull();
       });

   it('returns null when no actions', () => {
      const monster = createMonster({ actions: [] });
      const { container } = render(<MonsterActions monster={monster} sectionType="actions" />);
      expect(container.firstChild).toBeNull();
       });

   it('displays actions by default', () => {
      const monster = createMonster();
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Longsword/)).toBeInTheDocument();
       });

   it('displays actions when sectionType is actions', () => {
      const monster = createMonster();
      render(<MonsterActions monster={monster} sectionType="actions" />);
      expect(screen.getByText(/Longsword/)).toBeInTheDocument();
       });

   it('displays traits when sectionType is traits', () => {
      const trait = createAction({ name: 'Darkvision' });
      const monster = createMonster({ traits: [trait] });
      render(<MonsterActions monster={monster} sectionType="traits" />);
      expect(screen.getByText(/Darkvision/)).toBeInTheDocument();
       });

   it('displays lair actions when sectionType is lairActions', () => {
      const lairAction = createAction({ name: 'Earthquake' });
      const monster = createMonster({ lairActions: [lairAction] });
      render(<MonsterActions monster={monster} sectionType="lairActions" />);
      expect(screen.getByText(/Earthquake/)).toBeInTheDocument();
       });

   it('returns null when no traits', () => {
      const monster = createMonster({ traits: [] });
      const { container } = render(<MonsterActions monster={monster} sectionType="traits" />);
      expect(container.firstChild).toBeNull();
       });

   it('returns null when no lair actions', () => {
      const monster = createMonster({ lairActions: [] });
      const { container } = render(<MonsterActions monster={monster} sectionType="lairActions" />);
      expect(container.firstChild).toBeNull();
       });

   it('displays recharge usage format for 5e', () => {
      const action = createAction({
         name: 'Light Ray',
         usage: { type: 'recharge on roll', min_value: 5 }
         });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Recharge 5-6/)).toBeInTheDocument();
       });

   it('displays per day usage format for 5e', () => {
      const action = createAction({
         name: 'Healing Word',
         usage: { type: 'per day', times: 3 }
         });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/3\/Day/)).toBeInTheDocument();
       });

   it('displays 2024 recharge format', () => {
      const action = createAction({
         name: 'Fire Breath',
         recharge: 'Recharge 5-6'
         });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Recharge 5-6/)).toBeInTheDocument();
       });

   it('displays custom 2024 recharge format', () => {
      const action = createAction({
         name: 'Cold Breath',
         recharge: 'Recharge 6'
         });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Recharge 6/)).toBeInTheDocument();
       });

   it('displays attack bonus and damage info', () => {
      const action = createAction({
         name: 'Bite',
         attackBonus: 5,
         damageDice: 'melee',
         damage: '10 piercing'
         });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Atk: \+5/)).toBeInTheDocument();
      expect(screen.getByText(/10 piercing/)).toBeInTheDocument();
       });

   it('displays save DC and effect', () => {
      const action = createAction({
         name: 'Poison Gas',
         saveDc: 13,
         saveType: 'Constitution',
         saveEffect: '10 poison damage'
         });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/DC 13 Constitution save/)).toBeInTheDocument();
      expect(screen.getByText(/or 10 poison damage/)).toBeInTheDocument();
       });

   it('handles action without usage or recharge', () => {
      const action = createAction({
         name: 'Slash',
         usage: null,
         recharge: null
         });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Slash/)).toBeInTheDocument();
       });

   it('handles multiple actions', () => {
      const actions = [
         createAction({ name: 'Action 1' }),
         createAction({ name: 'Action 2' }),
         createAction({ name: 'Action 3' })
         ];
      const monster = createMonster({ actions });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Action 1/)).toBeInTheDocument();
      expect(screen.getByText(/Action 2/)).toBeInTheDocument();
      expect(screen.getByText(/Action 3/)).toBeInTheDocument();
       });

   it('handles monster without actions property', () => {
      const monster = {};
      const { container } = render(<MonsterActions monster={monster} />);
      expect(container.firstChild).toBeNull();
       });

   it('handles action without renderDescription', () => {
      const action = createAction({ renderDescription: null });
      const monster = createMonster({ actions: [action] });
      render(<MonsterActions monster={monster} />);
      expect(screen.getByText(/Longsword/)).toBeInTheDocument();
       });
});