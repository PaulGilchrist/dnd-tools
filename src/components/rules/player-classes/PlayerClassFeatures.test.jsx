import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerClassFeatures from './PlayerClassFeatures';

vi.mock('../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

describe('PlayerClassFeatures', () => {
    const mockGetPrerequisites = vi.fn().mockReturnValue('Level 1');

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when features is not provided', () => {
        const { container } = render(
            <PlayerClassFeatures
                features={null}
                shownLevel={0}
                getPrerequisites={mockGetPrerequisites}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('returns null when features array is empty', () => {
        const { container } = render(
            <PlayerClassFeatures
                features={[]}
                shownLevel={0}
                getPrerequisites={mockGetPrerequisites}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays features heading', () => {
        render(
            <PlayerClassFeatures
                features={[{ name: 'Feature 1', desc: ['Description 1'] }]}
                shownLevel={0}
                getPrerequisites={mockGetPrerequisites}
            />
        );
        expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('displays feature name', () => {
        render(
            <PlayerClassFeatures
                features={[{ name: 'Feature 1', desc: ['Description 1'] }]}
                shownLevel={0}
                getPrerequisites={mockGetPrerequisites}
            />
        );
        expect(screen.getByText(/Feature 1/)).toBeInTheDocument();
    });

    it('displays feature description', () => {
        render(
            <PlayerClassFeatures
                features={[{ name: 'Feature 1', desc: ['Description 1'] }]}
                shownLevel={0}
                getPrerequisites={mockGetPrerequisites}
            />
        );
        expect(screen.getByText(/Description 1/)).toBeInTheDocument();
    });

    it('displays prerequisites when present', () => {
        const features = [
            {
                name: 'Feature 1',
                desc: ['Description 1'],
                prerequisites: [{ type: 'level' }],
            },
        ];
        render(
            <PlayerClassFeatures
                features={features}
                shownLevel={0}
                getPrerequisites={mockGetPrerequisites}
            />
        );
        expect(screen.getByText(/Prerequisites/)).toBeInTheDocument();
    });

    it('hides content when shownLevel is not 0', () => {
        render(
            <PlayerClassFeatures
                features={[{ name: 'Feature 1', desc: ['Description 1'] }]}
                shownLevel={1}
                getPrerequisites={mockGetPrerequisites}
            />
        );
        const body = document.querySelector('.player-class-features-card-body');
        expect(body).toHaveClass('hidden');
    });
});
