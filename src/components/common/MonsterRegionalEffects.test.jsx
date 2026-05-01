import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterRegionalEffects from './MonsterRegionalEffects';

vi.mock('../../utils/htmlUtils', () => ({
   renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('MonsterRegionalEffects', () => {
   const createRegionalEffects = (overrides = {}) => ({
      summary: 'The air is thick with magic',
      effects: ['Creatures feel uneasy', 'Magic items glow'],
      usage: 'These effects occur in a 1-mile radius',
            ...overrides,
            });

   const createMonster = (overrides = {}) => ({
      regionalEffects: createRegionalEffects(),
            ...overrides,
            });

   it('returns null when monster is not provided', () => {
      const { container } = render(<MonsterRegionalEffects monster={null} />);
      expect(container.firstChild).toBeNull();
          });

   it('returns null when regionalEffects is not provided', () => {
      const { container } = render(<MonsterRegionalEffects monster={{}} />);
      expect(container.firstChild).toBeNull();
          });

   it('displays regional effects header', () => {
      const monster = createMonster();
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/Regional Effects/)).toBeInTheDocument();
          });

   it('displays summary when present', () => {
      const monster = createMonster();
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/The air is thick with magic/)).toBeInTheDocument();
          });

   it('displays effects list when present', () => {
      const monster = createMonster();
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/Creatures feel uneasy/)).toBeInTheDocument();
      expect(screen.getByText(/Magic items glow/)).toBeInTheDocument();
          });

   it('displays usage when present', () => {
      const monster = createMonster();
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/These effects occur in a 1-mile radius/)).toBeInTheDocument();
          });

   it('handles regional effects without summary', () => {
      const regionalEffects = createRegionalEffects({ summary: null });
      const monster = createMonster({ regionalEffects });
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/Regional Effects/)).toBeInTheDocument();
          });

   it('handles regional effects without effects', () => {
      const regionalEffects = createRegionalEffects({ effects: [] });
      const monster = createMonster({ regionalEffects });
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/Regional Effects/)).toBeInTheDocument();
          });

   it('handles regional effects without usage', () => {
      const regionalEffects = createRegionalEffects({ usage: null });
      const monster = createMonster({ regionalEffects });
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/Regional Effects/)).toBeInTheDocument();
          });

   it('handles empty regional effects object', () => {
      const monster = createMonster({ regionalEffects: {} });
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/Regional Effects/)).toBeInTheDocument();
          });

   it('handles multiple effects', () => {
      const regionalEffects = createRegionalEffects({
         effects: ['Effect 1', 'Effect 2', 'Effect 3']
          });
      const monster = createMonster({ regionalEffects });
      render(<MonsterRegionalEffects monster={monster} />);
      expect(screen.getByText(/Effect 1/)).toBeInTheDocument();
      expect(screen.getByText(/Effect 2/)).toBeInTheDocument();
      expect(screen.getByText(/Effect 3/)).toBeInTheDocument();
          });
});