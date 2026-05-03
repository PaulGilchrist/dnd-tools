import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WizardStats from './WizardStats';

describe('WizardStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<WizardStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when arcane_recovery_levels is 0', () => {
        const { container } = render(<WizardStats class_specific={{ arcane_recovery_levels: 0 }} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when arcane_recovery_levels is negative', () => {
        const { container } = render(<WizardStats class_specific={{ arcane_recovery_levels: -1 }} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays arcane recovery levels', () => {
        render(<WizardStats class_specific={{ arcane_recovery_levels: 2 }} />);
        expect(screen.getByText(/Arcane Recovery Levels/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });
});
