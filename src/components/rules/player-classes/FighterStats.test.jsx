import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FighterStats from './FighterStats';

describe('FighterStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<FighterStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays action surges', () => {
        render(<FighterStats class_specific={{ action_surges: 1 }} />);
        expect(screen.getByText(/Action Surges/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays indomitable uses', () => {
        render(<FighterStats class_specific={{ indomitable_uses: 1 }} />);
        expect(screen.getByText(/Indomitable Uses/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays extra attacks', () => {
        render(<FighterStats class_specific={{ extra_attacks: 2 }} />);
        expect(screen.getByText(/Extra Attacks/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays all stats together', () => {
        render(
            <FighterStats
                class_specific={{
                    action_surges: 2,
                    indomitable_uses: 2,
                    extra_attacks: 3,
                }}
            />
        );
        expect(screen.getByText(/Action Surges/)).toBeInTheDocument();
        expect(screen.getByText(/Indomitable Uses/)).toBeInTheDocument();
        expect(screen.getByText(/Extra Attacks/)).toBeInTheDocument();
    });

    it('does not display action surges when 0', () => {
        render(<FighterStats class_specific={{ action_surges: 0 }} />);
        expect(screen.queryByText(/Action Surges/)).not.toBeInTheDocument();
    });

    it('does not display indomitable when 0', () => {
        render(<FighterStats class_specific={{ indomitable_uses: 0 }} />);
        expect(screen.queryByText(/Indomitable Uses/)).not.toBeInTheDocument();
    });

    it('does not display extra attacks when 0', () => {
        render(<FighterStats class_specific={{ extra_attacks: 0 }} />);
        expect(screen.queryByText(/Extra Attacks/)).not.toBeInTheDocument();
    });
});
