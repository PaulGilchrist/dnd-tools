import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterLegendaryActions from './MonsterLegendaryActions';

vi.mock('../../utils/htmlUtils', () => ({
   renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('MonsterLegendaryActions', () => {
   const createLegendaryAction = (overrides = {}) => ({
      name: 'Wing Attack',
      uses: 3,
      renderDescription: vi.fn(() => ({ __html: 'Melee attack' })),
          ...overrides,
          });

   const createMonster = (overrides = {}) => ({
      legendaryActions: [createLegendaryAction()],
          ...overrides,
          });

   it('returns null when monster is not provided', () => {
      const { container } = render(<MonsterLegendaryActions monster={null} />);
      expect(container.firstChild).toBeNull();
        });

   it('returns null when legendaryActions is not provided', () => {
      const { container } = render(<MonsterLegendaryActions monster={{}} />);
      expect(container.firstChild).toBeNull();
        });

   it('returns null when legendaryActions is empty', () => {
      const { container } = render(<MonsterLegendaryActions monster={{ legendaryActions: [] }} />);
      expect(container.firstChild).toBeNull();
        });

   it('displays legendary actions when present', () => {
      const monster = createMonster();
      render(<MonsterLegendaryActions monster={monster} />);
      expect(screen.getByText(/Wing Attack/)).toBeInTheDocument();
        });

   it('displays usage count info', () => {
      const monster = createMonster();
      render(<MonsterLegendaryActions monster={monster} />);
      expect(screen.getByText(/Monster can take 3 legendary actions/)).toBeInTheDocument();
        });

   it('handles legendary action without uses', () => {
      const legendaryAction = createLegendaryAction({ uses: undefined });
      const monster = createMonster({ legendaryActions: [legendaryAction] });
      render(<MonsterLegendaryActions monster={monster} />);
      expect(screen.getByText(/Wing Attack/)).toBeInTheDocument();
        });

   it('handles multiple legendary actions', () => {
      const legendaryActions = [
         createLegendaryAction({ name: 'Action 1', uses: 3 }),
         createLegendaryAction({ name: 'Action 2', uses: 3 }),
         createLegendaryAction({ name: 'Action 3', uses: 3 })
          ];
      const monster = createMonster({ legendaryActions });
      render(<MonsterLegendaryActions monster={monster} />);
      expect(screen.getByText(/Action 1/)).toBeInTheDocument();
      expect(screen.getByText(/Action 2/)).toBeInTheDocument();
      expect(screen.getByText(/Action 3/)).toBeInTheDocument();
        });

   it('handles legendary action without renderDescription', () => {
      const legendaryAction = createLegendaryAction({ renderDescription: null });
      const monster = createMonster({ legendaryActions: [legendaryAction] });
      render(<MonsterLegendaryActions monster={monster} />);
      expect(screen.getByText(/Wing Attack/)).toBeInTheDocument();
        });

   it('handles legendary actions with 0 uses', () => {
      const legendaryAction = createLegendaryAction({ uses: 0 });
      const monster = createMonster({ legendaryActions: [legendaryAction] });
      render(<MonsterLegendaryActions monster={monster} />);
      expect(screen.getByText(/Wing Attack/)).toBeInTheDocument();
        });
});