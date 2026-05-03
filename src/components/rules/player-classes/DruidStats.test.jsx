import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DruidStats from './DruidStats';

describe('DruidStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<DruidStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when wild_shape_max_cr is 0', () => {
        const { container } = render(<DruidStats class_specific={{ wild_shape_max_cr: 0 }} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when wild_shape_max_cr is negative', () => {
        const { container } = render(<DruidStats class_specific={{ wild_shape_max_cr: -1 }} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays wild shape max CR', () => {
        render(<DruidStats class_specific={{ wild_shape_max_cr: 2 }} />);
        expect(screen.getByText(/Wild Shape Max CR/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('shows no flying or swimming speed message when wild_shape_swim is false', () => {
        render(<DruidStats class_specific={{ wild_shape_max_cr: 2, wild_shape_swim: false }} />);
        expect(screen.getByText(/no flying of swimming speed/)).toBeInTheDocument();
    });

    it('shows no flying speed message when wild_shape_fly is false but swim is true', () => {
        render(
            <DruidStats
                class_specific={{
                    wild_shape_max_cr: 2,
                    wild_shape_swim: true,
                    wild_shape_fly: false,
                }}
            />
        );
        expect(screen.getByText(/no flying speed/)).toBeInTheDocument();
    });

    it('does not show speed messages when wild_shape_swim and wild_shape_fly are true', () => {
        render(
            <DruidStats
                class_specific={{
                    wild_shape_max_cr: 2,
                    wild_shape_swim: true,
                    wild_shape_fly: true,
                }}
            />
        );
        expect(screen.queryByText(/no flying/)).not.toBeInTheDocument();
        expect(screen.queryByText(/no swimming/)).not.toBeInTheDocument();
    });
});
