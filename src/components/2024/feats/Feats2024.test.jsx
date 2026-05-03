import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Feats2024 from './Feats2024';

// Create mock functions at module level
const mockUse2024Feats = vi.fn();
const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();
const mockScrollIntoView = vi.fn();

vi.mock('../../../data/dataService', () => ({
  use2024Feats: (...args) => mockUse2024Feats(...args),
}));

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(() => ({ pathname: '/feats-2024', search: '' })),
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

vi.mock('../../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: {
    FEAT_FILTER_2024: 'featFilter2024',
  },
  getLocalStorageItem: (...args) => mockGetLocalStorageItem(...args),
  setLocalStorageItem: (...args) => mockSetLocalStorageItem(...args),
}));

vi.mock('../../../data/utils', () => ({
  scrollIntoView: (...args) => mockScrollIntoView(...args),
}));

vi.mock('./Feat2024', () => ({
  default: vi.fn(() => <div data-testid="feat-2024">Feat2024</div>),
}));

vi.mock('./Feat2024Filter', () => ({
  default: vi.fn(() => <div data-testid="feat-filter">FeatFilter</div>),
}));

describe('Feats2024', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUse2024Feats.mockReturnValue({ data: [], loading: false });
  });

  it('shows loading state when data is loading', () => {
    mockUse2024Feats.mockReturnValue({ data: undefined, loading: true });
    render(<Feats2024 />);
    expect(screen.getByText(/Loading 2024 feats/)).toBeInTheDocument();
  });

  it('renders feats when data loads', () => {
    const mockFeats = [
      { name: 'Alert', type: 'General', repeatable: false },
    ];
    mockUse2024Feats.mockReturnValue({ data: mockFeats, loading: false });
    
    render(<Feats2024 />);
    expect(screen.getByTestId('feat-2024')).toBeInTheDocument();
  });

  it('renders filter form', () => {
    render(<Feats2024 />);
    expect(screen.getByTestId('feat-filter')).toBeInTheDocument();
  });

  it.skip('loads saved filter from localStorage', () => {
    const savedFilter = {
      name: 'test',
      type: 'General',
      repeatable: 'All',
      minLevel: 0,
      abilityScore: 'All'
    };
    mockGetLocalStorageItem.mockReturnValue(savedFilter);
    mockUse2024Feats.mockReturnValue({ data: [], loading: false });
    
    render(<Feats2024 />);
    expect(mockGetLocalStorageItem).toHaveBeenCalledWith('featFilter2024');
  });

  it.skip('saves filter to localStorage on change', () => {
    mockUse2024Feats.mockReturnValue({ data: [], loading: false });
    
    render(<Feats2024 />);
    
    // The component should save filter to localStorage on mount
    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('featFilter2024', expect.any(Object));
  });
});
