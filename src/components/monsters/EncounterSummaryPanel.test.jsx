import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EncounterSummaryPanel from './EncounterSummaryPanel';

describe('EncounterSummaryPanel', () => {
    const defaultProps = {
        totalMonsterXP: 300,
        monsterCount: 3,
        difficultyMultiplier: 2,
        effectiveXP: 150,
        difficultyIndex: 1,
        difficultyLabels: ['Easy', 'Medium', 'Hard', 'Deadly'],
        difficultyColors: ['#28a745', '#ffc107', '#fd7e14', '#dc3545'],
        selectedMonsters: [{ index: 'test', name: 'Test' }],
        onClearMonsters: vi.fn(),
     };

    beforeEach(() => {
        vi.clearAllMocks();
     });

    it('renders the Total XP stat', () => {
        render(<EncounterSummaryPanel {...defaultProps} />);
        expect(screen.getByText('Total XP')).toBeInTheDocument();
        expect(screen.getByText('300')).toBeInTheDocument();
     });

    it('renders the Monsters count stat', () => {
        render(<EncounterSummaryPanel {...defaultProps} />);
        expect(screen.getByText('Monsters')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
     });

    it('renders the Multiplier stat', () => {
        render(<EncounterSummaryPanel {...defaultProps} />);
        expect(screen.getByText('Multiplier')).toBeInTheDocument();
        expect(screen.getByText('\u00d72')).toBeInTheDocument();
     });

    it('renders the Effective XP stat', () => {
        render(<EncounterSummaryPanel {...defaultProps} />);
        expect(screen.getByText('Effective')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
     });

    it('renders the Difficulty label', () => {
        render(<EncounterSummaryPanel {...defaultProps} />);
        expect(screen.getByText('Difficulty')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
     });

    it('uses correct color for difficulty index', () => {
        const { container } = render(<EncounterSummaryPanel {...defaultProps} />);
        const mediumColorEl = container.querySelectorAll('.stat-value')[4];
        expect(mediumColorEl).toHaveStyle({ color: '#ffc107' });
     });

    it('shows Clear All button when monsters are selected', () => {
        render(<EncounterSummaryPanel {...defaultProps} />);
        expect(screen.getByText('Clear All')).toBeInTheDocument();
     });

    it('does not show Clear All button when no monsters are selected', () => {
        render(<EncounterSummaryPanel {...{ ...defaultProps, selectedMonsters: [] }} />);
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
     });

    it('does not show Clear All button when selectedMonsters is empty', () => {
        render(<EncounterSummaryPanel {...{ ...defaultProps, selectedMonsters: [] }} />);
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
     });

    it('calls onClearMonsters when Clear All is clicked', () => {
        render(<EncounterSummaryPanel {...defaultProps} />);
        fireEvent.click(screen.getByText('Clear All'));
        expect(defaultProps.onClearMonsters).toHaveBeenCalled();
     });

    it('uses difficulty color for effective XP', () => {
        const { container } = render(
            <EncounterSummaryPanel
                {...defaultProps}
                difficultyIndex={0}
                difficultyColors={['#28a745', '#ffc107', '#fd7e14', '#dc3545']}
            />
        );
        const colorEls = container.querySelectorAll('.stat-value');
        expect(colorEls[3]).toHaveStyle({ color: '#28a745' });
     });

    it('renders container with correct class', () => {
        const { container } = render(<EncounterSummaryPanel {...defaultProps} />);
        expect(container.querySelector('.encounters-summary-side')).toBeInTheDocument();
     });

    it('renders all stats in the summary container', () => {
        const { container } = render(<EncounterSummaryPanel {...defaultProps} />);
        const summaryStats = container.querySelector('.summary-stats');
        expect(summaryStats).toBeInTheDocument();
        expect(summaryStats.querySelectorAll('.stat-item')).toHaveLength(5);
     });

    it('marks effective XP and difficulty as stat-item-main', () => {
        const { container } = render(<EncounterSummaryPanel {...defaultProps} />);
        const mainItems = container.querySelectorAll('.stat-item-main');
        expect(mainItems).toHaveLength(2);
     });

    it('handles zero total XP', () => {
        render(<EncounterSummaryPanel {...{ ...defaultProps, totalMonsterXP: 0, effectiveXP: 0 }} />);
        const zeros = screen.getAllByText('0');
        expect(zeros.length).toBeGreaterThan(0);
     });

    it('handles zero monster count', () => {
        render(<EncounterSummaryPanel {...{ ...defaultProps, monsterCount: 0, selectedMonsters: [] }} />);
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
     });

    it('handles different difficulty levels', () => {
        const difficulties = [
            { index: 0, label: 'Easy' },
            { index: 1, label: 'Medium' },
            { index: 2, label: 'Hard' },
            { index: 3, label: 'Deadly' },
         ];
        difficulties.forEach(({ index, label }) => {
            render(<EncounterSummaryPanel {...{ ...defaultProps, difficultyIndex: index }} />);
            expect(screen.getByText(label)).toBeInTheDocument();
         });
     });
});
