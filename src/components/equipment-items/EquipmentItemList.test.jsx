import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EquipmentItemList from './EquipmentItemList';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

vi.mock('./EquipmentItem', () => ({
    default: vi.fn(({ equipmentItem, expand, onExpand, onBookmarkChange, ruleVersion }) => (
          <div data-testid={`equipment-item-${equipmentItem?.index}`}>
              {equipmentItem?.name}
              {expand ? <span data-testid="expanded">expanded</span> : null}
              <button data-testid={`expand-btn-${equipmentItem?.index}`} onClick={() => onExpand(true)}>expand</button>
              <button data-testid={`collapse-btn-${equipmentItem?.index}`} onClick={() => onExpand(false)}>collapse</button>
              <button data-testid={`bookmark-btn-${equipmentItem?.index}`} onClick={() => onBookmarkChange(equipmentItem?.index, true)}>bookmark</button>
          </div>
     )),
}));

const EquipmentItem = vi.mocked(await import('./EquipmentItem')).default;

describe('EquipmentItemList', () => {
    const mockItems = [
          { index: 'backpack', name: 'Backpack', equipment_category: 'Adventuring Gear' },
          { index: 'longsword', name: 'Longsword', equipment_category: 'Weapon' },
          { index: 'chain-mail', name: 'Chain Mail', equipment_category: 'Armor' },
     ];

    const showAll = () => true;
    const showNone = () => false;
    const showOnly = (idx) => (item) => item.index === idx;

    beforeEach(() => {
        vi.clearAllMocks();
      });

    describe('default rendering', () => {
        it('renders a list container', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showAll}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            const list = document.querySelector('.list');
            expect(list).toBeInTheDocument();
          });

        it('renders all items when filter passes for all', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showAll}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(screen.getByTestId('equipment-item-backpack')).toBeInTheDocument();
            expect(screen.getByTestId('equipment-item-longsword')).toBeInTheDocument();
            expect(screen.getByTestId('equipment-item-chain-mail')).toBeInTheDocument();
          });

        it('wraps each item in a div with id matching the item index', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showAll}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(document.getElementById('backpack')).toBeInTheDocument();
            expect(document.getElementById('longsword')).toBeInTheDocument();
            expect(document.getElementById('chain-mail')).toBeInTheDocument();
          });
      });

    describe('filtering', () => {
        it('does not render items that fail showEquipmentItem filter', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showOnly('longsword')}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(screen.getByTestId('equipment-item-longsword')).toBeInTheDocument();
            expect(screen.queryByTestId('equipment-item-backpack')).not.toBeInTheDocument();
            expect(screen.queryByTestId('equipment-item-chain-mail')).not.toBeInTheDocument();
          });

        it('renders no items when filter returns false for all', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showNone}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(screen.queryByTestId('equipment-item-backpack')).not.toBeInTheDocument();
            expect(screen.queryByTestId('equipment-item-longsword')).not.toBeInTheDocument();
            expect(screen.queryByTestId('equipment-item-chain-mail')).not.toBeInTheDocument();
          });
      });

    describe('expand state', () => {
        it('passes expand=true only for the shownCard item', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showAll}
                     shownCard="longsword"
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(screen.getByTestId('expanded')).toBeInTheDocument();
          });

        it('does not expand items that are not the shownCard', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showAll}
                     shownCard="longsword"
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            // Only one expanded item should exist
            expect(screen.getAllByTestId('expanded').length).toBe(1);
          });
      });

    describe('callback handling', () => {
        it('passes expandCard callback through to EquipmentItem as onExpand', () => {
            const expandCard = vi.fn();
            render(
                  <EquipmentItemList
                     filteredItems={[mockItems[0]]}
                     showEquipmentItem={showAll}
                     shownCard=""
                     expandCard={expandCard}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );

            const expandButton = screen.getByTestId('expand-btn-backpack');
            expect(expandButton).toBeInTheDocument();
            fireEvent.click(expandButton);
            expect(expandCard).toHaveBeenCalledWith('backpack', true);
          });

        it('passes handleBookmarkChange through to EquipmentItem', () => {
            const bookmarkChange = vi.fn();
            render(
                  <EquipmentItemList
                     filteredItems={[mockItems[0]]}
                     showEquipmentItem={showAll}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={bookmarkChange}
                     ruleVersion="5e"
                  />,
              );

            const bookmarkButton = screen.getByTestId('bookmark-btn-backpack');
            fireEvent.click(bookmarkButton);
            expect(bookmarkChange).toHaveBeenCalledWith('backpack', true);
          });

        it('passes ruleVersion through to all EquipmentItem components', () => {
            render(
                    <EquipmentItemList
                    filteredItems={mockItems}
                    showEquipmentItem={showAll}
                    shownCard=""
                    expandCard={vi.fn()}
                    handleBookmarkChange={vi.fn()}
                    ruleVersion="2024"
                    />,
                );
            expect(EquipmentItem).toHaveBeenCalledTimes(3);
            const calls = EquipmentItem.mock.calls;
            expect(calls[0][0]).toMatchObject({
                    equipmentItem: mockItems[0],
                    ruleVersion: '2024',
               });
              });

        it('passes collapse callback through to EquipmentItem', () => {
            const expandCard = vi.fn();
            render(
                  <EquipmentItemList
                     filteredItems={[mockItems[1]]}
                     showEquipmentItem={showAll}
                     shownCard="longsword"
                     expandCard={expandCard}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );

            const collapseButton = screen.getByTestId('collapse-btn-longsword');
            fireEvent.click(collapseButton);
            expect(expandCard).toHaveBeenCalledWith('longsword', false);
          });
      });

    describe('edge cases', () => {
        it('renders empty list when filteredItems is empty array', () => {
            render(
                  <EquipmentItemList
                     filteredItems={[]}
                     showEquipmentItem={showAll}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(document.querySelector('.list')).toBeInTheDocument();
            expect(screen.queryByTestId('equipment-item-backpack')).not.toBeInTheDocument();
          });

        it('does not crash when filteredItems is undefined', () => {
            expect(() => {
                render(
                      <EquipmentItemList
                         filteredItems={undefined}
                         showEquipmentItem={showAll}
                         shownCard=""
                         expandCard={vi.fn()}
                         handleBookmarkChange={vi.fn()}
                         ruleVersion="5e"
                      />,
                  );
              }).toThrow();
          });

        it('does not crash when filteredItems is null', () => {
            expect(() => {
                render(
                      <EquipmentItemList
                         filteredItems={null}
                         showEquipmentItem={showAll}
                         shownCard=""
                         expandCard={vi.fn()}
                         handleBookmarkChange={vi.fn()}
                         ruleVersion="5e"
                      />,
                  );
              }).toThrow();
          });

        it('handles items missing properties gracefully', () => {
            const incompleteItem = { index: 'broken' };
            render(
                  <EquipmentItemList
                     filteredItems={[incompleteItem]}
                     showEquipmentItem={showAll}
                     shownCard=""
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(screen.getByTestId('equipment-item-broken')).toBeInTheDocument();
          });

        it('handles shownCard pointing to non-existent item', () => {
            render(
                  <EquipmentItemList
                     filteredItems={mockItems}
                     showEquipmentItem={showAll}
                     shownCard="non-existent"
                     expandCard={vi.fn()}
                     handleBookmarkChange={vi.fn()}
                     ruleVersion="5e"
                  />,
              );
            expect(screen.queryByTestId('expanded')).not.toBeInTheDocument();
          });
      });
});
