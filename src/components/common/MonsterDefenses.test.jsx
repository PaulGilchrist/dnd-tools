import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterDefenses from './MonsterDefenses';

vi.mock('../../utils/monsterUtils', () => ({
   getNameString: vi.fn((names) => names?.join(', ') || ''),
}));

describe('MonsterDefenses', () => {
   const createMonster = (overrides = {}) => ({
      savingThrows: {
         str: { modifier: 3 },
         dex: { modifier: 2 },
        },
      skills: {
         perception: { modifier: 4 },
         stealth: { modifier: 2 },
        },
      senses: {
         darkvision: '60 ft.',
         passive_perception: '12',
        },
      conditionImmunities: ['charmed', 'frightened'],
      damageImmunities: ['fire'],
      damageResistances: ['cold', 'lightning'],
      damageVulnerabilities: ['thunder'],
      languages: 'Common, Dwarvish',
      environments: ['underground'],
      challengeRating: '2',
      xp: 450,
       ...overrides,
      });

   it('returns null when monster is not provided', () => {
      const { container } = render(<MonsterDefenses monster={null} />);
      expect(container.firstChild).toBeNull();
     });

   it('displays saving throws', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Saving Throws:/)).toBeInTheDocument();
      expect(screen.getByText(/STR \+3/)).toBeInTheDocument();
      expect(screen.getByText(/DEX \+2/)).toBeInTheDocument();
     });

   it('does not display saving throws section when empty', () => {
      const monster = createMonster({ savingThrows: null });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.queryByText(/Saving Throws:/)).not.toBeInTheDocument();
     });

   it('displays skills', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Skills:/)).toBeInTheDocument();
      expect(screen.getByText(/Perception \+4/)).toBeInTheDocument();
      expect(screen.getByText(/Stealth \+2/)).toBeInTheDocument();
     });

   it('does not display skills section when empty', () => {
      const monster = createMonster({ skills: null });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.queryByText(/Skills:/)).not.toBeInTheDocument();
     });

   it('displays condition immunities', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Condition Immunities:/)).toBeInTheDocument();
     });

   it('does not display condition immunities when empty', () => {
      const monster = createMonster({ conditionImmunities: [] });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.queryByText(/Condition Immunities:/)).not.toBeInTheDocument();
     });

   it('displays damage immunities', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Damage Immunities:/)).toBeInTheDocument();
     });

   it('displays damage resistances', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Damage Resistances:/)).toBeInTheDocument();
     });

   it('displays damage vulnerabilities', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Damage Vulnerabilities:/)).toBeInTheDocument();
     });

   it('displays senses', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Senses:/)).toBeInTheDocument();
      expect(screen.getByText(/darkvision 60 ft./)).toBeInTheDocument();
      expect(screen.getByText(/passive perception 12/)).toBeInTheDocument();
     });

   it('displays languages when present', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Languages:/)).toBeInTheDocument();
      expect(screen.getByText('Common, Dwarvish')).toBeInTheDocument();
     });

   it('does not display languages when not present', () => {
      const monster = createMonster({ languages: null });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.queryByText(/Languages:/)).not.toBeInTheDocument();
     });

   it('displays challenge rating and XP', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Challenge:/)).toBeInTheDocument();
      expect(screen.getByText(/450 XP/)).toBeInTheDocument();
      });

   it('does not display challenge when not present', () => {
      const monster = createMonster({ challengeRating: null });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.queryByText(/Challenge:/)).not.toBeInTheDocument();
     });

   it('displays legendary resistance when present', () => {
      const monster = createMonster({ legendaryResistance: 3 });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Legendary Resistance:/)).toBeInTheDocument();
      expect(screen.getByText('3 uses/day')).toBeInTheDocument();
     });

   it('does not display legendary resistance when 0', () => {
      const monster = createMonster({ legendaryResistance: 0 });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.queryByText(/Legendary Resistance:/)).not.toBeInTheDocument();
     });

   it('displays environments', () => {
      const monster = createMonster();
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Environments:/)).toBeInTheDocument();
     });

   it('displays allies when present', () => {
      const monster = createMonster({ allies: ['goblin'] });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Allies:/)).toBeInTheDocument();
     });

   it('displays enemies when present', () => {
      const monster = createMonster({ enemies: ['orc'] });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Enemies:/)).toBeInTheDocument();
     });

   it('displays equipment when present', () => {
      const monster = createMonster({ equipment: ['longsword', 'shield'] });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Equipment:/)).toBeInTheDocument();
      expect(screen.getByText('longsword, shield')).toBeInTheDocument();
     });

   it('displays habitat when present', () => {
      const monster = createMonster({ habitat: 'Mountains' });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Habitat:/)).toBeInTheDocument();
      expect(screen.getByText('Mountains')).toBeInTheDocument();
     });

   it('displays treasure when present', () => {
      const monster = createMonster({ treasure: 'C' });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/Treasure:/)).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
     });

   it('handles all saving throw ability mappings', () => {
      const monster = createMonster({
         savingThrows: {
            str: { modifier: 1 },
            dex: { modifier: 2 },
            con: { modifier: 3 },
            int: { modifier: 4 },
            wis: { modifier: 5 },
            cha: { modifier: 6 },
           },
        });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/STR \+1/)).toBeInTheDocument();
      expect(screen.getByText(/DEX \+2/)).toBeInTheDocument();
      expect(screen.getByText(/CON \+3/)).toBeInTheDocument();
      expect(screen.getByText(/INT \+4/)).toBeInTheDocument();
      expect(screen.getByText(/WIS \+5/)).toBeInTheDocument();
      expect(screen.getByText(/CHA \+6/)).toBeInTheDocument();
     });

   it('handles blindsense in senses', () => {
      const monster = createMonster({
         senses: { blindsight: '10 ft.' },
        });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/blindsight 10 ft./)).toBeInTheDocument();
     });

   it('handles truesight in senses', () => {
      const monster = createMonster({
         senses: { truesight: '30 ft.' },
        });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/truesight 30 ft./)).toBeInTheDocument();
     });

   it('handles tremorsense in senses', () => {
      const monster = createMonster({
         senses: { tremorsense: '5 ft.' },
        });
      render(<MonsterDefenses monster={monster} />);
      expect(screen.getByText(/tremorsense 5 ft./)).toBeInTheDocument();
     });
});