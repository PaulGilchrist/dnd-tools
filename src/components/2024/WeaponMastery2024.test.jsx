import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeaponMastery2024 from './WeaponMastery2024';

vi.mock('../../data/dataService', () => ({
    useWeaponMastery2024: vi.fn(),
}));

import { useWeaponMastery2024 } from '../../data/dataService';

describe('WeaponMastery2024', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when data is loading', () => {
        useWeaponMastery2024.mockReturnValue({ 
            data: null, 
            loading: true 
        });
        
        render(<WeaponMastery2024 />);
        expect(screen.getByText('Loading weapon masteries...')).toBeInTheDocument();
    });

    it('renders weapon list when data loads', () => {
        const weaponsData = [
            { name: 'Vex', description: 'When you hit a creature with this weapon...' },
            { name: 'Push', description: 'When you hit a creature with this weapon...' },
        ];
        
        useWeaponMastery2024.mockReturnValue({ 
            data: weaponsData, 
            loading: false 
        });
        
        render(<WeaponMastery2024 />);
        expect(screen.getByText('Vex')).toBeInTheDocument();
        expect(screen.getByText('Push')).toBeInTheDocument();
    });

    it('renders weapon descriptions', () => {
        const weaponsData = [
            { name: 'Vex', description: 'When you hit a creature with this weapon...' },
        ];
        
        useWeaponMastery2024.mockReturnValue({ 
            data: weaponsData, 
            loading: false 
        });
        
        render(<WeaponMastery2024 />);
        expect(screen.getByText('When you hit a creature with this weapon...')).toBeInTheDocument();
    });

    it('renders multiple weapons', () => {
        const weaponsData = [
            { name: 'Vex', description: 'Description 1' },
            { name: 'Push', description: 'Description 2' },
            { name: 'Slow', description: 'Description 3' },
        ];
        
        useWeaponMastery2024.mockReturnValue({ 
            data: weaponsData, 
            loading: false 
        });
        
        render(<WeaponMastery2024 />);
        const weaponItems = document.querySelectorAll('.weapon-mastery-item');
        expect(weaponItems).toHaveLength(3);
    });
});
