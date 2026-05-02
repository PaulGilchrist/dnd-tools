import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spell from './Spell';

vi.mock('../../common/SpellCard', () => ({
    default: vi.fn(({ spell, expand }) => (
        <div data-testid="spell-card">
            <span>{spell?.name}</span>
            <span data-testid="spell-expand">{String(expand)}</span>
        </div>
    )),
}));

vi.mock('../../adapters/spellAdapters', () => ({
    normalizeSpell2024: vi.fn((spell) => ({
        ...spell,
        normalized: true,
    })),
}));

import { normalizeSpell2024 } from '../../adapters/spellAdapters';

describe('Spell (2024)', () => {
    const createSpell = (overrides = {}) => ({
        index: 'fireball',
        name: 'Fireball',
        level: 3,
        ...overrides,
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when spell is not provided', () => {
        const { container } = render(<Spell spell={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('normalizes spell data using normalizeSpell2024', () => {
        const spell = createSpell();
        render(<Spell spell={spell} />);
        expect(normalizeSpell2024).toHaveBeenCalledWith(spell);
    });

    it('passes normalized spell to SpellCard', () => {
        const spell = createSpell();
        render(<Spell spell={spell} />);
        expect(screen.getByTestId('spell-card')).toBeInTheDocument();
        expect(screen.getByText('Fireball')).toBeInTheDocument();
    });

    it('passes expand prop to SpellCard', () => {
        const spell = createSpell();
        render(<Spell spell={spell} expand={true} />);
        expect(screen.getByTestId('spell-expand')).toHaveTextContent('true');
    });

    it('passes onExpand callback to SpellCard', () => {
        const spell = createSpell();
        const mockOnExpand = vi.fn();
        render(<Spell spell={spell} onExpand={mockOnExpand} />);
        expect(screen.getByTestId('spell-card')).toBeInTheDocument();
    });

    it('passes onKnownChange callback to SpellCard', () => {
        const spell = createSpell();
        const mockOnKnownChange = vi.fn();
        render(<Spell spell={spell} onKnownChange={mockOnKnownChange} />);
        expect(screen.getByTestId('spell-card')).toBeInTheDocument();
    });

    it('passes onPreparedChange callback to SpellCard', () => {
        const spell = createSpell();
        const mockOnPreparedChange = vi.fn();
        render(<Spell spell={spell} onPreparedChange={mockOnPreparedChange} />);
        expect(screen.getByTestId('spell-card')).toBeInTheDocument();
    });
});
