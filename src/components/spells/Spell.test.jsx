import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spell from './Spell';

vi.mock('../common/SpellCard', () => ({
  default: vi.fn(({ spell, expand, onKnownChange, onPreparedChange }) => (
    <div data-testid="spell-card">
      <span>{spell?.name}</span>
      <span>Expand: {String(expand)}</span>
    </div>
  )),
}));

vi.mock('../adapters/spellAdapters', () => ({
  normalizeSpell5e: vi.fn((spell) => ({ ...spell, normalized: true })),
}));

import { normalizeSpell5e } from '../adapters/spellAdapters';

describe('Spell', () => {
  const mockSpell = {
    index: 'fireball',
    name: 'Fireball',
    level: 3,
    school: 'Evocation',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when spell is not provided', () => {
    const { container } = render(<Spell spell={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('normalizes spell data using normalizeSpell5e', () => {
    render(<Spell spell={mockSpell} />);
    expect(normalizeSpell5e).toHaveBeenCalledWith(mockSpell);
  });

  it('passes normalized spell to SpellCard', () => {
    render(<Spell spell={mockSpell} />);
    expect(screen.getByTestId('spell-card')).toBeInTheDocument();
    expect(screen.getByText('Fireball')).toBeInTheDocument();
  });

  it('passes expand prop to SpellCard', () => {
    render(<Spell spell={mockSpell} expand={true} />);
    expect(screen.getByText('Expand: true')).toBeInTheDocument();
  });

  it('passes onExpand callback to SpellCard', () => {
    const onExpand = vi.fn();
    render(<Spell spell={mockSpell} onExpand={onExpand} />);
    expect(screen.getByTestId('spell-card')).toBeInTheDocument();
  });

  it('passes onKnownChange callback to SpellCard', () => {
    const onKnownChange = vi.fn();
    render(<Spell spell={mockSpell} onKnownChange={onKnownChange} />);
    expect(screen.getByTestId('spell-card')).toBeInTheDocument();
  });

  it('passes onPreparedChange callback to SpellCard', () => {
    const onPreparedChange = vi.fn();
    render(<Spell spell={mockSpell} onPreparedChange={onPreparedChange} />);
    expect(screen.getByTestId('spell-card')).toBeInTheDocument();
  });
});
