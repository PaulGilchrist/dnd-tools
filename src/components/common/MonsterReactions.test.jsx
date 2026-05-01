import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterReactions from './MonsterReactions';

vi.mock('../../utils/htmlUtils', () => ({
   renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('MonsterReactions', () => {
   const createReaction = (overrides = {}) => ({
      name: 'Fire Breath',
      trigger: 'A creature moves within 15 feet',
      renderDescription: vi.fn(() => ({ __html: '10 fire damage' })),
           ...overrides,
           });

   const createMonster = (overrides = {}) => ({
      reactions: [createReaction()],
           ...overrides,
           });

   it('returns null when monster is not provided', () => {
      const { container } = render(<MonsterReactions monster={null} />);
      expect(container.firstChild).toBeNull();
         });

   it('returns null when reactions is not provided', () => {
      const { container } = render(<MonsterReactions monster={{}} />);
      expect(container.firstChild).toBeNull();
         });

   it('returns null when reactions is empty', () => {
      const { container } = render(<MonsterReactions monster={{ reactions: [] }} />);
      expect(container.firstChild).toBeNull();
         });

   it('displays reactions when present', () => {
      const monster = createMonster();
      render(<MonsterReactions monster={monster} />);
      expect(screen.getByText(/Fire Breath/)).toBeInTheDocument();
         });

   it('displays reaction trigger', () => {
      const monster = createMonster();
      render(<MonsterReactions monster={monster} />);
      expect(screen.getByText(/A creature moves within 15 feet/)).toBeInTheDocument();
         });

   it('handles reaction without trigger', () => {
      const reaction = createReaction({ trigger: null });
      const monster = createMonster({ reactions: [reaction] });
      render(<MonsterReactions monster={monster} />);
      expect(screen.getByText(/Fire Breath/)).toBeInTheDocument();
         });

   it('handles multiple reactions', () => {
      const reactions = [
         createReaction({ name: 'Reaction 1' }),
         createReaction({ name: 'Reaction 2' })
           ];
      const monster = createMonster({ reactions });
      render(<MonsterReactions monster={monster} />);
      expect(screen.getByText(/Reaction 1/)).toBeInTheDocument();
      expect(screen.getByText(/Reaction 2/)).toBeInTheDocument();
         });

   it('handles reaction without renderDescription', () => {
      const reaction = createReaction({ renderDescription: null });
      const monster = createMonster({ reactions: [reaction] });
      render(<MonsterReactions monster={monster} />);
      expect(screen.getByText(/Fire Breath/)).toBeInTheDocument();
         });
});