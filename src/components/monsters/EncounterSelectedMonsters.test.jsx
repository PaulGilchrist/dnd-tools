import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EncounterSelectedMonsters from './EncounterSelectedMonsters';

describe('EncounterSelectedMonsters', () => {
    const mockSelectedMonsters = [
         { index: 'goblin', name: 'Goblin', xp: 50, challenge_rating: 0.25 },
         { index: 'orc', name: 'Orc', xp: 200, challenge_rating: 2 },
      ];

    const mockOnRemoveMonster = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
      });

    describe('rendering', () => {
        it('returns null when selectedMonsters is empty', () => {
            const { container } = render(
                <EncounterSelectedMonsters selectedMonsters={[]} onRemoveMonster={vi.fn()} />
            );
            expect(container.firstChild).toBeNull();
        });

        it('returns null when selectedMonsters is empty array', () => {
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={[]}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.firstChild).toBeNull();
           });

        it('renders the detail panel heading with count', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('Selected Monsters (2)')).toBeInTheDocument();
          });

        it('renders each selected monster name', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('Goblin')).toBeInTheDocument();
            expect(screen.getByText('Orc')).toBeInTheDocument();
          });

        it('renders challenge rating for each monster', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('CR 0.25')).toBeInTheDocument();
            expect(screen.getByText('CR 2')).toBeInTheDocument();
          });

        it('renders XP for each monster', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('50 XP')).toBeInTheDocument();
            expect(screen.getByText('200 XP')).toBeInTheDocument();
          });

        it('renders remove button for each selected monster', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            const removeButtons = screen.getAllByText('\u00d7');
            expect(removeButtons).toHaveLength(2);
          });

        it('calls onRemoveMonster with correct index when remove button clicked', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            const removeButtons = screen.getAllByText('\u00d7');
            fireEvent.click(removeButtons[0]);
            expect(mockOnRemoveMonster).toHaveBeenCalledWith('goblin');
            fireEvent.click(removeButtons[1]);
            expect(mockOnRemoveMonster).toHaveBeenCalledWith('orc');
          });

        it('renders correct number of selected items', () => {
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.querySelectorAll('.selected-item')).toHaveLength(2);
          });

        it('renders container with correct class', () => {
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.querySelector('.encounters-selected-detail')).toBeInTheDocument();
          });

        it('wraps items in selected-list div', () => {
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.querySelector('.selected-list')).toBeInTheDocument();
          });

        it('renders player with name class', () => {
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.querySelector('.selected-name')).toBeInTheDocument();
          });

        it('renders xp with class', () => {
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.querySelector('.selected-xp')).toBeInTheDocument();
          });

        it('renders cr with class', () => {
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={mockSelectedMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.querySelector('.selected-cr')).toBeInTheDocument();
          });
     });

    describe('edge cases', () => {
        it('handles monster with missing name', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={[{ index: 'test', challenge_rating: 0.5, xp: 25 }]}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('Selected Monsters (1)')).toBeInTheDocument();
          });

        it('handles monster with missing xp', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={[{ index: 'test', name: 'Test', challenge_rating: 1 }]}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('Test')).toBeInTheDocument();
          });

        it('handles monster with missing challenge_rating', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={[{ index: 'test', name: 'Test', xp: 50 }]}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('Test')).toBeInTheDocument();
          });

        it('handles single selected monster', () => {
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={[{ index: 'test', name: 'Test', xp: 50, challenge_rating: 1 }]}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('Selected Monsters (1)')).toBeInTheDocument();
          });

        it('handles many selected monsters', () => {
            const manyMonsters = Array.from({ length: 10 }, (_, i) => ({
                index: `monster-${i}`,
                name: `Monster ${i}`,
                xp: 50 * (i + 1),
                challenge_rating: i,
              }));
            render(
                 <EncounterSelectedMonsters
                    selectedMonsters={manyMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(screen.getByText('Selected Monsters (10)')).toBeInTheDocument();
            const { container } = render(
                 <EncounterSelectedMonsters
                    selectedMonsters={manyMonsters}
                    onRemoveMonster={mockOnRemoveMonster}
                 />
             );
            expect(container.querySelectorAll('.selected-item')).toHaveLength(10);
          });
     });
});
