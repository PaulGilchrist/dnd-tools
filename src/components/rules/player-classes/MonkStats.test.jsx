import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonkStats from './MonkStats';

describe('MonkStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<MonkStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays martial arts', () => {
        render(
            <MonkStats
                class_specific={{
                    martial_arts: { dice_count: 1, dice_value: 6 },
                }}
            />
        );
        expect(screen.getByText(/Martial Arts/)).toBeInTheDocument();
        expect(screen.getByText(/1d6/)).toBeInTheDocument();
    });

    it('displays ki points', () => {
        render(<MonkStats class_specific={{ ki_points: 3 }} />);
        expect(screen.getByText(/Ki Points/)).toBeInTheDocument();
        expect(screen.getByText(/3/)).toBeInTheDocument();
    });

    it('displays unarmored movement', () => {
        render(<MonkStats class_specific={{ unarmored_movement: 10 }} />);
        expect(screen.getByText(/Unarmored Movement/)).toBeInTheDocument();
        expect(screen.getByText(/10/)).toBeInTheDocument();
    });

    it('displays all stats together', () => {
        render(
            <MonkStats
                class_specific={{
                    martial_arts: { dice_count: 1, dice_value: 8 },
                    ki_points: 4,
                    unarmored_movement: 20,
                }}
            />
        );
        expect(screen.getByText(/Martial Arts/)).toBeInTheDocument();
        expect(screen.getByText(/Ki Points/)).toBeInTheDocument();
        expect(screen.getByText(/Unarmored Movement/)).toBeInTheDocument();
    });

    it('does not display martial arts when not present', () => {
        render(<MonkStats class_specific={{}} />);
        expect(screen.queryByText(/Martial Arts/)).not.toBeInTheDocument();
    });

    it('does not display ki points when 0', () => {
        render(<MonkStats class_specific={{ ki_points: 0 }} />);
        expect(screen.queryByText(/Ki Points/)).not.toBeInTheDocument();
    });

    it('does not display unarmored movement when 0', () => {
        render(<MonkStats class_specific={{ unarmored_movement: 0 }} />);
        expect(screen.queryByText(/Unarmored Movement/)).not.toBeInTheDocument();
    });
});
