import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RaceItem from './RaceItem';
import { renderHtmlContent } from '../../utils/htmlUtils';

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

vi.mock('./Subraces', () => ({
  default: vi.fn(({ subraces }) => (
    <div data-testid="subraces">{subraces?.length || 0} subraces</div>
  )),
}));

describe('RaceItem', () => {
  const mockRace = {
    index: 'hill-dwarf',
    name: 'Hill Dwarf',
    size: 'Medium',
    speed: 25,
    size_description: 'Medium sized',
    age: 'Can live up to 350 years',
    alignment: 'Usually lawful good',
    ability_bonuses: [
      { ability_score: 'CON', bonus: 2 },
      { ability_score: 'WIS', bonus: 1 },
    ],
    languages: ['Common', 'Dwarvish'],
    traits: [
      { index: 'darkvision', name: 'Darkvision', description: 'You can see in the dark.' },
    ],
    subraces: [{ index: 'hill-dwarf', name: 'Hill Dwarf' }],
    book: 'Player Handbook',
    page: 20,
  };

  it('returns null when race is not provided', () => {
    const { container } = render(<RaceItem race={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders race name', () => {
    render(<RaceItem race={mockRace} />);
    expect(screen.getByText('Hill Dwarf')).toBeInTheDocument();
  });

  it('displays size and speed', () => {
    render(<RaceItem race={mockRace} />);
    expect(screen.getByText(/Size: Medium/)).toBeInTheDocument();
    expect(screen.getByText(/Speed: 25 feet/)).toBeInTheDocument();
  });

  it('is not expanded by default', () => {
    render(<RaceItem race={mockRace} />);
    expect(screen.queryByText(/Ability Bonuses:/)).not.toBeInTheDocument();
  });

  it('expands when expand prop is true', () => {
    render(<RaceItem race={mockRace} expand={true} />);
    expect(screen.getByText(/Ability Bonuses:/)).toBeInTheDocument();
  });

  it('toggles expansion when header is clicked', () => {
    const onExpand = vi.fn();
    render(<RaceItem race={mockRace} onExpand={onExpand} />);
    fireEvent.click(screen.getByText('Hill Dwarf'));
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('displays ability bonuses when provided', () => {
    render(<RaceItem race={mockRace} expand={true} />);
    expect(screen.getByText(/CON \+2/)).toBeInTheDocument();
    expect(screen.getByText(/WIS \+1/)).toBeInTheDocument();
  });

  it('displays age information', () => {
    render(<RaceItem race={mockRace} expand={true} />);
    expect(screen.getByText(/Age:/)).toBeInTheDocument();
    expect(screen.getByText(/Can live up to 350 years/)).toBeInTheDocument();
  });

  it('displays alignment when provided', () => {
    render(<RaceItem race={mockRace} expand={true} />);
    expect(screen.getByText(/Alignment:/)).toBeInTheDocument();
  });

  it('displays languages', () => {
    render(<RaceItem race={mockRace} expand={true} />);
    expect(screen.getByText(/Languages/)).toBeInTheDocument();
  });

  it('renders subraces when provided', () => {
    render(<RaceItem race={mockRace} expand={true} />);
    expect(screen.getByTestId('subraces')).toBeInTheDocument();
  });

  it('displays book reference', () => {
    render(<RaceItem race={mockRace} expand={true} />);
    expect(screen.getByText(/Player Handbook/)).toBeInTheDocument();
    expect(screen.getByText(/page 20/)).toBeInTheDocument();
  });
});
