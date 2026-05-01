import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SpellCard from './SpellCard';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('SpellCard', () => {
    const createSpell = (overrides = {}) => ({
        index: 'fireball',
        name: 'Fireball',
        level: 3,
        school: 'Evocation',
        castingTime: '1 action',
        range: '150 feet',
        components: 'V, S, M',
        material: 'a pinch of sulfur',
        duration: 'Instantaneous',
        concentration: false,
        ritual: false,
        classes: ['Wizard'],
        subclasses: [],
        desc: ['A bright streak flashes from your pointing finger.'],
        damage: null,
        savingThrow: 'Dexterity',
        areaOfEffect: null,
        statusEffects: [],
        higherLevel: 'The radius increases by 5 feet for each slot level above 3rd.',
        known: false,
        prepared: false,
        ...overrides,
    });

    const mockOnExpand = vi.fn();
    const mockOnKnownChange = vi.fn();
    const mockOnPreparedChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when spell is not provided', () => {
        const { container } = render(
            <SpellCard
                spell={null}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays spell name and level', () => {
        const spell = createSpell();
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText('Fireball')).toBeInTheDocument();
        expect(screen.getByText(/3rd-level/)).toBeInTheDocument();
        expect(screen.getByText(/evocation/)).toBeInTheDocument();
    });

    it('displays ritual indicator when spell is ritual', () => {
        const spell = createSpell({ ritual: true });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/ritual/)).toBeInTheDocument();
    });

    it('does not display ritual indicator when not ritual', () => {
        const spell = createSpell({ ritual: false });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.queryByText(/\(ritual\)/)).not.toBeInTheDocument();
    });

    it('shows cantrip text for level 0', () => {
        const spell = createSpell({ level: 0 });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Cantrip/)).toBeInTheDocument();
    });

    it('shows 1st-level text for level 1', () => {
        const spell = createSpell({ level: 1 });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/1st-level/)).toBeInTheDocument();
    });

    it('shows 2nd-level text for level 2', () => {
        const spell = createSpell({ level: 2 });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/2nd-level/)).toBeInTheDocument();
    });

    it('shows 4th-level text for level 4', () => {
        const spell = createSpell({ level: 4 });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange} onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/4th-level/)).toBeInTheDocument();
    });

    it('is collapsed by default when expand is false', () => {
        const spell = createSpell();
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.queryByText(/Casting Time:/)).not.toBeInTheDocument();
    });

    it('is expanded when expand is true', () => {
        const spell = createSpell();
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Casting Time:/)).toBeInTheDocument();
    });

    it('toggles expansion on header click', () => {
        const spell = createSpell();
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
                const clickable = screen.getByText('Fireball').closest('.clickable');
        fireEvent.click(clickable);
        expect(mockOnExpand).toHaveBeenCalled();
    });

    it('displays casting time when expanded', () => {
        const spell = createSpell();
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Casting Time:/)).toBeInTheDocument();
        expect(screen.getByText(/1 action/)).toBeInTheDocument();
    });

    it('displays range when expanded', () => {
        const spell = createSpell();
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Range:/)).toBeInTheDocument();
        expect(screen.getByText(/150 feet/)).toBeInTheDocument();
    });

    it('displays components as string for 5e format', () => {
        const spell = createSpell({ components: 'V S M' });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Components:/)).toBeInTheDocument();
        expect(screen.getByText(/V S M/)).toBeInTheDocument();
    });

    it('displays components as badges for 2024 format', () => {
        const spell = createSpell({ components: ['V', 'S', 'M'] });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText('Verbal')).toBeInTheDocument();
        expect(screen.getByText('Somatic')).toBeInTheDocument();
        expect(screen.getByText('Material')).toBeInTheDocument();
    });

    it('displays material component when present', () => {
        const spell = createSpell();
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/a pinch of sulfur/)).toBeInTheDocument();
    });

    it('displays duration with concentration when applicable', () => {
        const spell = createSpell({ concentration: true, duration: '1 minute' });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Duration:/)).toBeInTheDocument();
        expect(screen.getByText(/Concentration/)).toBeInTheDocument();
    });

    it('displays classes when expanded', () => {
        const spell = createSpell({ classes: ['Wizard', 'Sorcerer'] });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Classes:/)).toBeInTheDocument();
        expect(screen.getByText(/Wizard/)).toBeInTheDocument();
        expect(screen.getByText(/Sorcerer/)).toBeInTheDocument();
    });

    it('displays saving throw when present', () => {
        const spell = createSpell({ savingThrow: 'Dexterity' });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Saving Throw:/)).toBeInTheDocument();
        expect(screen.getByText(/Dexterity/)).toBeInTheDocument();
    });

    it('does not display saving throw when not present', () => {
        const spell = createSpell({ savingThrow: null });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.queryByText(/Saving Throw:/)).not.toBeInTheDocument();
    });

    it('displays area of effect when present', () => {
        const spell = createSpell({ areaOfEffect: { size: 20, type: 'cube' } });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Area of Effect:/)).toBeInTheDocument();
        expect(screen.getByText(/20 foot cube/)).toBeInTheDocument();
    });

    it('does not display area of effect when not present', () => {
        const spell = createSpell({ areaOfEffect: null });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.queryByText(/Area of Effect:/)).not.toBeInTheDocument();
    });

    it('displays subclasses when present', () => {
        const spell = createSpell({ subclasses: ['School of Evocation'] });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Subclasses:/)).toBeInTheDocument();
        expect(screen.getByText(/School of Evocation/)).toBeInTheDocument();
    });

    it('displays status effects when present', () => {
        const spell = createSpell({ statusEffects: ['blinded', 'deafened'] });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/Status Effects:/)).toBeInTheDocument();
        expect(screen.getByText(/blinded/)).toBeInTheDocument();
        expect(screen.getByText(/deafened/)).toBeInTheDocument();
    });

    it('displays higher level text for 5e string format', () => {
        const spell = createSpell({ higherLevel: 'The radius increases by 5 feet.' });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/At higher levels/)).toBeInTheDocument();
    });

    it('displays higher level text for 2024 array format', () => {
        const spell = createSpell({ higherLevel: ['The radius increases.', 'Damage increases.'] });
        render(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        expect(screen.getByText(/At higher levels/)).toBeInTheDocument();
    });

    it('toggles known status and calls callback', () => {
        const spell = createSpell({ known: false });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        const knownCheckbox = screen.getByRole('checkbox', { name: 'Known' });
        fireEvent.click(knownCheckbox);
        expect(mockOnKnownChange).toHaveBeenCalledWith('fireball', true);
    });

    it('toggles prepared status and calls callback', () => {
        const spell = createSpell({ known: true, prepared: false });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        const preparedCheckbox = screen.getByRole('checkbox', { name: 'Prepared' });
        fireEvent.click(preparedCheckbox);
        expect(mockOnPreparedChange).toHaveBeenCalledWith('fireball', true);
    });

    it('unchecks prepared when unchecking known', () => {
        const spell = createSpell({ known: true, prepared: true });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        const knownCheckbox = screen.getByRole('checkbox', { name: 'Known' });
        fireEvent.click(knownCheckbox);
        expect(mockOnPreparedChange).toHaveBeenCalledWith('fireball', false);
        expect(mockOnKnownChange).toHaveBeenCalledWith('fireball', false);
    });

    it('prepared checkbox is disabled when spell is not known', () => {
        const spell = createSpell({ known: false });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        const preparedCheckbox = screen.getByRole('checkbox', { name: 'Prepared' });
        expect(preparedCheckbox).toBeDisabled();
    });

    it('prepared checkbox is enabled when spell is known', () => {
        const spell = createSpell({ known: true });
        render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
            />
        );
        const preparedCheckbox = screen.getByRole('checkbox', { name: 'Prepared' });
        expect(preparedCheckbox).not.toBeDisabled();
    });

    it('updates when expand prop changes externally', () => {
        const spell = createSpell();
        const { rerender } = render(
            <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/Casting Time:/)).not.toBeInTheDocument();

        rerender(
            <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.getByText(/Casting Time:/)).toBeInTheDocument();
    });

    it('displays damage type when present', () => {
        const spell = createSpell({ damage: { damage_type: 'Fire' } });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
              />
          );
        expect(screen.getByText(/Damage Type:/)).toBeInTheDocument();
         // Use exact text match to avoid matching 'Fireball' spell name
        const damageElements = screen.getAllByText('Fire');
        expect(damageElements.length).toBeGreaterThan(0);
      });

    it('does not display damage when not present', () => {
        const spell = createSpell({ damage: null });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/Damage Type:/)).not.toBeInTheDocument();
     });

    it('displays damage at higher levels', () => {
        const spell = createSpell({
            damage: {
                damage_type: 'Fire',
                damage_at_slot_level: { '4': '2d6', '5': '3d6' }
            }
        });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.getByText(/At Higher Levels:/)).toBeInTheDocument();
     });

    it('handles spell without school', () => {
        const spell = createSpell({ school: null });
        render(
             <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.getByText('Fireball')).toBeInTheDocument();
     });

    it('handles empty components array', () => {
        const spell = createSpell({ components: [] });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.getByText(/Components:/)).toBeInTheDocument();
     });

    it('handles null components', () => {
        const spell = createSpell({ components: null });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/Components:/)).toBeInTheDocument();
     });

    it('handles empty description array', () => {
        const spell = createSpell({ desc: [] });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/A bright streak/)).not.toBeInTheDocument();
     });

    it('handles null description', () => {
        const spell = createSpell({ desc: null });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/A bright streak/)).not.toBeInTheDocument();
     });

    it('handles empty higherLevel array', () => {
        const spell = createSpell({ higherLevel: [] });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/At higher levels/)).not.toBeInTheDocument();
     });

    it('handles null higherLevel', () => {
        const spell = createSpell({ higherLevel: null });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/At higher levels/)).not.toBeInTheDocument();
     });

    it('handles empty classes array', () => {
        const spell = createSpell({ classes: [] });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/Classes:/)).toBeInTheDocument();
     });

    it('handles empty subclasses array', () => {
        const spell = createSpell({ subclasses: [] });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/Subclasses:/)).not.toBeInTheDocument();
     });

    it('handles empty statusEffects array', () => {
        const spell = createSpell({ statusEffects: [] });
        render(
             <SpellCard
                spell={spell}
                expand={true}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        expect(screen.queryByText(/Status Effects:/)).not.toBeInTheDocument();
     });

    it('toggles known from true to false', () => {
        const spell = createSpell({ known: true });
        render(
             <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        const knownCheckbox = screen.getByRole('checkbox', { name: 'Known' });
        fireEvent.click(knownCheckbox);
        expect(mockOnKnownChange).toHaveBeenCalledWith('fireball', false);
     });

    it('toggles prepared from true to false', () => {
        const spell = createSpell({ known: true, prepared: true });
        render(
             <SpellCard
                spell={spell}
                expand={false}
                onExpand={mockOnExpand}
                onKnownChange={mockOnKnownChange}
                onPreparedChange={mockOnPreparedChange}
             />
         );
        const preparedCheckbox = screen.getByRole('checkbox', { name: 'Prepared' });
        fireEvent.click(preparedCheckbox);
        expect(mockOnPreparedChange).toHaveBeenCalledWith('fireball', false);
     });
});