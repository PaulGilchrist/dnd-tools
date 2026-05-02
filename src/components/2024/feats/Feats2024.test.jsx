import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Feats2024 from './Feats2024';

vi.mock('../../../data/dataService', () => ({
    use2024Feats: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(() => ({ pathname: '/feats-2024', search: '' })),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

vi.mock('../../../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        FEAT_FILTER_2024: 'featFilter2024',
    },
    getLocalStorageItem: vi.fn(() => null),
    setLocalStorageItem: vi.fn(),
}));

vi.mock('../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

vi.mock('./Feat2024', () => ({
    default: vi.fn(() => <div data-testid="feat-2024">Feat2024</div>),
}));

vi.mock('./Feat2024Filter', () => ({
    default: vi.fn(() => <div data-testid="feat-filter">FeatFilter</div>),
}));

const { use2024Feats } = vi.mocked(await import('../../../data/dataService'));

describe('Feats2024', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when data is loading', () => {
        use2024Feats.mockReturnValue({ data: undefined, loading: true });
        render(<Feats2024 />);
        expect(screen.getByText(/Loading 2024 feats/)).toBeInTheDocument();
    });

    it('renders feats when data loads', () => {
        const mockFeats = [
            { name: 'Alert', type: 'General', repeatable: false },
        ];
        use2024Feats.mockReturnValue({ data: mockFeats, loading: false });
        
        render(<Feats2024 />);
        expect(screen.getByTestId('feat-2024')).toBeInTheDocument();
    });

    it('renders filter form', () => {
        use2024Feats.mockReturnValue({ data: [], loading: false });
        
        render(<Feats2024 />);
        expect(screen.getByTestId('feat-filter')).toBeInTheDocument();
    });
});
