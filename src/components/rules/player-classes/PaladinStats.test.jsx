import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaladinStats from './PaladinStats';

describe('PaladinStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<PaladinStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when aura_range is 0', () => {
        const { container } = render(<PaladinStats class_specific={{ aura_range: 0 }} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when aura_range is negative', () => {
        const { container } = render(<PaladinStats class_specific={{ aura_range: -1 }} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays aura range', () => {
        render(<PaladinStats class_specific={{ aura_range: 10 }} />);
        expect(screen.getByText(/Aura Range/)).toBeInTheDocument();
        expect(screen.getByText(/10/)).toBeInTheDocument();
    });

    it('displays aura range in feet', () => {
        render(<PaladinStats class_specific={{ aura_range: 10 }} />);
        expect(screen.getByText(/10/)).toBeInTheDocument();
    });
});
