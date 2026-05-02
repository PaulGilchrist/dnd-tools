import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MonsterCard from './MonsterCard';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

vi.mock('./MonsterStats', () => ({
    default: vi.fn(({ monster, handleImageClick }) => (
        <div data-testid="monster-stats">Stats for {monster?.name}</div>
    )),
}));

vi.mock('./MonsterAbilityScores', () => ({
    default: vi.fn(({ monster }) => (
        <div data-testid="ability-scores">Scores for {monster?.name}</div>
    )),
}));

vi.mock('./MonsterDefenses', () => ({
    default: vi.fn(({ monster }) => (
        <div data-testid="defenses">Defenses for {monster?.name}</div>
    )),
}));

vi.mock('./MonsterActions', () => ({
    default: vi.fn(({ monster, sectionType }) => (
        <div data-testid={`actions-${sectionType}`}>{sectionType} for {monster?.name}</div>
    )),
}));

vi.mock('./MonsterReactions', () => ({
    default: vi.fn(({ monster }) => (
        <div data-testid="reactions">Reactions for {monster?.name}</div>
    )),
}));

vi.mock('./MonsterLegendaryActions', () => ({
    default: vi.fn(({ monster }) => (
        <div data-testid="legendary-actions">Legendary for {monster?.name}</div>
    )),
}));

vi.mock('./MonsterRegionalEffects', () => ({
    default: vi.fn(({ monster }) => (
        <div data-testid="regional-effects">Regional for {monster?.name}</div>
    )),
}));

