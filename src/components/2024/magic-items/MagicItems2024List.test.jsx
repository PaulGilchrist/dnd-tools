import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MagicItems2024List from './MagicItems2024List';

vi.mock('../../common/MagicItemCard', () => ({
    default: vi.fn(({ magicItem, expand, sectionRenderers }) => (
        <div data-testid="magic-item-card" data-index={magicItem?.index}>
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

describe('MagicItems2024List', () => {
    const createItems = () => [
        { index: 'potion-of-healing', name: 'Potion of Healing', rarity: 'Common' },
        { index: 'wand-of-magic-missiles', name: 'Wand of Magic Missiles', rarity: 'Uncommon' },
    ];

    const mockShowMagicItem = vi.fn(() => true);
    const mockExpandCard = vi.fn();
    const mockHandleBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders a list of magic item cards', () => {
        render(
            <MagicItems2024List
                filteredItems={createItems()}
                showMagicItem={mockShowMagicItem}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getAllByTestId('magic-item-card')).toHaveLength(2);
    });

    it('normalizes each item using normalizeMagicItem2024', () => {
        const items = createItems();
        render(
            <MagicItems2024List
                filteredItems={items}
                showMagicItem={mockShowMagicItem}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(normalizeMagicItem2024).toHaveBeenCalledTimes(2);
        expect(normalizeMagicItem2024).toHaveBeenCalledWith(items[0]);
        expect(normalizeMagicItem2024).toHaveBeenCalledWith(items[1]);
    });

    it('passes sectionRenderers to MagicItemCard', () => {
        render(
            <MagicItems2024List
                filteredItems={createItems()}
                showMagicItem={mockShowMagicItem}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getAllByTestId('has-section-renderers')).toHaveLength(2);
    });

    it('respects showMagicItem filter', () => {
        mockShowMagicItem.mockImplementation((item) => item.index === 'potion-of-healing');
        render(
            <MagicItems2024List
                filteredItems={createItems()}
                showMagicItem={mockShowMagicItem}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getAllByTestId('magic-item-card')).toHaveLength(1);
        expect(screen.getByText('Potion of Healing')).toBeInTheDocument();
        expect(screen.queryByText('Wand of Magic Missiles')).not.toBeInTheDocument();
    });

    it('sets expand to true for shownCard', () => {
        mockShowMagicItem.mockReturnValue(true);
        render(
            <MagicItems2024List
                filteredItems={createItems()}
                showMagicItem={mockShowMagicItem}
                shownCard="potion-of-healing"
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        const cards = screen.getAllByTestId('magic-item-card');
        expect(cards).toHaveLength(2);
        // Check that the first card (potion-of-healing) has expand=true
        expect(cards[0]).toHaveTextContent('true');
        // Check that the second card has expand=false
        expect(cards[1]).toHaveTextContent('false');
    });

    it('renders empty list when no items provided', () => {
        render(
            <MagicItems2024List
                filteredItems={[]}
                showMagicItem={mockShowMagicItem}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.queryAllByTestId('magic-item-card')).toHaveLength(0);
    });
});
