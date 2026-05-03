import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RangerStats from './RangerStats';

describe('RangerStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<RangerStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays favored enemies', () => {
        render(<RangerStats class_specific={{ favored_enemies: 1 }} />);
        expect(screen.getByText(/Favored Enemies/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays favored terrain', () => {
        render(<RangerStats class_specific={{ favored_terrain: 1 }} />);
        expect(screen.getByText(/Favored Terrain/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays both favored enemies and terrain', () => {
        render(
            <RangerStats
                class_specific={{
                    favored_enemies: 2,
                    favored_terrain: 1,
                }}
            />
        );
        expect(screen.getByText(/Favored Enemies/)).toBeInTheDocument();
        expect(screen.getByText(/Favored Terrain/)).toBeInTheDocument();
    });

    it('does not display favored enemies when 0', () => {
        render(<RangerStats class_specific={{ favored_enemies: 0 }} />);
        expect(screen.queryByText(/Favored Enemies/)).not.toBeInTheDocument();
    });

    it('does not display favored terrain when 0', () => {
        render(<RangerStats class_specific={{ favored_terrain: 0 }} />);
        expect(screen.queryByText(/Favored Terrain/)).not.toBeInTheDocument();
    });
});
