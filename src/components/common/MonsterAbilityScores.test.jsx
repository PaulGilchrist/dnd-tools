import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterAbilityScores from './MonsterAbilityScores';

describe('MonsterAbilityScores', () => {
   const createMonster = (overrides = {}) => ({
      abilityScores: {
         str: 18,
         dex: 14,
         con: 16,
         int: 10,
         wis: 12,
         cha: 8
        },
      abilityScoreModifiers: {
         str: 4,
         dex: 2,
         con: 3,
         int: 0,
         wis: 1,
         cha: -1
          },
             ...overrides,
             });

   it('returns null when monster is not provided', () => {
      const { container } = render(<MonsterAbilityScores monster={null} />);
      expect(container.firstChild).toBeNull();
      });

   it('returns null when abilityScores is not provided', () => {
      const { container } = render(<MonsterAbilityScores monster={{}} />);
      expect(container.firstChild).toBeNull();
      });

   it('displays all ability scores', () => {
      const monster = createMonster();
      render(<MonsterAbilityScores monster={monster} />);
      expect(screen.getByText('STR')).toBeInTheDocument();
      expect(screen.getByText('DEX')).toBeInTheDocument();
      expect(screen.getByText('CON')).toBeInTheDocument();
      expect(screen.getByText('INT')).toBeInTheDocument();
      expect(screen.getByText('WIS')).toBeInTheDocument();
      expect(screen.getByText('CHA')).toBeInTheDocument();
      });

   it('displays ability score values', () => {
      const monster = createMonster();
      render(<MonsterAbilityScores monster={monster} />);
      // Use regex to match text that may be split across elements
      expect(screen.getByText(/18/)).toBeInTheDocument();
      expect(screen.getByText(/14/)).toBeInTheDocument();
      expect(screen.getByText(/16/)).toBeInTheDocument();
        });

   it('displays positive modifiers with + sign', () => {
      const monster = createMonster();
      render(<MonsterAbilityScores monster={monster} />);
      // The modifier is rendered as "+4" in the text "(+4)"
      expect(screen.getByText(/\+4/)).toBeInTheDocument();
      expect(screen.getByText(/\+2/)).toBeInTheDocument();
      expect(screen.getByText(/\+3/)).toBeInTheDocument();
      expect(screen.getByText(/\+1/)).toBeInTheDocument();
         });

   it('displays negative modifiers with - sign', () => {
      const monster = createMonster();
      render(<MonsterAbilityScores monster={monster} />);
      // Check for the negative modifier in the rendered output
      expect(screen.getByText(/-1/)).toBeInTheDocument();
        });

   it('displays zero modifier without sign', () => {
      const monster = createMonster();
      render(<MonsterAbilityScores monster={monster} />);
      // Check for zero modifier
      expect(screen.getByText(/0/)).toBeInTheDocument();
        });

   it('handles missing abilityScoreModifiers', () => {
      const monster = createMonster({ abilityScoreModifiers: null });
      render(<MonsterAbilityScores monster={monster} />);
      expect(screen.getByText('STR')).toBeInTheDocument();
      // All modifiers should default to 0
      expect(screen.getAllByText(/0/)).toHaveLength(6);
        });

   it('handles partial abilityScoreModifiers', () => {
      const monster = createMonster({ abilityScoreModifiers: { str: 4 } });
      render(<MonsterAbilityScores monster={monster} />);
      expect(screen.getByText('STR')).toBeInTheDocument();
      // 5 abilities should have 0 modifier, 1 should have 4
      expect(screen.getAllByText(/0/)).toHaveLength(5);
        });

   it('handles empty abilityScores object', () => {
      const monster = createMonster({ abilityScores: {} });
      render(<MonsterAbilityScores monster={monster} />);
      expect(screen.queryByText('STR')).toBeInTheDocument();
      });
});