import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ClericStats from './ClericStats';

describe('ClericStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<ClericStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays channel divinity charges', () => {
        render(<ClericStats class_specific={{ channel_divinity_charges: 1 }} />);
        expect(screen.getByText(/Channel Divinity Charges/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays destroy undead CR', () => {
        render(<ClericStats class_specific={{ destroy_undead_cr: 1 }} />);
        expect(screen.getByText(/Destroy Undead CR/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays both stats together', () => {
        render(
            <ClericStats
                class_specific={{
                    channel_divinity_charges: 2,
                    destroy_undead_cr: 3,
                }}
            />
        );
        expect(screen.getByText(/Channel Divinity Charges/)).toBeInTheDocument();
        expect(screen.getByText(/Destroy Undead CR/)).toBeInTheDocument();
    });

    it('does not display channel divinity when 0', () => {
        render(<ClericStats class_specific={{ channel_divinity_charges: 0 }} />);
        expect(screen.queryByText(/Channel Divinity Charges/)).not.toBeInTheDocument();
    });

    it('does not display destroy undead when 0', () => {
        render(<ClericStats class_specific={{ destroy_undead_cr: 0 }} />);
        expect(screen.queryByText(/Destroy Undead CR/)).not.toBeInTheDocument();
    });
});
