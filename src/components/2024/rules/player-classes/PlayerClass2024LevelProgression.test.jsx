import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerClass2024LevelProgression from './PlayerClass2024LevelProgression';

vi.mock('./ClassLevelRenderers', () => ({
    Feats2024: vi.fn(() => null),
    ExtraAttacks: vi.fn(() => null),
    EnergyInfo: vi.fn(() => null),
    SpellcastingInfo: vi.fn(() => null),
    BarbarianInfo: vi.fn(() => null),
    BardicInfo: vi.fn(() => null),
    ChannelDivinity: vi.fn(() => null),
    DruidInfo: vi.fn(() => null),
    FighterInfo: vi.fn(() => null),
    MonkInfo: vi.fn(() => null),
    RangerInfo: vi.fn(() => null),
    RogueInfo: vi.fn(() => null),
    SorcererInfo: vi.fn(() => null),
    WarlockInfo: vi.fn(() => null),
}));

describe('PlayerClass2024LevelProgression', () => {
    const mockPlayerClass = {
        class_levels: [
            { level: 1, features: [{ name: 'Feature 1', level: 1 }], proficiency_bonus: 2 },
            { level: 2, features: [{ name: 'Feature 2', level: 2 }], proficiency_bonus: 2 },
            { level: 3, features: [{ name: 'Feature 3', level: 3 }], proficiency_bonus: 2 },
        ],
    };

    const onShowLevel = vi.fn();

    it('returns null when playerClass has no class_levels', () => {
        const { container } = render(
            <PlayerClass2024LevelProgression
                playerClass={{}}
                shownLevel={1}
                shownMajor=""
                onShowLevel={onShowLevel}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays level progression heading', () => {
        render(
            <PlayerClass2024LevelProgression
                playerClass={mockPlayerClass}
                shownLevel={1}
                shownMajor=""
                onShowLevel={onShowLevel}
            />
        );
        expect(screen.getByText('Level Progression')).toBeInTheDocument();
    });

    it('displays level selector buttons', () => {
        render(
            <PlayerClass2024LevelProgression
                playerClass={mockPlayerClass}
                shownLevel={1}
                shownMajor=""
                onShowLevel={onShowLevel}
            />
        );
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('calls onShowLevel when a level button is clicked', () => {
        render(
            <PlayerClass2024LevelProgression
                playerClass={mockPlayerClass}
                shownLevel={1}
                shownMajor=""
                onShowLevel={onShowLevel}
            />
        );
        const level2Button = screen.getByText('2');
        level2Button.click();
        expect(onShowLevel).toHaveBeenCalledWith(2);
    });

    it('highlights the selected level button', () => {
        render(
            <PlayerClass2024LevelProgression
                playerClass={mockPlayerClass}
                shownLevel={2}
                shownMajor=""
                onShowLevel={onShowLevel}
            />
        );
        const level2Button = screen.getByText('2');
        expect(level2Button).toHaveClass('btn-primary');
    });

    it('displays features for selected level', () => {
        render(
            <PlayerClass2024LevelProgression
                playerClass={mockPlayerClass}
                shownLevel={1}
                shownMajor=""
                onShowLevel={onShowLevel}
            />
        );
        expect(screen.getByText(/Proficiency/)).toBeInTheDocument();
        expect(screen.getByText(/Level 1: Feature 1/)).toBeInTheDocument();
    });
});
