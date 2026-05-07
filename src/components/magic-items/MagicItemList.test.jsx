import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MagicItemList from './MagicItemList';

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

vi.mock('../common/MagicItemCard', () => ({
    default: function MockMagicItemCard({ magicItem, expand, onExpand }) {
     return (
         <div data-testid="magic-item-card">
           <span data-testid="item-name">{magicItem?.name}</span>
           <span data-testid="item-expanded">{expand ? 'expanded' : 'collapsed'}</span>
           <button data-testid="expand-btn" onClick={() => onExpand(true)}>Expand</button>
         </div>
       );
    }
}));

describe('MagicItemList', () => {
  const createMagicItem = (overrides = {}) => ({
     index: 'ring-of-protection',
     name: 'Ring of Protection',
     type: 'Ring',
     rarity: 'Rare',
     requiresAttunement: true,
     bookmarked: false,
      ...overrides
     });

  const mockShowMagicItem = vi.fn();
  const mockExpandCard = vi.fn();
  const mockHandleBookmarkChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    });

  it('renders a list container', () => {
    const { container } = render(
         <MagicItemList
          filteredItems={[]}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );
    expect(container.querySelector('div.list')).toBeInTheDocument();
    });

  it('renders no cards when filteredItems is empty', () => {
    render(
         <MagicItemList
          filteredItems={[]}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );
    expect(screen.queryByTestId('magic-item-card')).not.toBeInTheDocument();
    });

  it('renders all items when showMagicItem returns true for each', () => {
    const items = [
       createMagicItem({ index: 'ring-of-protection', name: 'Ring of Protection' }),
       createMagicItem({ index: 'potion-of-healing', name: 'Potion of Healing' })
      ];
    mockShowMagicItem.mockReturnValue(true);

    render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    expect(screen.getAllByTestId('magic-item-card')).toHaveLength(2);
    expect(screen.getByText('Ring of Protection')).toBeInTheDocument();
    expect(screen.getByText('Potion of Healing')).toBeInTheDocument();
    });

  it('only renders items for which showMagicItem returns true', () => {
    const items = [
       createMagicItem({ index: 'ring', name: 'Ring' }),
       createMagicItem({ index: 'potion', name: 'Potion' })
      ];
    mockShowMagicItem.mockImplementation((item) => item.index === 'ring');

    render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    expect(screen.getAllByTestId('magic-item-card')).toHaveLength(1);
    expect(screen.getByText('Ring')).toBeInTheDocument();
    });

  it('expands card whose index matches shownCard', () => {
    const items = [
       createMagicItem({ index: 'ring', name: 'Ring' }),
       createMagicItem({ index: 'potion', name: 'Potion' })
      ];
    mockShowMagicItem.mockReturnValue(true);

    render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard="ring"
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    const expandedSpans = screen.getAllByTestId('item-expanded');
    expect(expandedSpans[0]).toHaveTextContent('expanded');
    expect(expandedSpans[1]).toHaveTextContent('collapsed');
    });

  it('no cards are expanded when shownCard is empty', () => {
    const items = [createMagicItem({ index: 'ring', name: 'Ring' })];
    mockShowMagicItem.mockReturnValue(true);

    render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    expect(screen.getByTestId('item-expanded')).toHaveTextContent('collapsed');
    });

  it('calls expandCard with correct index on expand button click', () => {
    const items = [createMagicItem({ index: 'ring' })];
    mockShowMagicItem.mockReturnValue(true);

    render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    fireEvent.click(screen.getByTestId('expand-btn'));
    expect(mockExpandCard).toHaveBeenCalledWith('ring', true);
    });

  it('renders each wrapper div with correct id attribute', () => {
    const items = [
       createMagicItem({ index: 'ring-of-protection' }),
       createMagicItem({ index: 'potion-of-healing' })
      ];
    mockShowMagicItem.mockReturnValue(true);

    const { container } = render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    expect(container.querySelector('[id="ring-of-protection"]')).toBeInTheDocument();
    expect(container.querySelector('[id="potion-of-healing"]')).toBeInTheDocument();
    });

  it('handles single item list', () => {
    mockShowMagicItem.mockReturnValue(true);
    render(
         <MagicItemList
          filteredItems={[createMagicItem()]}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );
    expect(screen.getAllByTestId('magic-item-card')).toHaveLength(1);
    });

  it('handles items with missing optional fields', () => {
    const items = [{ index: 'unknown', name: 'Unknown' }];
    mockShowMagicItem.mockReturnValue(true);

    render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard=""
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    expect(screen.getAllByTestId('magic-item-card')).toHaveLength(1);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

  it('no cards expand when shownCard does not match any item index', () => {
    const items = [createMagicItem({ index: 'ring' })];
    mockShowMagicItem.mockReturnValue(true);

    render(
         <MagicItemList
          filteredItems={items}
          showMagicItem={mockShowMagicItem}
          shownCard="non-existent"
          expandCard={mockExpandCard}
          handleBookmarkChange={mockHandleBookmarkChange}
         />
       );

    expect(screen.getByTestId('item-expanded')).toHaveTextContent('collapsed');
    });
});
