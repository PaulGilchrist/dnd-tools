import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerClassHeader from './PlayerClassHeader';

vi.mock('../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

describe('PlayerClassHeader', () => {
    const mockPlayerClass = {
        index: 'fighter',
        name: 'Fighter',
    };

    const onToggle = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays player class name', () => {
        render(
            <PlayerClassHeader
                playerClass={mockPlayerClass}
                isExpanded={false}
                onToggle={onToggle}
            />
        );
        expect(screen.getByText('Fighter')).toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
        render(
            <PlayerClassHeader
                playerClass={mockPlayerClass}
                isExpanded={false}
                onToggle={onToggle}
            />
        );
        const header = screen.getByText('Fighter');
        header.click();
        expect(onToggle).toHaveBeenCalledOnce();
    });

    it('has clickable class on card-header', () => {
        render(
            <PlayerClassHeader
                playerClass={mockPlayerClass}
                isExpanded={false}
                onToggle={() => {}}
            />
        );
        const header = screen.getByText('Fighter').closest('.card-header');
        expect(header).toHaveClass('clickable');
    });
});
