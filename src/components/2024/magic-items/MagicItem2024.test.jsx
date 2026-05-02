import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MagicItem2024 from './MagicItem2024';

vi.mock('../../common/MagicItemCard', () => ({
    default: vi.fn(({ magicItem, expand, sectionRenderers }) => (
        <div data-testid="magic-item-card">
            <span data-testid="card-expand">{String(expand)}</span>
            <span data-testid="card-name">{magicItem?.name}</span>
            {sectionRenderers && <div data-testid="has-section-renderers">true</div>}
        </div>
    )),
}));

vi.mock('../../common/MagicItemSections', () => ({
    default: vi.fn(() => <div data-testid="magic-item-sections"></div>),
}));

vi.mock('../../adapters/magicItemAdapters', () => ({
    normalizeMagicItem2024: vi.fn((item) => ({
        ...item,
        normalized: true,
    })),
}));

import { normalizeMagicItem2024 } from '../../adapters/magicItemAdapters';

describe('MagicItem2024', () => {
    const createMagicItem = (overrides = {}) => ({
        index: 'potion-of-healing',
        name: 'Potion of Healing',
        rarity: 'Common',
        ...overrides,
    });

    const mockOnExpand = vi.fn();
    const mockOnBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when magicItem is not provided', () => {
        const { container } = render(<MagicItem2024 magicItem={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when magicItem is undefined', () => {
        const { container } = render(<MagicItem2024 magicItem={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('normalizes magic item data using normalizeMagicItem2024', () => {
        const item = createMagicItem();
        render(<MagicItem2024 magicItem={item} />);
        expect(normalizeMagicItem2024).toHaveBeenCalledWith(item);
    });

    it('passes normalized magic item to MagicItemCard', () => {
        const item = createMagicItem();
        render(<MagicItem2024 magicItem={item} />);
        expect(screen.getByTestId('card-name')).toHaveTextContent('Potion of Healing');
    });

    it('passes expand prop to MagicItemCard', () => {
        render(<MagicItem2024 magicItem={createMagicItem()} expand={true} />);
        expect(screen.getByTestId('card-expand')).toHaveTextContent('true');
    });

    it('passes onExpand callback to MagicItemCard', () => {
        render(<MagicItem2024 magicItem={createMagicItem()} onExpand={mockOnExpand} />);
        expect(screen.getByTestId('magic-item-card')).toBeInTheDocument();
    });

    it('passes onBookmarkChange callback to MagicItemCard', () => {
        render(<MagicItem2024 magicItem={createMagicItem()} onBookmarkChange={mockOnBookmarkChange} />);
        expect(screen.getByTestId('magic-item-card')).toBeInTheDocument();
    });

    it('passes MagicItemSections as sectionRenderers', () => {
        render(<MagicItem2024 magicItem={createMagicItem()} />);
        expect(screen.getByTestId('has-section-renderers')).toBeInTheDocument();
    });
});
