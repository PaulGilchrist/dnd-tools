import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MagicItems2024 from './MagicItems2024';

vi.mock('../../../data/dataService', () => ({
    use2024MagicItems: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(() => ({ pathname: '/magic-items-2024', search: '' })),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

vi.mock('../../../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        MAGIC_ITEMS_FILTER_2024: 'magicItemsFilter2024',
        MAGIC_ITEMS_BOOKMARKED_2024: 'magicItemsBookmarked2024',
    },
    getLocalStorageItem: vi.fn(() => null),
    setLocalStorageItem: vi.fn(),
}));

vi.mock('../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

vi.mock('./MagicItem2024', () => ({
    default: vi.fn(({ magicItem, expand }) => (
        <div data-testid="magic-item-2024">
            <span>{magicItem?.name}</span>
            <span data-testid="expand-status">{String(expand)}</span>
        </div>
    )),
}));

vi.mock('./MagicItems2024FilterForm', () => ({
    default: vi.fn(() => <div data-testid="filter-form-2024">FilterForm2024</div>),
}));

vi.mock('./MagicItems2024List', () => ({
    default: vi.fn(({ filteredItems }) => (
        <div data-testid="magic-items-list-2024">
            {filteredItems.map(item => <div key={item.index}>{item.name}</div>)}
        </div>
    )),
}));

const { use2024MagicItems } = vi.mocked(await import('../../../data/dataService'));

describe('MagicItems2024', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when data is loading', () => {
        use2024MagicItems.mockReturnValue({ data: undefined, loading: true });
        render(<MagicItems2024 />);
        expect(screen.getByText(/Loading magic items/)).toBeInTheDocument();
    });

    it('renders magic items when data loads', () => {
        const mockItems = [
            { index: 'ring-of-protection', name: 'Ring of Protection', type: 'Ring', rarity: 'Rare', requiresAttunement: true },
        ];
        use2024MagicItems.mockReturnValue({ data: mockItems, loading: false });
        
        render(<MagicItems2024 />);
        expect(screen.getByTestId('magic-items-list-2024')).toBeInTheDocument();
    });

    it('renders filter form', () => {
        use2024MagicItems.mockReturnValue({ data: [], loading: false });
        
        render(<MagicItems2024 />);
        expect(screen.getByTestId('filter-form-2024')).toBeInTheDocument();
    });
});
