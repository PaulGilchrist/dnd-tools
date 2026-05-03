import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerClass2024Multiclassing from './PlayerClass2024Multiclassing';

describe('PlayerClass2024Multiclassing', () => {
    it('returns null when multiclassing is not provided', () => {
        const { container } = render(<PlayerClass2024Multiclassing multiclassing={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays multiclassing heading', () => {
        const multiclassing = {
            requirements: 'Strength 13',
        };
        render(<PlayerClass2024Multiclassing multiclassing={multiclassing} />);
        expect(screen.getByText('Multiclassing')).toBeInTheDocument();
    });

    it('displays requirements', () => {
        const multiclassing = {
            requirements: 'Strength 13 or Dexterity 13',
        };
        render(<PlayerClass2024Multiclassing multiclassing={multiclassing} />);
        expect(screen.getByText(/Strength 13/)).toBeInTheDocument();
    });

    it('displays core traits gained', () => {
        const multiclassing = {
            requirements: 'Strength 13',
            core_traits_gained: 'Proficiencies in simple weapons',
        };
        render(<PlayerClass2024Multiclassing multiclassing={multiclassing} />);
        expect(screen.getByText(/Core Traits Gained/)).toBeInTheDocument();
        expect(screen.getByText(/simple weapons/)).toBeInTheDocument();
    });

    it('displays features gained', () => {
        const multiclassing = {
            requirements: 'Strength 13',
            features_gained: 'Second Wind, Fighting Style',
        };
        render(<PlayerClass2024Multiclassing multiclassing={multiclassing} />);
        expect(screen.getByText(/Features Gained/)).toBeInTheDocument();
        expect(screen.getByText(/Second Wind/)).toBeInTheDocument();
    });

    it('displays all multiclassing info together', () => {
        const multiclassing = {
            requirements: 'Strength 13',
            core_traits_gained: 'Proficiencies',
            features_gained: 'Second Wind',
        };
        render(<PlayerClass2024Multiclassing multiclassing={multiclassing} />);
        expect(screen.getByText('Multiclassing')).toBeInTheDocument();
        expect(screen.getByText(/Strength 13/)).toBeInTheDocument();
        expect(screen.getByText(/Core Traits Gained/)).toBeInTheDocument();
        expect(screen.getByText(/Features Gained/)).toBeInTheDocument();
    });
});
