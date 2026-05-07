import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MagicItem from './MagicItem';

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

vi.mock('../common/MagicItemCard', () => ({
    default: function MockMagicItemCard({ magicItem, expand }) {
     if (!magicItem) return null;
     return (
         <div data-testid="magic-item-card">
           <span data-testid="item-name">{magicItem.name}</span>
           <span data-testid="item-type">{magicItem.type}</span>
           <span data-testid="item-rarity">{magicItem.rarity}</span>
           <span data-testid="item-attunement">{magicItem.requiresAttunement ? 'requires' : 'no-attunement'}</span>
           <span data-testid="item-expanded">{expand ? 'expanded' : 'collapsed'}</span>
           <span data-testid="item-version">{magicItem.version}</span>
           <span data-testid="item-subtype">{magicItem.subtype || 'none'}</span>
           <span data-testid="item-bookmarked">{magicItem.bookmarked ? 'bookmarked' : 'not-bookmarked'}</span>
         </div>
       );
    }
}));

describe('MagicItem', () => {
  const createMagicItem = (overrides = {}) => ({
     index: 'ring-of-protection',
     name: 'Ring of Protection',
     type: 'Ring',
     rarity: 'Rare',
     subtype: null,
     requiresAttunement: true,
     bookmarked: false,
     description: 'You have a +1 bonus to AC and saving throws.',
      ...overrides
     });

  beforeEach(() => {
    vi.clearAllMocks();
    });

  it('returns null when magicItem is null', () => {
    const { container } = render(<MagicItem magicItem={null} />);
    expect(container.firstChild).toBeNull();
    });

  it('returns null when magicItem is undefined', () => {
    const { container } = render(<MagicItem magicItem={undefined} />);
    expect(container.firstChild).toBeNull();
    });

  it('returns null when magicItem is a falsy number', () => {
    const { container } = render(<MagicItem magicItem={0} />);
    expect(container.firstChild).toBeNull();
    });

  it('renders MagicItemCard with normalized 5e data', () => {
    render(<MagicItem magicItem={createMagicItem()} />);
    expect(screen.getByTestId('magic-item-card')).toBeInTheDocument();
    expect(screen.getByTestId('item-name')).toHaveTextContent('Ring of Protection');
    expect(screen.getByTestId('item-type')).toHaveTextContent('Ring');
    expect(screen.getByTestId('item-rarity')).toHaveTextContent('Rare');
     });

  it('passes expand true to MagicItemCard', () => {
    render(<MagicItem magicItem={createMagicItem()} expand={true} />);
    expect(screen.getByTestId('item-expanded')).toHaveTextContent('expanded');
    });

  it('passes expand false to MagicItemCard', () => {
    render(<MagicItem magicItem={createMagicItem()} expand={false} />);
    expect(screen.getByTestId('item-expanded')).toHaveTextContent('collapsed');
    });

  it('normalizes item with attunement required', () => {
    render(<MagicItem magicItem={createMagicItem({ requiresAttunement: true })} />);
    expect(screen.getByTestId('item-attunement')).toHaveTextContent('requires');
    });

  it('normalizes item with attunement not required', () => {
    render(<MagicItem magicItem={createMagicItem({ requiresAttunement: false })} />);
    expect(screen.getByTestId('item-attunement')).toHaveTextContent('no-attunement');
    });

  it('normalizes item with subtype present', () => {
    render(<MagicItem magicItem={createMagicItem({ subtype: 'Wondrous item' })} />);
    expect(screen.getByTestId('item-subtype')).toHaveTextContent('Wondrous item');
    });

  it('normalizes item with no subtype', () => {
    render(<MagicItem magicItem={createMagicItem({ subtype: null })} />);
    expect(screen.getByTestId('item-subtype')).toHaveTextContent('none');
    });

  it('normalizes bookmarked item', () => {
    render(<MagicItem magicItem={createMagicItem({ bookmarked: true })} />);
    expect(screen.getByTestId('item-bookmarked')).toHaveTextContent('bookmarked');
    });

  it('normalizes non-bookmarked item', () => {
    render(<MagicItem magicItem={createMagicItem({ bookmarked: false })} />);
    expect(screen.getByTestId('item-bookmarked')).toHaveTextContent('not-bookmarked');
    });

  it('normalizes item with minimal required fields', () => {
    render(<MagicItem magicItem={{ index: 'potion', name: 'Potion', type: 'Potion', rarity: 'Common' }} />);
    expect(screen.getByTestId('item-name')).toHaveTextContent('Potion');
    expect(screen.getByTestId('item-type')).toHaveTextContent('Potion');
    expect(screen.getByTestId('item-rarity')).toHaveTextContent('Common');
    expect(screen.getByTestId('item-version')).toHaveTextContent('5e');
    });

  it('normalizes item version to 5e', () => {
    render(<MagicItem magicItem={createMagicItem()} />);
    expect(screen.getByTestId('item-version')).toHaveTextContent('5e');
    });

  it('handles item with no description', () => {
    render(<MagicItem magicItem={createMagicItem({ description: null })} />);
    expect(screen.getByTestId('item-name')).toBeInTheDocument();
    });

  it('handles item with empty name', () => {
    render(<MagicItem magicItem={createMagicItem({ name: '' })} />);
    expect(screen.getByTestId('item-name')).toBeInTheDocument();
    });
});
