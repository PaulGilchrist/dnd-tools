import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Encounters from './Encounters';

// Create mock functions
const mockUseMonsters = vi.fn(() => ({ data: [], loading: false }));
const mockGetLocalStorageItem = vi.fn();
const mockSetLocalStorageItem = vi.fn();

vi.mock('../../data/dataService', () => ({
  useMonsters: (...args) => mockUseMonsters(...args),
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: {
    ENCOUNTER_FILTER: 'encounterFilter',
  },
  getLocalStorageItem: (...args) => mockGetLocalStorageItem(...args),
  setLocalStorageItem: (...args) => mockSetLocalStorageItem(...args),
}));

vi.mock('./Loading', () => ({
  default: vi.fn(() => <div data-testid="loading">Loading...</div>),
}));

vi.mock('./EncounterFilterPanel', () => ({
  default: vi.fn(({ filter, onDifficultyChange, onAddPlayer, onRemovePlayer, onPlayerLevelChange }) => (
    <div data-testid="filter-panel">
      <button data-testid="add-player" onClick={onAddPlayer}>Add Player</button>
      <button data-testid="remove-player" onClick={() => onRemovePlayer(0)}>Remove Player</button>
      <select data-testid="difficulty-select" value={filter.difficulty} onChange={onDifficultyChange}>
        <option value="0">Easy</option>
        <option value="1">Medium</option>
        <option value="2">Hard</option>
        <option value="3">Deadly</option>
      </select>
      <input 
        data-testid="player-level-input" 
        type="number" 
        value={filter.playerLevels[0]} 
        onChange={(e) => onPlayerLevelChange(0, parseInt(e.target.value))} 
      />
    </div>
  )),
}));

vi.mock('./EncounterSummaryPanel', () => ({
  default: vi.fn(({ onClearMonsters }) => (
    <div data-testid="summary-panel">
      <button data-testid="clear-monsters" onClick={onClearMonsters}>Clear Monsters</button>
    </div>
  )),
}));

vi.mock('./EncounterMonsterTable', () => ({
  default: vi.fn(({ filteredMonsters, selectedMonsters, onToggleMonster, onIncreaseQty, onDecreaseQty, onRemoveMonster, searchQuery, onSearchQueryChange }) => (
    <div data-testid="monster-table">
      <input 
        data-testid="search-query" 
        value={searchQuery} 
        onChange={(e) => onSearchQueryChange(e.target.value)} 
      />
      {filteredMonsters.map((monster) => (
        <div key={monster.index} data-testid={`monster-${monster.index}`}>
          {monster.name}
          <button data-testid={`toggle-${monster.index}`} onClick={() => onToggleMonster(monster)}>Toggle</button>
          {selectedMonsters.some(m => m.index === monster.index) && (
            <>
              <button data-testid={`increase-${monster.index}`} onClick={() => onIncreaseQty(monster.index)}>+</button>
              <button data-testid={`decrease-${monster.index}`} onClick={() => onDecreaseQty(monster.index)}>-</button>
              <button data-testid={`remove-${monster.index}`} onClick={() => onRemoveMonster(monster.index)}>Remove</button>
            </>
          )}
        </div>
      ))}
    </div>
  )),
}));

vi.mock('./EncounterSelectedMonsters', () => ({
  default: vi.fn(({ selectedMonsters, onRemoveMonster }) => (
    <div data-testid="selected-monsters">
      {selectedMonsters.map((monster) => (
        <div key={monster.index} data-testid={`selected-${monster.index}`}>
          {monster.name} (Qty: {monster.qty})
          <button data-testid={`remove-selected-${monster.index}`} onClick={() => onRemoveMonster(monster.index)}>Remove</button>
        </div>
      ))}
    </div>
  )),
}));

