import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Feat2024 from './Feat2024';

vi.mock('../../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('Feat2024', () => {
    const createFeat = (overrides = {}) => ({
        name: 'Alert',
        type: 'General',
        description: '<p>You gain a +5 bonus to initiative.</p>',
        prerequisites: { level: 4, ability_scores: [{ name: 'Dexterity', minimum: 13 }] },
        benefits: [{ name: 'Alert', description: 'You gain a +5 bonus to initiative.' }],
        ability_score_increase: { scores: ['Dexterity'], amount: 1, max_value: 2 },
        tags: ['combat', 'initiative'],
        repeatable: false,
        ...overrides,
    });

    const mockOnExpand = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when feat is not provided', () => {
        const { container } = render(<Feat2024 feat={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when feat is undefined', () => {
        const { container } = render(<Feat2024 feat={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders feat name', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        expect(screen.getByText('Alert')).toBeInTheDocument();
    });

    it('renders feat type as subtitle', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        expect(screen.getByText('General')).toBeInTheDocument();
    });

    it('renders description after clicking to expand', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        const cardHeader = screen.getByText('Alert').closest('.card-header');
        act(() => {
            cardHeader.click();
        });
        // Check for description div
        const descriptionDiv = document.querySelector('.description');
        expect(descriptionDiv).toBeInTheDocument();
        expect(descriptionDiv).toHaveTextContent('You gain a +5 bonus to initiative.');
    });

    it('renders prerequisites after clicking to expand', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        const cardHeader = screen.getByText('Alert').closest('.card-header');
        act(() => {
            cardHeader.click();
        });
        expect(screen.getByText(/Prerequisites:/)).toBeInTheDocument();
        expect(screen.getByText(/Level 4\+/)).toBeInTheDocument();
    });

    it('renders benefits list after clicking to expand', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        const cardHeader = screen.getByText('Alert').closest('.card-header');
        act(() => {
            cardHeader.click();
        });
        expect(screen.getByText(/Benefits:/)).toBeInTheDocument();
        expect(screen.getByText(/Alert:/)).toBeInTheDocument();
    });

    it('renders ability score increase after clicking to expand', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        const cardHeader = screen.getByText('Alert').closest('.card-header');
        act(() => {
            cardHeader.click();
        });
        expect(screen.getByText(/Ability Score Increase:/)).toBeInTheDocument();
        expect(screen.getByText(/Dexterity \+1/)).toBeInTheDocument();
    });

    it('renders tags after clicking to expand', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        const cardHeader = screen.getByText('Alert').closest('.card-header');
        act(() => {
            cardHeader.click();
        });
        expect(screen.getByText('combat')).toBeInTheDocument();
        expect(screen.getByText('initiative')).toBeInTheDocument();
    });

    it('shows repeatable badge when feat is repeatable', () => {
        render(<Feat2024 feat={createFeat({ repeatable: true })} onExpand={mockOnExpand} />);
        expect(screen.getByText('Repeatable')).toBeInTheDocument();
    });

    it('calls onExpand when card is clicked', () => {
        render(<Feat2024 feat={createFeat()} onExpand={mockOnExpand} />);
        const card = screen.getByText('Alert').closest('.card-header');
        card.click();
        expect(mockOnExpand).toHaveBeenCalled();
    });
});
