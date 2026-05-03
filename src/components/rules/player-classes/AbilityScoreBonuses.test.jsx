import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AbilityScoreBonuses from './AbilityScoreBonuses';

describe('AbilityScoreBonuses', () => {
    it('returns null when ability_score_bonuses is undefined', () => {
        const { container } = render(<AbilityScoreBonuses ability_score_bonuses={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when ability_score_bonuses is 0', () => {
        const { container } = render(<AbilityScoreBonuses ability_score_bonuses={0} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when ability_score_bonuses is negative', () => {
        const { container } = render(<AbilityScoreBonuses ability_score_bonuses={-1} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays ability score bonuses when greater than 0', () => {
        render(<AbilityScoreBonuses ability_score_bonuses={2} />);
        expect(screen.getByText(/Ability Score Bonuses/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays ability score bonuses with value 1', () => {
        render(<AbilityScoreBonuses ability_score_bonuses={1} />);
        expect(screen.getByText(/Ability Score Bonuses/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });
});
