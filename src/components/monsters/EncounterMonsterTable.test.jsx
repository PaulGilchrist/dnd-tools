import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EncounterMonsterTable from './EncounterMonsterTable';

describe('EncounterMonsterTable', () => {
    const mockMonsters = [
         { index: 'goblin', name: 'Goblin', xp: 50, challenge_rating: 0.25 },
         { index: 'orc', name: 'Orc', xp: 200, challenge_rating: 2 },
         { index: 'bugbear', name: 'Bugbear', xp: 50, challenge_rating: 1 },
      ];

    const defaultProps = {
        filteredMonsters: mockMonsters,
        selectedMonsters: [],
        onToggleMonster: vi.fn(),
        onIncreaseQty: vi.fn(),
        onDecreaseQty: vi.fn(),
        onRemoveMonster: vi.fn(),
        searchQuery: '',
        onSearchQueryChange: vi.fn(),
      };

    beforeEach(() => {
        vi.clearAllMocks();
      });

    it('renders the search input', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        expect(screen.getByPlaceholderText('Name, type, or subtype...')).toBeInTheDocument();
      });

    it('renders the search label', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        expect(screen.getByText('Search')).toBeInTheDocument();
      });

    it('sets search input value from searchQuery prop', () => {
        render(<EncounterMonsterTable {...{ ...defaultProps, searchQuery: 'goblin' }} />);
        expect(screen.getByDisplayValue('goblin')).toBeInTheDocument();
      });

    it('calls onSearchQueryChange when search input changes', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText('Name, type, or subtype...'), { target: { value: 'orc' } });
        expect(defaultProps.onSearchQueryChange).toHaveBeenCalledWith('orc');
      });

    it('renders the table when there are filtered monsters', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

    it('does not render the table when no filtered monsters', () => {
        render(<EncounterMonsterTable {...{ ...defaultProps, filteredMonsters: [] }} />);
        expect(screen.getByText('No monsters found')).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });

    it('renders one table row per monster', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        const rows = screen.getAllByRole('row').slice(1);
        expect(rows).toHaveLength(3);
      });

    it('renders monster names in the table', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        expect(screen.getByText('Goblin')).toBeInTheDocument();
        expect(screen.getByText('Orc')).toBeInTheDocument();
      });

    it('renders challenge ratings', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        expect(screen.getByText('0.25')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });

    it('renders XP values', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        const xpValues = screen.getAllByText('50');
        expect(xpValues.length).toBeGreaterThan(0);
        expect(screen.getByText('200')).toBeInTheDocument();
      });

    it('does not show qty controls for unselected monsters', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        expect(screen.queryByRole('button', { name: '−' })).not.toBeInTheDocument();
      });

    it('shows qty controls for selected monsters', () => {
        render(
             <EncounterMonsterTable
                 {...defaultProps}
                selectedMonsters={[{ ...mockMonsters[0], qty: 2 }]}
             />
         );
        const qtyValues = screen.getAllByText('2');
        expect(qtyValues.length).toBeGreaterThan(0);
      });

    it('calls onToggleMonster when row is clicked', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        const rows = screen.getAllByRole('row');
        fireEvent.click(rows[1]);
        expect(defaultProps.onToggleMonster).toHaveBeenCalledWith(mockMonsters[0]);
      });

    it('calls onToggleMonster when checkbox is clicked', () => {
        render(<EncounterMonsterTable {...defaultProps} />);
        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);
        expect(defaultProps.onToggleMonster).toHaveBeenCalledWith(mockMonsters[0]);
      });

    it('calls onIncreaseQty when plus button is clicked', () => {
        render(
             <EncounterMonsterTable
                 {...defaultProps}
                selectedMonsters={[{ ...mockMonsters[0], qty: 1 }]}
             />
         );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[1]);
        expect(defaultProps.onIncreaseQty).toHaveBeenCalledWith('goblin');
      });

    it('calls onDecreaseQty when minus button is clicked', () => {
        render(
             <EncounterMonsterTable
                 {...defaultProps}
                selectedMonsters={[{ ...mockMonsters[0], qty: 1 }]}
             />
         );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(defaultProps.onDecreaseQty).toHaveBeenCalledWith('goblin');
      });

    it('calls onRemoveMonster when remove button is clicked', () => {
        render(
             <EncounterMonsterTable
                 {...defaultProps}
                selectedMonsters={[{ ...mockMonsters[0], qty: 1 }]}
             />
         );
        const removeButtons = screen.getAllByText('\u00d7');
        fireEvent.click(removeButtons[0]);
        expect(defaultProps.onRemoveMonster).toHaveBeenCalledWith('goblin');
      });

    it('sets checkbox as checked when monster is selected', () => {
        render(
             <EncounterMonsterTable
                 {...defaultProps}
                selectedMonsters={[{ ...mockMonsters[0], qty: 1 }]}
             />
         );
        expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
        expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();
      });

    it('adds selected class to selected monster rows', () => {
        const { container } = render(
             <EncounterMonsterTable
                 {...defaultProps}
                selectedMonsters={[{ ...mockMonsters[0], qty: 1 }]}
             />
         );
        const selectedRow = container.querySelector('.monster-row.selected');
        expect(selectedRow).toBeInTheDocument();
      });

    it('does not add selected class to unselected rows', () => {
        const { container } = render(
             <EncounterMonsterTable
                 {...defaultProps}
                selectedMonsters={[{ ...mockMonsters[0], qty: 1 }]}
             />
         );
        const nonSelectedRows = container.querySelectorAll('.monster-row:not(.selected)');
        expect(nonSelectedRows.length).toBeGreaterThanOrEqual(1);
      });

    it('handles empty filteredMonsters array', () => {
        render(<EncounterMonsterTable {...{ ...defaultProps, filteredMonsters: [] }} />);
        expect(screen.getByText('No monsters found')).toBeInTheDocument();
      });

    it('renders input group wrapper', () => {
        const { container } = render(<EncounterMonsterTable {...defaultProps} />);
        expect(container.querySelector('.input-group')).toBeInTheDocument();
      });

    it('renders table wrapper when monsters present', () => {
        const { container } = render(<EncounterMonsterTable {...defaultProps} />);
        expect(container.querySelector('.monster-table-wrapper')).toBeInTheDocument();
      });

    it('does not render table wrapper when no monsters', () => {
        const { container } = render(<EncounterMonsterTable {...{ ...defaultProps, filteredMonsters: [] }} />);
        expect(container.querySelector('.monster-table-wrapper')).not.toBeInTheDocument();
      });

    it('renders header row with column titles', () => {
        const { container } = render(<EncounterMonsterTable {...defaultProps} />);
        expect(container.querySelector('.col-name')).toHaveTextContent('Monster');
        expect(container.querySelector('.col-cr')).toHaveTextContent('CR');
      });
});
