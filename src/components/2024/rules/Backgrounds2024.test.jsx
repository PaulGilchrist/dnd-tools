import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Backgrounds2024 from './Backgrounds2024';

vi.mock('../../../data/dataService', () => ({
    use2024Backgrounds: vi.fn(),
}));

import { use2024Backgrounds } from '../../../data/dataService';

describe('Backgrounds2024', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when data is loading', () => {
        use2024Backgrounds.mockReturnValue({ 
            data: null, 
            loading: true 
        });
        
        render(<Backgrounds2024 />);
        expect(screen.getByText('Loading backgrounds...')).toBeInTheDocument();
    });

    it('renders page header with title', () => {
        use2024Backgrounds.mockReturnValue({ 
            data: [], 
            loading: false 
        });
        
        render(<Backgrounds2024 />);
        expect(screen.getByText('Backgrounds')).toBeInTheDocument();
    });

    it('renders page description', () => {
        use2024Backgrounds.mockReturnValue({ 
            data: [], 
            loading: false 
        });
        
        render(<Backgrounds2024 />);
        expect(screen.getByText(/A background represents the character's origins/)).toBeInTheDocument();
    });

    it('renders background list when data loads', () => {
        const backgroundsData = [
            { index: 'acolyte', name: 'Acolyte', description: '<p>Description 1</p>', ability_scores: 'Wisdom', feat: 'Magic Initiate', skill_proficiencies: 'Insight, Religion', tool_proficiency: 'None', equipment: 'None' },
            { index: 'criminal', name: 'Criminal', description: '<p>Description 2</p>', ability_scores: 'Dexterity', feat: 'Skilled', skill_proficiencies: 'Deception, Stealth', tool_proficiency: 'Thieves tools', equipment: 'None' },
        ];
        
        use2024Backgrounds.mockReturnValue({ 
            data: backgroundsData, 
            loading: false 
        });
        
        render(<Backgrounds2024 />);
        expect(screen.getByText('Acolyte')).toBeInTheDocument();
        expect(screen.getByText('Criminal')).toBeInTheDocument();
    });

    it('expands background card on click', () => {
        const backgroundsData = [
            { index: 'acolyte', name: 'Acolyte', description: '<p>Description 1</p>', ability_scores: 'Wisdom', feat: 'Magic Initiate', skill_proficiencies: 'Insight, Religion', tool_proficiency: 'None', equipment: 'None' },
        ];
        
        use2024Backgrounds.mockReturnValue({ 
            data: backgroundsData, 
            loading: false 
        });
        
        render(<Backgrounds2024 />);
        const cardHeader = screen.getByText('Acolyte').closest('.card-header');
        act(() => {
            cardHeader.click();
        });
        expect(screen.getByText('Ability Scores')).toBeInTheDocument();
        expect(screen.getByText('Feat')).toBeInTheDocument();
    });

    it('shows background details when expanded', () => {
        const backgroundsData = [
            { index: 'acolyte', name: 'Acolyte', description: '<p>You performed sacred rites.</p>', ability_scores: 'Wisdom', feat: 'Magic Initiate', skill_proficiencies: 'Insight, Religion', tool_proficiency: 'None', equipment: 'None' },
        ];
        
        use2024Backgrounds.mockReturnValue({ 
            data: backgroundsData, 
            loading: false 
        });
        
        render(<Backgrounds2024 />);
        const cardHeader = screen.getByText('Acolyte').closest('.card-header');
        act(() => {
            cardHeader.click();
        });
        expect(screen.getByText(/You performed sacred rites/)).toBeInTheDocument();
        expect(screen.getByText(/Ability Scores/)).toBeInTheDocument();
        expect(screen.getByText(/Wisdom/)).toBeInTheDocument();
        expect(screen.getByText(/Magic Initiate/)).toBeInTheDocument();
    });
});
