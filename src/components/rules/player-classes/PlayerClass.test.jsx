import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import PlayerClass from './PlayerClass';

const mockPlayerClass = {
  index: 'fighter',
  name: 'Fighter',
  hit_die: 'd10',
  proficiencies: ['All armor', 'All weapons'],
  spellcasting_ability: null,
  class_levels: [
    { level: 1, features: [{ name: 'Fighting Style', type: 'class_feature' }] }
  ],
  majors: [{ name: 'Champion', features: [] }],
};

vi.mock('../../../../hooks/usePlayerClassLogic', () => ({
  usePlayerClassLogic: vi.fn(() => ({
    isExpanded: false,
    shownLevel: 0,
    shownSubclass: '',
    getNameString: vi.fn(() => 'Strength, Dexterity'),
    getPrerequisites: vi.fn(() => 'Prerequisite: None'),
    getSpells: vi.fn(() => []),
    toggleDetails: vi.fn(),
    showLevel: vi.fn(),
    showSubclass: vi.fn(),
    classFeatures: [],
    subclassFeatures: [],
  })),
}));

vi.mock('./PlayerClassHeader', () => ({
  default: vi.fn(({ playerClass, isExpanded, onToggle }) => (
    <div data-testid="player-class-header">
      <span>{playerClass?.name}</span>
      <button onClick={onToggle}>Toggle</button>
    </div>
  )),
}));

vi.mock('./PlayerClassBasicInfo', () => ({
  default: vi.fn(() => <div data-testid="basic-info"></div>),
}));

vi.mock('./PlayerClassFeatures', () => ({
  default: vi.fn(() => <div data-testid="features"></div>),
}));

vi.mock('./PlayerClassLevels', () => ({
  default: vi.fn(() => <div data-testid="levels"></div>),
}));

vi.mock('./PlayerClassSubclasses', () => ({
  default: vi.fn(() => <div data-testid="subclasses"></div>),
}));

describe('PlayerClass', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when playerClass is not provided', () => {
    const { container } = render(
      <MemoryRouter>
        <PlayerClass playerClass={null} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders player class header', () => {
    render(
      <MemoryRouter>
        <PlayerClass playerClass={mockPlayerClass} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('player-class-header')).toBeInTheDocument();
    expect(screen.getByText('Fighter')).toBeInTheDocument();
  });

  it('uses player class index as id', () => {
    render(
      <MemoryRouter>
        <PlayerClass playerClass={mockPlayerClass} />
      </MemoryRouter>
    );
    expect(document.getElementById('fighter')).toBeInTheDocument();
  });

  it('renders basic info when expanded', () => {
    render(
      <MemoryRouter>
        <PlayerClass playerClass={mockPlayerClass} expand={true} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('basic-info')).toBeInTheDocument();
  });

  it('renders features when expanded', () => {
    render(
      <MemoryRouter>
        <PlayerClass playerClass={mockPlayerClass} expand={true} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });

  it('renders levels when expanded', () => {
    render(
      <MemoryRouter>
        <PlayerClass playerClass={mockPlayerClass} expand={true} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('levels')).toBeInTheDocument();
  });

  it('renders subclasses when expanded', () => {
    render(
      <MemoryRouter>
        <PlayerClass playerClass={mockPlayerClass} expand={true} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('subclasses')).toBeInTheDocument();
  });
});
