import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EncounterFilterPanel from './EncounterFilterPanel';

describe('EncounterFilterPanel', () => {
    const defaultProps = {
        filter: {
            difficulty: 2,
            playerLevels: [1],
            difficultyLabels: ['Easy', 'Medium', 'Hard', 'Deadly'],
            difficultyColors: ['#28a745', '#ffc107', '#fd7e14', '#dc3545'],
            difficultyIndex: 1,
            totalThreshold: 100,
          },
        onDifficultyChange: vi.fn(),
        onAddPlayer: vi.fn(),
        onRemovePlayer: vi.fn(),
        onPlayerLevelChange: vi.fn(),
      };

    beforeEach(() => {
        vi.clearAllMocks();
      });

    it('renders the difficulty label', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        expect(screen.getByText('Difficulty')).toBeInTheDocument();
      });

    it('renders the difficulty select', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        const select = screen.getByRole('combobox', { name: 'Difficulty' });
        expect(select).toBeInTheDocument();
      });

    it('renders all difficulty labels as options', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        const select = screen.getByRole('combobox', { name: 'Difficulty' });
        expect(select.options.length).toBe(4);
        expect(select.options[0].text).toBe('Easy');
        expect(select.options[1].text).toBe('Medium');
        expect(select.options[2].text).toBe('Hard');
        expect(select.options[3].text).toBe('Deadly');
      });

    it('sets the difficulty select value to current filter difficulty', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        expect(screen.getByRole('combobox', { name: 'Difficulty' })).toHaveValue('2');
      });

    it('renders the Add Player button', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        expect(screen.getByText('+ Add Player')).toBeInTheDocument();
      });

    it('renders player level label', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        expect(screen.getByText('Player 1 Level')).toBeInTheDocument();
      });

    it('renders one player level row per player', () => {
        render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [1, 3, 5] } }} />);
        expect(screen.getByText('Player 1 Level')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Level')).toBeInTheDocument();
        expect(screen.getByText('Player 3 Level')).toBeInTheDocument();
      });

    it('sets player level input value correctly', () => {
        render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [5] } }} />);
        expect(screen.getByDisplayValue(5)).toBeInTheDocument();
      });

    it('renders remove player button when 2 or more players', () => {
        render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [1, 3] } }} />);
        expect(screen.getAllByText('\u00d7').length).toBeGreaterThanOrEqual(0);
      });

    it('renders threshold display', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        expect(screen.getByText(/Target:/)).toBeInTheDocument();
        expect(screen.getByText('100 XP')).toBeInTheDocument();
      });

    it('renders difficulty label in threshold display', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        expect(screen.getByText('(Medium)')).toBeInTheDocument();
      });

    it('calls onDifficultyChange when difficulty select changes', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        fireEvent.change(screen.getByRole('combobox', { name: 'Difficulty' }), { target: { value: '3' } });
        expect(defaultProps.onDifficultyChange).toHaveBeenCalled();
      });

    it('calls onAddPlayer when add button clicked', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        fireEvent.click(screen.getByText('+ Add Player'));
        expect(defaultProps.onAddPlayer).toHaveBeenCalled();
      });

    it('calls onPlayerLevelChange when level input changes', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        fireEvent.change(screen.getByDisplayValue(1), { target: { value: '5' } });
        expect(defaultProps.onPlayerLevelChange).toHaveBeenCalledWith(0, '5');
      });

    it('disables remove button when only one player exists', () => {
        const { container } = render(<EncounterFilterPanel {...defaultProps} />);
        const playerRow = container.querySelector('.player-level-row');
        const removeBtn = playerRow.querySelector('button.level-delete-btn');
        expect(removeBtn).toHaveAttribute('disabled');
      });

    it('enables remove button when multiple players exist', () => {
        const { container } = render(
             <EncounterFilterPanel
                 {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [1, 3] } }}
             />
         );
        const row1 = container.querySelectorAll('.player-level-row')[0].querySelector('button.level-delete-btn');
        expect(row1).not.toHaveAttribute('disabled');
      });

    it('displays correct player numbers starting from 1', () => {
        render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [1, 2, 3] } }} />);
        expect(screen.getByText('Player 1 Level')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Level')).toBeInTheDocument();
        expect(screen.getByText('Player 3 Level')).toBeInTheDocument();
      });

    it('uses correct difficulty color index', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        const strongEl = screen.getByText('100 XP');
        expect(strongEl).toHaveStyle({ color: '#ffc107' });
      });

    it('renders container with correct class', () => {
        const { container } = render(<EncounterFilterPanel {...defaultProps} />);
        expect(container.querySelector('.encounters-filters-side')).toBeInTheDocument();
      });

    it('handles empty playerLevels gracefully', () => {
        render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [] } }} />);
        expect(screen.getByText('+ Add Player')).toBeInTheDocument();
      });

    it('handles missing difficultyLabels gracefully', () => {
        render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, difficultyLabels: null } }} />);
        expect(screen.getByText('Difficulty')).toBeInTheDocument();
      });

    it('renders form groups for difficulty and player management', () => {
        const { container } = render(<EncounterFilterPanel {...defaultProps} />);
        expect(container.querySelectorAll('.form-group')).toHaveLength(2);
      });

    it('renders threshold-mini section', () => {
        const { container } = render(<EncounterFilterPanel {...defaultProps} />);
        expect(container.querySelector('.threshold-mini')).toBeInTheDocument();
      });

    it('renders min and max attributes on player level input', () => {
        render(<EncounterFilterPanel {...defaultProps} />);
        expect(screen.getByDisplayValue(1)).toHaveAttribute('min', '1');
        expect(screen.getByDisplayValue(1)).toHaveAttribute('max', '20');
      });

    it('renders title attribute on remove button', () => {
        render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [1, 2] } }} />);
        const { container } = render(<EncounterFilterPanel {...{ ...defaultProps, filter: { ...defaultProps.filter, playerLevels: [1, 2] } }} />);
        const removeBtn = container.querySelectorAll('.level-delete-btn')[0];
        expect(removeBtn).toHaveAttribute('title', 'Remove player');
      });
});
