import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import PlayerClass2024 from './PlayerClass2024';

vi.mock('../../../data/dataService', () => ({
  use2024PlayerClass: vi.fn(() => ({ data: null, loading: false })),
}));

vi.mock('../../../hooks/usePlayerClassLogic', () => ({
  usePlayerClassLogic: vi.fn(() => ({
    isExpanded: false,
    shownLevel: 0,
    shownSubclass: '',
    getNameString: vi.fn(() => 'Test, Another'),
    getPrerequisites: vi.fn(() => 'Prerequisite: None'),
    getSpells: vi.fn(() => []),
    toggleDetails: vi.fn(),
    showLevel: vi.fn(),
    showSubclass: vi.fn(),
    classFeatures: [],
    subclassFeatures: [],
  })),
}));

vi.mock('./PlayerClass2024Header', () => ({
  default: vi.fn(({ playerClass, onToggle }) => (
    <div data-testid="player-class-2024-header">
      <span>{playerClass?.name}</span>
      <button onClick={onToggle}>Toggle</button>
    </div>
  )),
}));

vi.mock('./PlayerClass2024CoreTraits', () => ({
  default: vi.fn(() => <div data-testid="core-traits"></div>),
}));

vi.mock('./PlayerClass2024LevelProgression', () => ({
  default: vi.fn(() => <div data-testid="level-progression"></div>),
}));

vi.mock('./PlayerClass2024Majors', () => ({
  default: vi.fn(() => <div data-testid="majors"></div>),
}));

vi.mock('./PlayerClass2024Multiclassing', () => ({
  default: vi.fn(() => <div data-testid="multiclassing"></div>),
}));

describe('PlayerClass2024', () => {
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

  it('returns null when playerClass is not provided', () => {
    const { container } = render(
      <MemoryRouter>
        <PlayerClass2024 playerClass={null} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders player class header', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <PlayerClass2024 playerClass={mockPlayerClass} expand={true} />
        </MemoryRouter>
      );
    });
    expect(screen.getByTestId('player-class-2024-header')).toBeInTheDocument();
  });

  it('uses player class index as id', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <PlayerClass2024 playerClass={mockPlayerClass} expand={true} />
        </MemoryRouter>
      );
    });
    expect(document.getElementById('fighter')).toBeInTheDocument();
  });
});
