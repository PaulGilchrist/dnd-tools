import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LevelSelector from './LevelSelector';

vi.mock('../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

describe('LevelSelector', () => {
    const mockPlayerClass = {
        class_levels: [
            { level: 1 },
            { level: 2 },
            { level: 3 },
        ],
    };

    const onShowLevel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when playerClass is not provided', () => {
        const { container } = render(
            <LevelSelector
                playerClass={null}
                shownLevel={1}
                onShowLevel={onShowLevel}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('returns null when class_levels is not present', () => {
        const { container } = render(
            <LevelSelector
                playerClass={{}}
                shownLevel={1}
                onShowLevel={onShowLevel}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays level buttons', () => {
        render(
            <LevelSelector
                playerClass={mockPlayerClass}
                shownLevel={1}
                onShowLevel={onShowLevel}
            />
        );
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows "Choose Level" text', () => {
        render(
            <LevelSelector
                playerClass={mockPlayerClass}
                shownLevel={1}
                onShowLevel={onShowLevel}
            />
        );
        expect(screen.getByText('Choose Level')).toBeInTheDocument();
    });

    it('highlights the selected level', () => {
        render(
            <LevelSelector
                playerClass={mockPlayerClass}
                shownLevel={2}
                onShowLevel={onShowLevel}
            />
        );
        const level2Button = screen.getByText('2');
        expect(level2Button).toHaveClass('active');
    });

    it('calls onShowLevel when a level button is clicked', () => {
        render(
            <LevelSelector
                playerClass={mockPlayerClass}
                shownLevel={1}
                onShowLevel={onShowLevel}
            />
        );
        const level3Button = screen.getByText('3');
        level3Button.click();
        expect(onShowLevel).toHaveBeenCalledWith(3);
    });
});
