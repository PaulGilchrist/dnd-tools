import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WarlockStats from './WarlockStats';

describe('WarlockStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<WarlockStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when no invocations or mystic arcanum', () => {
        const { container } = render(
            <WarlockStats class_specific={{ invocations_known: 0 }} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays invocations known', () => {
        render(<WarlockStats class_specific={{ invocations_known: 2 }} />);
        expect(screen.getByText(/Invocations Known/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays mystic arcanum level 6', () => {
        render(
            <WarlockStats
                class_specific={{ mystic_arcanum_level_6: 1 }}
            />
        );
        expect(screen.getByText(/Mystic Arcanum/)).toBeInTheDocument();
        expect(screen.getByText(/Level 6 = 1/)).toBeInTheDocument();
    });

    it('displays mystic arcanum level 7', () => {
        render(
            <WarlockStats
                class_specific={{ mystic_arcanum_level_7: 1 }}
            />
        );
        expect(screen.getByText(/Level 7 = 1/)).toBeInTheDocument();
    });

    it('displays mystic arcanum level 8', () => {
        render(
            <WarlockStats
                class_specific={{ mystic_arcanum_level_8: 1 }}
            />
        );
        expect(screen.getByText(/Level 8 = 1/)).toBeInTheDocument();
    });

    it('displays mystic arcanum level 9', () => {
        render(
            <WarlockStats
                class_specific={{ mystic_arcanum_level_9: 1 }}
            />
        );
        expect(screen.getByText(/Level 9 = 1/)).toBeInTheDocument();
    });

    it('displays all mystic arcanum levels', () => {
        render(
            <WarlockStats
                class_specific={{
                    mystic_arcanum_level_6: 1,
                    mystic_arcanum_level_7: 1,
                    mystic_arcanum_level_8: 1,
                    mystic_arcanum_level_9: 1,
                }}
            />
        );
        expect(screen.getByText(/Level 6 = 1/)).toBeInTheDocument();
        expect(screen.getByText(/Level 7 = 1/)).toBeInTheDocument();
        expect(screen.getByText(/Level 8 = 1/)).toBeInTheDocument();
        expect(screen.getByText(/Level 9 = 1/)).toBeInTheDocument();
    });

    it('does not display invocations when 0', () => {
        render(<WarlockStats class_specific={{ invocations_known: 0 }} />);
        expect(screen.queryByText(/Invocations Known/)).not.toBeInTheDocument();
    });
});
