import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MagicItemCard from './MagicItemCard';

vi.mock('../../utils/htmlUtils', () => ({
   renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('MagicItemCard', () => {
   const createMagicItem = (overrides = {}) => ({
      index: 'ring-of-protection',
      name: 'Ring of Protection',
      type: 'Ring',
      rarity: 'Rare',
      subtype: null,
      requiresAttunement: true,
      bookmarked: false,
      description: 'You have a +1 bonus to AC and saving throws.',
             ...overrides,
             });

   const mockOnExpand = vi.fn();
   const mockOnBookmarkChange = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();
       });

   it('returns null when magicItem is not provided', () => {
      const { container } = render(
         <MagicItemCard
            magicItem={null}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(container.firstChild).toBeNull();
         });

   it('displays magic item name and type', () => {
      const magicItem = createMagicItem();
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.getByText('Ring of Protection')).toBeInTheDocument();
      expect(screen.getByText(/Ring, Rare/)).toBeInTheDocument();
         });

   it('displays requires attunement when applicable', () => {
      const magicItem = createMagicItem({ requiresAttunement: true });
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.getByText(/Requires Attunement/)).toBeInTheDocument();
         });

   it('does not display requires attunement when not required', () => {
      const magicItem = createMagicItem({ requiresAttunement: false });
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.queryByText(/Requires Attunement/)).not.toBeInTheDocument();
         });

   it('displays subtype when present', () => {
      const magicItem = createMagicItem({ subtype: 'Weapon' });
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.getByText(/Weapon/)).toBeInTheDocument();
         });

   it('is collapsed by default when expand is false', () => {
      const magicItem = createMagicItem();
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.queryByText(/Description:/)).not.toBeInTheDocument();
         });

   it('is expanded when expand is true', () => {
      const magicItem = createMagicItem();
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={true}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.getByText(/Description:/)).toBeInTheDocument();
         });

   it('toggles expansion on header click', () => {
      const magicItem = createMagicItem();
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
              />
            );
      const cardTitle = screen.getByText('Ring of Protection');
      fireEvent.click(cardTitle);
      expect(mockOnExpand).toHaveBeenCalledWith(true);
         });

   it('toggles bookmark status on checkbox change', () => {
      const magicItem = createMagicItem({ bookmarked: false });
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
      fireEvent.click(checkbox);
      expect(mockOnBookmarkChange).toHaveBeenCalledWith('ring-of-protection', true);
         });

   it('displays description when expanded', () => {
      const magicItem = createMagicItem();
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={true}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.getByText(/Description:/)).toBeInTheDocument();
         });

   it('updates when expand prop changes externally', () => {
      const magicItem = createMagicItem();
      const { rerender } = render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.queryByText(/Description:/)).not.toBeInTheDocument();

      rerender(
         <MagicItemCard
            magicItem={magicItem}
            expand={true}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.getByText(/Description:/)).toBeInTheDocument();
         });

   it('handles magic item without description', () => {
      const magicItem = createMagicItem({ description: null });
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={true}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      expect(screen.queryByText(/Description:/)).not.toBeInTheDocument();
         });

   it('handles bookmarked magic item', () => {
      const magicItem = createMagicItem({ bookmarked: true });
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
      expect(checkbox).toBeChecked();
         });

   it('toggles bookmark from true to false', () => {
      const magicItem = createMagicItem({ bookmarked: true });
      render(
         <MagicItemCard
            magicItem={magicItem}
            expand={false}
            onExpand={mockOnExpand}
            onBookmarkChange={mockOnBookmarkChange}
            />
          );
      const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
      fireEvent.click(checkbox);
      expect(mockOnBookmarkChange).toHaveBeenCalledWith('ring-of-protection', false);
         });
});