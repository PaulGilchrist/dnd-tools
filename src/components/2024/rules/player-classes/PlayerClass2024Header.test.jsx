import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerClass2024Header from './PlayerClass2024Header';

vi.mock('../../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

describe('PlayerClass2024Header', () => {
    const mockPlayerClass = {
        index: 'fighter',
        name: 'Fighter',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays player class name', () => {
        render(
            <PlayerClass2024Header
                playerClass={mockPlayerClass}
                isExpanded={false}
                onToggle={() => {}}
            />
        );
        expect(screen.getByText('Fighter')).toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
        const onToggle = vi.fn();
        render(
            <PlayerClass2024Header
                playerClass={mockPlayerClass}
                isExpanded={false}
                onToggle={onToggle}
            />
        );
        const header = screen.getByText('Fighter').closest('.card-header');
        header.click();
        expect(onToggle).toHaveBeenCalledOnce();
    });

    it('has clickable class on card-header', () => {
        render(
            <PlayerClass2024Header
                playerClass={mockPlayerClass}
                isExpanded={false}
                onToggle={() => {}}
            />
        );
        const header = screen.getByText('Fighter').closest('.card-header');
        expect(header).toHaveClass('clickable');
    });
});