describe('MonsterCard', () => {
    const createMonster = (overrides = {}) => ({
        index: 'goblin',
        name: 'Goblin',
        size: 'Small',
        type: 'Humanoid',
        subtype: 'Goblinoid',
        alignment: 'neutral evil',
        bookmarked: false,
        image: '/images/goblin.jpg',
        traits: [{ name: 'Ambush', desc: 'Surprise on ambush' }],
        actions: [{ name: 'Scimitar', damage: '4 slashing' }],
        reactions: [],
        legendaryActions: [],
        lairActions: {},
        regionalEffects: null,
        desc: null,
        page: null,
        book: null,
        ...overrides,
    });

    const mockOnExpand = vi.fn();
    const mockOnBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when monster is not provided', () => {
        const { container } = render(
            <MonsterCard monster={null} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('returns null when monster is undefined', () => {
        const { container } = render(
            <MonsterCard monster={undefined} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('returns null when monster is an empty object', () => {
        const { container } = render(
            <MonsterCard monster={{}} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays monster name', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    it('displays size and type', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Small humanoid')).toBeInTheDocument();
    });

    it('displays subtype when present and different from type', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('(Goblinoid)')).toBeInTheDocument();
    });

    it('does not display subtype when same as type', () => {
        render(
            <MonsterCard
                monster={createMonster({ subtype: 'Humanoid', type: 'Humanoid' })}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('(Humanoid)')).not.toBeInTheDocument();
    });

    it('does not display subtype when not present', () => {
        render(
            <MonsterCard
                monster={createMonster({ subtype: null })}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('(Goblinoid)')).not.toBeInTheDocument();
    });

    it('displays alignment', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('neutral evil')).toBeInTheDocument();
    });

    it('uses card id from monster index', () => {
        const { container } = render(
            <MonsterCard
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(container.querySelector('#goblin')).toBeInTheDocument();
    });

    it('does not show bookmark checkbox when cardType is inner', () => {
        render(
            <MonsterCard
                cardType="inner"
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByRole('checkbox', { name: 'Bookmarked' })).not.toBeInTheDocument();
    });

    it('shows bookmark checkbox when cardType is outer', () => {
        render(
            <MonsterCard
                cardType="outer"
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByRole('checkbox', { name: 'Bookmarked' })).toBeInTheDocument();
    });

    it('defaults cardType to outer', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByRole('checkbox', { name: 'Bookmarked' })).toBeInTheDocument();
    });

    it('does not add inner class when cardType is outer', () => {
        const { container } = render(
            <MonsterCard
                cardType="outer"
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(container.querySelector('.card')).not.toHaveClass('inner');
    });

    it('adds inner class when cardType is inner', () => {
        const { container } = render(
            <MonsterCard
                cardType="inner"
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(container.querySelector('.card')).toHaveClass('inner');
    });

    it('is collapsed by default when expand is false', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={false}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('monster-stats')).not.toBeInTheDocument();
    });

    it('is expanded when expand is true', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByTestId('monster-stats')).toBeInTheDocument();
    });

    it('adds active class when expanded', () => {
        const { container } = render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(container.querySelector('.card')).toHaveClass('active');
    });

    it('does not add active class when collapsed', () => {
        const { container } = render(
            <MonsterCard
                monster={createMonster()}
                expand={false}
                onExpand={mockOnExpand}
            />
        );
        expect(container.querySelector('.card')).not.toHaveClass('active');
    });

    it('expands on header click', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={false}
                onExpand={mockOnExpand}
            />
        );
        const clickable = screen.getByText('Goblin').closest('.clickable');
        fireEvent.click(clickable);
        expect(mockOnExpand).toHaveBeenCalledWith(true);
        expect(screen.getByTestId('monster-stats')).toBeInTheDocument();
    });

    it('collapses on header click when already expanded', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        const clickable = screen.getByText('Goblin').closest('.clickable');
        fireEvent.click(clickable);
        expect(mockOnExpand).toHaveBeenCalledWith(false);
    });

    it('calls onExpand with true when toggling from collapsed', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={false}
                onExpand={mockOnExpand}
            />
        );
        fireEvent.click(screen.getByText('Goblin').closest('.clickable'));
        expect(mockOnExpand).toHaveBeenCalledWith(true);
    });

    it('calls onExpand with false when toggling from expanded', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        fireEvent.click(screen.getByText('Goblin').closest('.clickable'));
        expect(mockOnExpand).toHaveBeenCalledWith(false);
    });

    it('does not call onExpand when not provided', () => {
        const noOpExpand = vi.fn();
        render(
            <MonsterCard
                monster={createMonster()}
                expand={false}
            />
        );
        fireEvent.click(screen.getByText('Goblin').closest('.clickable'));
        expect(mockOnExpand).not.toHaveBeenCalled();
    });

    it('toggles bookmark when checkbox is changed', () => {
        render(
            <MonsterCard
                monster={createMonster({ bookmarked: false })}
                onExpand={mockOnExpand}
                onBookmarkChange={mockOnBookmarkChange}
            />
        );
        const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
        fireEvent.click(checkbox);
        expect(mockOnBookmarkChange).toHaveBeenCalledWith('goblin', true);
    });

    it('shows bookmark checkbox as checked when monster is bookmarked', () => {
        render(
            <MonsterCard
                monster={createMonster({ bookmarked: true })}
                onExpand={mockOnExpand}
                onBookmarkChange={mockOnBookmarkChange}
            />
        );
        const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
        expect(checkbox).toBeChecked();
    });

    it('shows bookmark checkbox as unchecked when monster is not bookmarked', () => {
        render(
            <MonsterCard
                monster={createMonster({ bookmarked: false })}
                onExpand={mockOnExpand}
                onBookmarkChange={mockOnBookmarkChange}
            />
        );
        const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
        expect(checkbox).not.toBeChecked();
    });

    it('shows bookmark checkbox as unchecked when bookmarked is undefined', () => {
        render(
            <MonsterCard
                monster={createMonster({ bookmarked: undefined })}
                onExpand={mockOnExpand}
                onBookmarkChange={mockOnBookmarkChange}
            />
        );
        const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
        expect(checkbox).not.toBeChecked();
    });

    it('shows bookmark checkbox as unchecked when bookmarked is null', () => {
        render(
            <MonsterCard
                monster={createMonster({ bookmarked: null })}
                onExpand={mockOnExpand}
                onBookmarkChange={mockOnBookmarkChange}
            />
        );
        const checkbox = screen.getByRole('checkbox', { name: 'Bookmarked' });
        expect(checkbox).not.toBeChecked();
    });

    it('updates when expand prop changes externally', () => {
        const { rerender } = render(
            <MonsterCard
                monster={createMonster()}
                expand={false}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('monster-stats')).not.toBeInTheDocument();

        rerender(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByTestId('monster-stats')).toBeInTheDocument();
    });

    it('renders MonsterStats when expanded', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByTestId('monster-stats')).toBeInTheDocument();
    });

    it('does not render MonsterStats when collapsed', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={false}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('monster-stats')).not.toBeInTheDocument();
    });

    it('renders MonsterAbilityScores when expanded', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByTestId('ability-scores')).toBeInTheDocument();
    });

    it('renders MonsterDefenses when expanded', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByTestId('defenses')).toBeInTheDocument();
    });

    it('renders Actions section with Actions header when expanded', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByTestId('actions-actions')).toBeInTheDocument();
    });

    it('renders traits section when traits exist and are non-empty', () => {
        render(
            <MonsterCard
                monster={createMonster({ traits: [{ name: 'Ambush' }] })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByTestId('actions-traits')).toBeInTheDocument();
    });

    it('does not render traits section when traits is empty', () => {
        render(
            <MonsterCard
                monster={createMonster({ traits: [] })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('actions-traits')).not.toBeInTheDocument();
    });

    it('does not render traits section when traits is null', () => {
        render(
            <MonsterCard
                monster={createMonster({ traits: null })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('actions-traits')).not.toBeInTheDocument();
    });

    it('does not render traits section when traits is undefined', () => {
        render(
            <MonsterCard
                monster={createMonster({ traits: undefined })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('actions-traits')).not.toBeInTheDocument();
    });

    it('renders reactions section when reactions exist and are non-empty', () => {
        render(
            <MonsterCard
                monster={createMonster({ reactions: [{ name: 'Opportune Attack' }] })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Reactions')).toBeInTheDocument();
        expect(screen.getByTestId('reactions')).toBeInTheDocument();
    });

    it('does not render reactions section when reactions is empty', () => {
        render(
            <MonsterCard
                monster={createMonster({ reactions: [] })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Reactions')).not.toBeInTheDocument();
    });

    it('does not render reactions section when reactions is null', () => {
        render(
            <MonsterCard
                monster={createMonster({ reactions: null })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Reactions')).not.toBeInTheDocument();
    });

    it('does not render reactions section when reactions is undefined', () => {
        render(
            <MonsterCard
                monster={createMonster({ reactions: undefined })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Reactions')).not.toBeInTheDocument();
    });

    it('renders legendary actions section when present and non-empty', () => {
        render(
            <MonsterCard
                monster={createMonster({ legendaryActions: [{ name: 'Wing Attack' }] })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Legendary Actions')).toBeInTheDocument();
        expect(screen.getByTestId('legendary-actions')).toBeInTheDocument();
    });

    it('does not render legendary actions when empty', () => {
        render(
            <MonsterCard
                monster={createMonster({ legendaryActions: [] })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Legendary Actions')).not.toBeInTheDocument();
    });

    it('does not render legendary actions when null', () => {
        render(
            <MonsterCard
                monster={createMonster({ legendaryActions: null })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Legendary Actions')).not.toBeInTheDocument();
    });

    it('does not render legendary actions when undefined', () => {
        render(
            <MonsterCard
                monster={createMonster({ legendaryActions: undefined })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Legendary Actions')).not.toBeInTheDocument();
    });

    it('renders lair actions section when present with actions', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    lairActions: {
                        actions: ['Lightning flashes'],
                        summary: 'On initiative count 20',
                        usage: 'Can only use in lair',
                    },
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Lair Actions')).toBeInTheDocument();
    });

    it('does not render lair actions when actions array is empty', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    lairActions: { actions: [] },
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Lair Actions')).not.toBeInTheDocument();
    });

    it('does not render lair actions when lairActions is empty object', () => {
        render(
            <MonsterCard
                monster={createMonster({ lairActions: {} })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Lair Actions')).not.toBeInTheDocument();
    });

    it('does not render lair actions when lairActions is null', () => {
        render(
            <MonsterCard
                monster={createMonster({ lairActions: null })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Lair Actions')).not.toBeInTheDocument();
    });

    it('renders lair actions summary when present', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    lairActions: {
                        actions: ['Earthquake'],
                        summary: 'Starting from when this creature enters lair',
                    },
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Lair Actions')).toBeInTheDocument();
    });

    it('does not render lair actions summary when not present', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    lairActions: {
                        actions: ['Earthquake'],
                        summary: null,
                    },
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Starting from when this creature enters lair')).not.toBeInTheDocument();
    });

    it('renders lair actions usage when present', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    lairActions: {
                        actions: ['Earthquake'],
                        usage: 'Only in lair',
                    },
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Lair Actions')).toBeInTheDocument();
    });

    it('does not render lair actions usage when not present', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    lairActions: {
                        actions: ['Earthquake'],
                        usage: null,
                    },
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Only in lair')).not.toBeInTheDocument();
    });

    it('renders regional effects when present', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    regionalEffects: { effects: ['Creatures within 30 feet are wary'] },
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByTestId('regional-effects')).toBeInTheDocument();
    });

    it('does not render regional effects when null', () => {
        render(
            <MonsterCard
                monster={createMonster({ regionalEffects: null })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('regional-effects')).not.toBeInTheDocument();
    });

    it('does not render regional effects when undefined', () => {
        render(
            <MonsterCard
                monster={createMonster({ regionalEffects: undefined })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByTestId('regional-effects')).not.toBeInTheDocument();
    });

    it('renders description section when desc is present', () => {
        render(
            <MonsterCard
                monster={createMonster({ desc: 'A goblin is a cunning creature.' })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('does not render description section when desc is null', () => {
        render(
            <MonsterCard
                monster={createMonster({ desc: null })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('does not render description section when desc is empty string', () => {
        render(
            <MonsterCard
                monster={createMonster({ desc: '' })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('renders book and page reference when present', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    desc: 'A goblin is a cunning creature.',
                    book: 'Monster Manual',
                    page: 123,
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Monster Manual (page 123)' )).toBeInTheDocument();
    });

    it('does not render page reference when page is null', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    desc: 'A goblin is a cunning creature.',
                    book: 'Monster Manual',
                    page: null,
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('(page')).not.toBeInTheDocument();
    });

    it('does not render page reference when page is undefined', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    desc: 'A goblin is a cunning creature.',
                    book: 'Monster Manual',
                    page: undefined,
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.queryByText('(page')).not.toBeInTheDocument();
    });

    it('stops propagation on image click', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
    });

    it('uses 5e as default version', () => {
        render(
            <MonsterCard
                monster={createMonster()}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    it('handles monster without size', () => {
        render(
            <MonsterCard
                monster={createMonster({ size: null, type: 'Humanoid', subtype: null })}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    it('handles monster without type', () => {
        render(
            <MonsterCard
                monster={createMonster({ type: null, subtype: null })}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    it('handles monster without alignment', () => {
        render(
            <MonsterCard
                monster={createMonster({ alignment: null })}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    it('handles monster without image', () => {
        render(
            <MonsterCard
                monster={createMonster({ image: null })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
    });

    it('handles monster with no optional sections', () => {
        render(
            <MonsterCard
                monster={createMonster({
                    traits: [],
                    actions: [],
                    reactions: [],
                    legendaryActions: [],
                    lairActions: {},
                    regionalEffects: null,
                    desc: null,
                })}
                expand={true}
                onExpand={mockOnExpand}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
        expect(screen.getByTestId('monster-stats')).toBeInTheDocument();
        expect(screen.getByTestId('ability-scores')).toBeInTheDocument();
        expect(screen.getByTestId('defenses')).toBeInTheDocument();
    });
});
