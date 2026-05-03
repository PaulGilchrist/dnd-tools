import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProficiencyBonus from './ProficiencyBonus';

describe('ProficiencyBonus', () => {
    it('returns null when prof_bonus is undefined', () => {
        const { container } = render(<ProficiencyBonus prof_bonus={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays proficiency bonus', () => {
        render(<ProficiencyBonus prof_bonus={2} />);
        expect(screen.getByText(/Proficiency Bonus/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays proficiency bonus of 3', () => {
        render(<ProficiencyBonus prof_bonus={3} />);
        expect(screen.getByText(/3/)).toBeInTheDocument();
    });

    it('displays proficiency bonus of 4', () => {
        render(<ProficiencyBonus prof_bonus={4} />);
        expect(screen.getByText(/4/)).toBeInTheDocument();
    });
});