describe('Encounters', () => {
  const mockMonsters = [
    { index: 'goblin', name: 'Goblin', type: 'humanoid', xp: 50, challenge_rating: 0.25 },
    { index: 'orc', name: 'Orc', type: 'humanoid', xp: 200, challenge_rating: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMonsters.mockReturnValue({ data: [], loading: false });
    mockGetLocalStorageItem.mockReturnValue(null);
  });

  it('shows loading state', () => {
    mockUseMonsters.mockReturnValue({ data: [], loading: true });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders encounter builder title', () => {
    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    expect(screen.getByText('Encounter Builder')).toBeInTheDocument();
  });

  it('renders all panels when data is loaded', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
    expect(screen.getByTestId('monster-table')).toBeInTheDocument();
    expect(screen.getByTestId('selected-monsters')).toBeInTheDocument();
  });

  it('loads saved filter from localStorage', () => {
    const savedFilter = { difficulty: 2, playerLevels: [3, 4] };
    mockGetLocalStorageItem.mockReturnValue(savedFilter);
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    expect(mockGetLocalStorageItem).toHaveBeenCalledWith('encounterFilter');
  });

  it('saves filter to localStorage on mount if not present', () => {
    mockGetLocalStorageItem.mockReturnValue(null);
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('encounterFilter', expect.any(Object));
  });

  it('renders monster list when data is loaded', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Check that monsters are passed to the table
    expect(screen.getByTestId('monster-goblin')).toBeInTheDocument();
  });

  it('adds player', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('add-player'));
    
    // Filter should be updated (saved to localStorage)
    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('encounterFilter', expect.any(Object));
  });

  it('removes player', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // First add a player
    fireEvent.click(screen.getByTestId('add-player'));
    
    // Then remove the first player
    fireEvent.click(screen.getByTestId('remove-player'));
    
    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('encounterFilter', expect.any(Object));
  });

  it('changes difficulty', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    const select = screen.getByTestId('difficulty-select');
    fireEvent.change(select, { target: { value: '3' } });
    
    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('encounterFilter', expect.any(Object));
  });

  it('changes player level', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    const input = screen.getByTestId('player-level-input');
    fireEvent.change(input, { target: { value: '5' } });
    
    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('encounterFilter', expect.any(Object));
  });

  it('filters monsters by search query', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId('search-query');
    fireEvent.change(searchInput, { target: { value: 'goblin' } });
    
    // Verify search query is updated
    expect(searchInput.value).toBe('goblin');
  });

  it('filters monsters by type in search', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId('search-query');
    fireEvent.change(searchInput, { target: { value: 'humanoid' } });
    
    // Verify search query is updated
    expect(searchInput.value).toBe('humanoid');
  });

  it('handles missing localStorage gracefully', () => {
    mockGetLocalStorageItem.mockReturnValue(null);
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Should not crash
    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
  });

  it('renders encounter builder title', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    expect(screen.getByText('Encounter Builder')).toBeInTheDocument();
  });

  it('renders all panels when data is loaded', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
    expect(screen.getByTestId('monster-table')).toBeInTheDocument();
    expect(screen.getByTestId('selected-monsters')).toBeInTheDocument();
  });

  it('renders monster list when data is loaded', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Check that monsters are passed to the table
    expect(screen.getByTestId('monster-goblin')).toBeInTheDocument();
  });

  it('toggles monster selection', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Toggle goblin
    fireEvent.click(screen.getByTestId('toggle-goblin'));
    
    // Check if selected monsters panel shows goblin
    expect(screen.getByTestId('selected-goblin')).toBeInTheDocument();
  });

  it('increases monster quantity', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Toggle goblin to add it
    fireEvent.click(screen.getByTestId('toggle-goblin'));
    
    // Increase quantity
    fireEvent.click(screen.getByTestId('increase-goblin'));
    
    // Check quantity increased
    expect(screen.getByTestId('selected-goblin')).toHaveTextContent('Qty: 2');
  });

  it('decreases monster quantity', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Toggle goblin to add it
    fireEvent.click(screen.getByTestId('toggle-goblin'));
    
    // Increase quantity twice
    fireEvent.click(screen.getByTestId('increase-goblin'));
    fireEvent.click(screen.getByTestId('increase-goblin'));
    
    // Decrease quantity
    fireEvent.click(screen.getByTestId('decrease-goblin'));
    
    // Check quantity decreased
    expect(screen.getByTestId('selected-goblin')).toHaveTextContent('Qty: 2');
  });

  it('removes monster directly', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Toggle goblin to add it
    fireEvent.click(screen.getByTestId('toggle-goblin'));
    
    // Remove directly
    fireEvent.click(screen.getByTestId('remove-goblin'));
    
    // Goblin should be removed
    expect(screen.queryByTestId('selected-goblin')).not.toBeInTheDocument();
  });

  it('clears all selected monsters', () => {
    mockUseMonsters.mockReturnValue({ data: mockMonsters, loading: false });

    render(
      <MemoryRouter>
        <Encounters />
      </MemoryRouter>
    );

    // Toggle goblin
    fireEvent.click(screen.getByTestId('toggle-goblin'));
    
    // Clear all
    fireEvent.click(screen.getByTestId('clear-monsters'));
    
    // No selected monsters
    expect(screen.queryByTestId('selected-goblin')).not.toBeInTheDocument();
  });
});
