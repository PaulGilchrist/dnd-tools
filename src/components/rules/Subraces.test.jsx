import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Subraces from './Subraces';

describe('Subraces', () => {
  const mockSubraces = [
    {
      index: 'hill-dwarf',
      name: 'Hill Dwarf',
      desc: 'The hill dwarf is...',
      ability_bonuses: [{ ability_score: 'WIS', bonus: 1 }],
      speed: 25,
      starting_proficiencies: ['Battleaxe', 'Handaxe'],
      racial_traits: [
        { index: 'dwarven-toughness', name: 'Dwarven Toughness', desc: 'Your hit point maximum increases.' },
      ],
      language_options: { from: ['Common', 'Dwarvish'] },
    },
  ];

  it('returns null when subraces is not provided', () => {
    const { container } = render(<Subraces subraces={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when subraces is empty', () => {
    const { container } = render(<Subraces subraces={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders subrace name', () => {
    render(<Subraces subraces={mockSubraces} />);
    expect(screen.getByText('Hill Dwarf')).toBeInTheDocument();
  });

  it('renders subrace description', () => {
    render(<Subraces subraces={mockSubraces} />);
    expect(screen.getByText('The hill dwarf is...')).toBeInTheDocument();
  });

  it('displays ability bonuses', () => {
    render(<Subraces subraces={mockSubraces} />);
    expect(screen.getByText(/Ability Bonuses:/)).toBeInTheDocument();
    expect(screen.getByText(/WIS \+1/)).toBeInTheDocument();
  });

  it('displays speed when provided', () => {
    render(<Subraces subraces={mockSubraces} />);
    expect(screen.getByText(/Speed:/)).toBeInTheDocument();
    expect(screen.getByText(/25 feet/)).toBeInTheDocument();
  });

  it('displays starting proficiencies', () => {
    render(<Subraces subraces={mockSubraces} />);
    expect(screen.getByText(/Starting Proficiencies:/)).toBeInTheDocument();
    expect(screen.getByText(/Battleaxe/)).toBeInTheDocument();
  });

  it('displays racial traits', () => {
    render(<Subraces subraces={mockSubraces} />);
    expect(screen.getByText(/Racial Traits:/)).toBeInTheDocument();
    expect(screen.getByText('Dwarven Toughness')).toBeInTheDocument();
  });

  it('displays language options', () => {
    render(<Subraces subraces={mockSubraces} />);
    expect(screen.getByText(/Language Options:/)).toBeInTheDocument();
    expect(screen.getByText(/Common/)).toBeInTheDocument();
  });
});
