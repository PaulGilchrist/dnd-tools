import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BarbarianStats from './BarbarianStats';

describe('BarbarianStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<BarbarianStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when class_specific is undefined', () => {
        const { container } = render(<BarbarianStats class_specific={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays rage count', () => {
        render(<BarbarianStats class_specific={{ rage_count: 2 }} />);
        expect(screen.getByText(/Rage Count/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays rage damage bonus', () => {
        render(<BarbarianStats class_specific={{ rage_damage_bonus: 2 }} />);
        expect(screen.getByText(/Rage Damage Bonus/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays brutal critical dice', () => {
        render(<BarbarianStats class_specific={{ brutal_critical_dice: 1 }} />);
        expect(screen.getByText(/Brutal Critical Dice/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays all stats together', () => {
        render(
            <BarbarianStats
                class_specific={{
                    rage_count: 3,
                    rage_damage_bonus: 2,
                    brutal_critical_dice: 1,
                }}
            />
        );
        expect(screen.getByText(/Rage Count/)).toBeInTheDocument();
        expect(screen.getByText(/Rage Damage Bonus/)).toBeInTheDocument();
        expect(screen.getByText(/Brutal Critical Dice/)).toBeInTheDocument();
    });

    it('does not display rage count when 0', () => {
        render(<BarbarianStats class_specific={{ rage_count: 0 }} />);
        expect(screen.queryByText(/Rage Count/)).not.toBeInTheDocument();
    });
});
