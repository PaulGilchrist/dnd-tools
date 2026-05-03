import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BardStats from './BardStats';

describe('BardStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<BardStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays bardic inspiration die', () => {
        render(<BardStats class_specific={{ bardic_inspiration_die: 6 }} />);
        expect(screen.getByText(/Bardic Inspiration Die/)).toBeInTheDocument();
        expect(screen.getByText(/d6/)).toBeInTheDocument();
    });

    it('displays song of rest die', () => {
        render(<BardStats class_specific={{ song_of_rest_die: 6 }} />);
        expect(screen.getByText(/Song of Rest Die/)).toBeInTheDocument();
        expect(screen.getByText(/d6/)).toBeInTheDocument();
    });

    it('displays magical secrets level 5', () => {
        render(<BardStats class_specific={{ magical_secrets_max_5: 2 }} />);
        expect(screen.getByText(/Magical Secrets/)).toBeInTheDocument();
        expect(screen.getByText(/2 of level 5 or below/)).toBeInTheDocument();
    });

    it('displays magical secrets level 7', () => {
        render(<BardStats class_specific={{ magical_secrets_max_7: 1 }} />);
        expect(screen.getByText(/1 of level 7 or below/)).toBeInTheDocument();
    });

    it('displays magical secrets level 9', () => {
        render(<BardStats class_specific={{ magical_secrets_max_9: 1 }} />);
        expect(screen.getByText(/1 of level 9 or below/)).toBeInTheDocument();
    });

    it('displays all bard stats together', () => {
        render(
            <BardStats
                class_specific={{
                    bardic_inspiration_die: 8,
                    song_of_rest_die: 6,
                    magical_secrets_max_5: 2,
                    magical_secrets_max_7: 1,
                    magical_secrets_max_9: 1,
                }}
            />
        );
        expect(screen.getByText(/Bardic Inspiration Die/)).toBeInTheDocument();
        expect(screen.getByText(/Song of Rest Die/)).toBeInTheDocument();
        expect(screen.getByText(/Magical Secrets/)).toBeInTheDocument();
    });

    it('does not display bardic inspiration when 0', () => {
        render(<BardStats class_specific={{ bardic_inspiration_die: 0 }} />);
        expect(screen.queryByText(/Bardic Inspiration Die/)).not.toBeInTheDocument();
    });
});
