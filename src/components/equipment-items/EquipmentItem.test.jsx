import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EquipmentItem from './EquipmentItem';
import { RuleVersionProvider } from '../../context/RuleVersionContext';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

const createEquipmentItem = (overrides = {}) => ({
    index: 'longsword',
    name: 'Longsword',
    equipment_category: 'Weapon',
    weapon_category: 'Martial',
    weapon_range: 'Melee',
    cost: { quantity: 15, unit: 'gp' },
    weight: 3,
    damage: { damage_dice: '1d8', damage_type: { name: 'slashing' } },
    properties: ['Versatile'],
    desc: ['A long blade with a sharp edge.'],
    bookmarked: false,
    ...overrides,
});

const wrap = (ui) => (
    <RuleVersionProvider>{ui}</RuleVersionProvider>
);

describe('EquipmentItem', () => {
    const onExpand = vi.fn();
    const onBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('edge cases', () => {
        it('returns null when equipmentItem is undefined', () => {
            const { container } = render(
                wrap(<EquipmentItem equipmentItem={undefined} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />),
            );
            expect(container.querySelector('.card')).not.toBeInTheDocument();
        });

        it('returns null when equipmentItem is null', () => {
            const { container } = render(
                wrap(<EquipmentItem equipmentItem={null} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />),
            );
            expect(container.querySelector('.card')).not.toBeInTheDocument();
        });

        it('handles empty object gracefully', () => {
            const { container } = render(
                wrap(<EquipmentItem equipmentItem={{}} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />),
            );
            expect(container.querySelector('.card')).not.toBeInTheDocument();
        });
    });

    describe('default rendering', () => {
        it('renders the item name in the card header', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(screen.getByText((content, el) => el?.tagName === 'DIV' && el?.className === 'card-title' && content === 'Longsword')).toBeInTheDocument();
        });

        it('renders the category in card header', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.body.textContent).toContain('Weapon,');
        });

        it('renders cost in card header', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.body.textContent).toContain('cost 15 gp');
        });

        it('renders weight when present', () => {
            const item = createEquipmentItem({ weight: 3 });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.body.textContent).toContain('3 lb.');
        });

        it('does not render weight when undefined', () => {
            const item = createEquipmentItem({ weight: undefined });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.body.textContent).not.toContain('lb.');
        });

        it('does not render weight when zero', () => {
            const item = createEquipmentItem({ weight: 0 });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.body.textContent).not.toContain('lb.');
        });

        it('does not render weight when empty string', () => {
            const item = createEquipmentItem({ weight: '' });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.body.textContent).not.toContain('lb.');
        });

        it('renders bookmarked checkbox', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });

        it('checkbox is unchecked when not bookmarked', () => {
            const item = createEquipmentItem({ bookmarked: false });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });

        it('checkbox is checked when bookmarked', () => {
            const item = createEquipmentItem({ bookmarked: true });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(screen.getByRole('checkbox')).toBeChecked();
        });

        it('sets card id from equipmentItem.index', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.getElementById('longsword')).toBeInTheDocument();
        });

        it('does not show card-body when collapsed', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.querySelector('.card-body')).not.toBeInTheDocument();
        });
    });

    describe('expand/collapse', () => {
        it('expands card when expand prop is true', () => {
            const item = createEquipmentItem();
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.querySelector('.card-body')).toBeInTheDocument();
            expect(document.querySelector('.card')).toHaveClass('active');
        });

        it('stays collapsed when expand is false', () => {
            const item = createEquipmentItem();
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand={false}
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.querySelector('.card-body')).not.toBeInTheDocument();
        });

        it('toggles when clicking the card header', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            fireEvent.click(screen.getByText((content, el) => el?.className === 'card-title'));
            expect(onExpand).toHaveBeenCalledWith(true);
        });

        it('collapses when clicking an already expanded card', () => {
            const item = createEquipmentItem();
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            fireEvent.click(screen.getByText((content, el) => el?.className === 'card-title'));
            expect(onExpand).toHaveBeenCalledWith(false);
        });
    });

    describe('bookmark', () => {
        it('calls onBookmarkChange when checkbox is toggled on', () => {
            const item = createEquipmentItem({ bookmarked: false });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            fireEvent.click(screen.getByRole('checkbox'));
            expect(onBookmarkChange).toHaveBeenCalledWith('longsword', true);
        });

        it('calls onBookmarkChange when checkbox is toggled off', () => {
            const item = createEquipmentItem({ bookmarked: true });
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            fireEvent.click(screen.getByRole('checkbox'));
            expect(onBookmarkChange).toHaveBeenCalledWith('longsword', false);
        });

        it('does not propagate click when clicking checkbox', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            fireEvent.click(screen.getByRole('checkbox'));
            expect(onBookmarkChange).toHaveBeenCalled();
            expect(onExpand).not.toHaveBeenCalled();
        });

        it('does not expand when clicking bookmark label', () => {
            const item = createEquipmentItem();
            render(wrap(<EquipmentItem equipmentItem={item} onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            fireEvent.click(screen.getByText('Bookmarked'));
            expect(onExpand).not.toHaveBeenCalled();
        });
    });

    describe('weapon details when expanded', () => {
        it('shows weapon category when expanded', () => {
            const item = createEquipmentItem();
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Martial');
        });

        it('shows melee range when expanded', () => {
            const item = createEquipmentItem({ weapon_range: 'Melee' });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Range:');
            expect(document.body.textContent).toContain('Melee');
        });

        it('shows ranged range details when expanded', () => {
            const item = createEquipmentItem({
                weapon_range: 'Ranged',
                range: { normal: 80, long: 320 },
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('80 feet');
            expect(document.body.textContent).toContain('320 feet');
        });

        it('shows damage dice and type when expanded', () => {
            const item = createEquipmentItem();
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('1d8');
            expect(document.body.textContent).toContain('slashing');
        });

        it('shows two-handed damage when present', () => {
            const item = createEquipmentItem({
                two_handed_damage: { damage_dice: '1d10', damage_type: { name: 'slashing' } },
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Two Handed Damage');
        });

        it('does not show two-handed damage when absent', () => {
            const item = createEquipmentItem({ two_handed_damage: undefined });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('Two Handed Damage');
        });

        it('shows throw range when present', () => {
            const item = createEquipmentItem({
                throw_range: { normal: 20, long: 60 },
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Throw Range');
        });

        it('does not show throw range when absent', () => {
            const item = createEquipmentItem({ throw_range: undefined });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('Throw Range');
        });

        it('shows weapon properties when present', () => {
            const item = createEquipmentItem({ properties: ['Versatile', 'Heavy'] });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Properties:');
            expect(document.body.textContent).toContain('Versatile');
            expect(document.body.textContent).toContain('Heavy');
        });

        it('does not show properties when empty', () => {
            const item = createEquipmentItem({ properties: [] });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('Properties:');
        });

        it('shows weapon mastery for 2024 rule version', () => {
            const item = createEquipmentItem({ mastery: 'Pommel' });
            render(
                 wrap(
                      <EquipmentItem
                         equipmentItem={item}
                         expand
                         onExpand={onExpand}
                         onBookmarkChange={onBookmarkChange}
                         ruleVersion="2024"
                      />
                  ),
              );
            expect(document.body.textContent).toContain('Weapon Mastery');
         });

        it('does not show weapon mastery for 5e rule version', () => {
            const item = createEquipmentItem({ mastery: 'Pommel', equipment_category: 'Weapon' });
            render(
                 wrap(
                       <EquipmentItem
                          equipmentItem={item}
                          expand
                          onExpand={onExpand}
                          onBookmarkChange={onBookmarkChange}
                          ruleVersion="5e"
                       />
                   ),
               );
            expect(document.body.textContent).not.toContain('Weapon Mastery');
          });
    });

    describe('adventuring gear details', () => {
        it('shows gear category when expanded', () => {
            const item = createEquipmentItem({
                equipment_category: 'Adventuring Gear',
                gear_category: 'Containers',
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Containers');
        });

        it('shows contents when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Adventuring Gear',
                gear_category: 'Containers',
                contents: [
                    { quantity: 2, item: { name: 'Bottle' } },
                    { quantity: 1, item: { name: 'Bag' } },
                ],
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('2 Bottle');
            expect(document.body.textContent).toContain('1 Bag');
        });

        it('does not show contents when empty', () => {
            const item = createEquipmentItem({
                equipment_category: 'Adventuring Gear',
                gear_category: 'Containers',
                contents: [],
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('Contents');
        });

        it('does not show contents when undefined', () => {
            const item = createEquipmentItem({
                equipment_category: 'Adventuring Gear',
                gear_category: 'Containers',
                contents: undefined,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('Contents');
        });
    });

    describe('armor details', () => {
        it('shows armor category when expanded', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                armor_category: 'Medium',
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Medium');
        });

        it('shows armor class base value', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                armor_class: { base: 14, dex_bonus: false, max_bonus: null },
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('14');
        });

        it('shows DEX bonus indicator when applicable', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('DEX bonus');
        });

        it('shows max DEX bonus when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('max 2');
        });

        it('does not show max DEX bonus when null', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                armor_class: { base: 16, dex_bonus: false, max_bonus: null },
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('max');
        });

        it('does not show max DEX bonus when undefined', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                armor_class: { base: 16, dex_bonus: false, max_bonus: undefined },
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('max');
        });

        it('shows strength minimum when greater than 0', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                str_minimum: 13,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Strength Min');
        });

        it('does not show strength minimum when 0', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                str_minimum: 0,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('Strength Min');
        });

        it('shows stealth disadvantage when applicable', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                stealth_disadvantage: true,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Disadvantages');
            expect(document.body.textContent).toContain('Stealth');
        });

        it('does not show stealth disadvantage when false', () => {
            const item = createEquipmentItem({
                equipment_category: 'Armor',
                stealth_disadvantage: false,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).not.toContain('Disadvantages');
        });
    });

    describe('mounts and vehicles details', () => {
        it('shows speed when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                speed: { quantity: 4, unit: 'mph' },
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Speed');
            expect(document.body.textContent).toContain('96 miles per day');
        });

        it('shows capacity when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                capacity: '2 tons',
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Capacity');
        });

        it('shows armor class for vehicles when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                armor_class: 10,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Armor Class');
        });

        it('shows hit points when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                hit_points: 15,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Hit Points');
        });

        it('shows damage threshold when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                'damage-threshold': 10,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Damage Threshold');
        });

        it('shows crew when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                crew: '8 minimum',
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Crew');
        });

        it('shows passengers when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                passengers: '10',
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Passengers');
        });

        it('shows cargo when present', () => {
            const item = createEquipmentItem({
                equipment_category: 'Mounts and Vehicles',
                cargo: { quantity: 5, unit: 'tons' },
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Cargo');
        });
    });

    describe('property details', () => {
        it('shows construction time when category is Property', () => {
            const item = createEquipmentItem({
                equipment_category: 'Property',
                construction_time: { quantity: 30, unit: 'days' },
                maintenance_cost: { quantity: 100, unit: 'gp', interval: 'per week' },
                skilled_hirelings: 5,
                untrained_hirelings: 20,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Construction Time');
            expect(document.body.textContent).toContain('Maintenance Cost');
            expect(document.body.textContent).toContain('Skilled Hirelings');
            expect(document.body.textContent).toContain('Unskilled Hirelings');
        });
    });

    describe('tools details', () => {
        it('shows tool category when expanded', () => {
            const item = createEquipmentItem({
                equipment_category: 'Tools',
                tool_category: 'Gaming Sets',
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Gaming Sets');
        });

        it('does not show 2024 tool properties for 5e rule version', () => {
            const item = createEquipmentItem({
                equipment_category: 'Tools',
                tool_category: 'Artisan Tools',
                ability: 'Dexterity',
                utilize: 12,
                craft: 8,
                weapon_category: undefined,
                weapon_range: undefined,
                damage: undefined,
                properties: undefined,
            });
            render(wrap(<EquipmentItem equipmentItem={item} expand onExpand={onExpand} onBookmarkChange={onBookmarkChange} />));
            expect(document.body.textContent).not.toContain('Ability');
        });
    });

    describe('description and special', () => {
        it('shows description heading when desc is present', () => {
            const item = createEquipmentItem();
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(screen.getByText('Description')).toBeInTheDocument();
        });

        it('shows each description entry', () => {
            const item = createEquipmentItem({ desc: ['First paragraph.', 'Second paragraph.'] });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(screen.getByText('First paragraph.')).toBeInTheDocument();
            expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
        });

        it('does not show description when desc is undefined', () => {
            const item = createEquipmentItem({ desc: undefined });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(screen.queryByText('Description')).not.toBeInTheDocument();
        });

        it('does not show description when desc is empty array', () => {
            const item = createEquipmentItem({ desc: [] });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(screen.queryByText('Description')).not.toBeInTheDocument();
        });

        it('shows special heading when special is present', () => {
            const item = createEquipmentItem({ special: ['Special ability 1.'] });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(screen.getByText('Special')).toBeInTheDocument();
        });

        it('shows each special entry', () => {
            const item = createEquipmentItem({ special: ['Special 1.', 'Special 2.'] });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(screen.getByText('Special 1.')).toBeInTheDocument();
            expect(screen.getByText('Special 2.')).toBeInTheDocument();
        });

        it('does not show special when undefined', () => {
            const item = createEquipmentItem({ special: undefined });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            const specialHeaders = document.querySelectorAll('h5');
            const specialHeader = Array.from(specialHeaders).find(h => h.textContent === 'Special');
            expect(specialHeader).toBeUndefined();
        });
    });

    describe('weapon_range typo handling', () => {
        it('normalizes Meele to melee in display', () => {
            const item = createEquipmentItem({
                weapon_range: 'Meele',
            });
            render(
                wrap(
                    <EquipmentItem
                        equipmentItem={item}
                        expand
                        onExpand={onExpand}
                        onBookmarkChange={onBookmarkChange}
                    />,
                ),
            );
            expect(document.body.textContent).toContain('Melee');
        });
    });
});
