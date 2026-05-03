import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Subrace2024 from './Subrace2024';

describe('Subrace2024', () => {
    it('returns null when subrace is not provided', () => {
        const { container } = render(<Subrace2024 subrace={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays subrace name', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            desc: 'Hill dwarves are...',
            ability_bonuses: [{ ability_score: 'WIS', bonus: 1 }],
            speed: 25,
            racial_traits: [],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText('Hill Dwarf')).toBeInTheDocument();
    });

    it('displays subrace description', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            desc: 'Hill dwarves are sturdy.',
            ability_bonuses: [],
            speed: 25,
            racial_traits: [],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText('Hill dwarves are sturdy.')).toBeInTheDocument();
    });

    it('displays ability bonuses', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            ability_bonuses: [
                { ability_score: 'WIS', bonus: 1 },
                { ability_score: 'CON', bonus: 2 },
            ],
            speed: 25,
            racial_traits: [],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText(/WIS/)).toBeInTheDocument();
        expect(screen.getByText(/CON/)).toBeInTheDocument();
    });

    it('displays speed', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            speed: 25,
            ability_bonuses: [],
            racial_traits: [],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText(/25 feet/)).toBeInTheDocument();
    });

    it('displays starting proficiencies', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            speed: 25,
            ability_bonuses: [],
            starting_proficiencies: ['Battleaxes', 'Handaxes'],
            racial_traits: [],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText(/Battleaxes/)).toBeInTheDocument();
        expect(screen.getByText(/Handaxes/)).toBeInTheDocument();
    });

    it('displays racial traits with descriptions', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            speed: 25,
            ability_bonuses: [],
            racial_traits: [
                { index: 'dwarven-toughness', name: 'Dwarven Toughness', desc: 'Your hit points increase.' },
            ],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText('Dwarven Toughness')).toBeInTheDocument();
        expect(screen.getByText('Your hit points increase.')).toBeInTheDocument();
    });

    it('displays racial traits without descriptions', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            speed: 25,
            ability_bonuses: [],
            racial_traits: [
                { index: 'darkvision', name: 'Darkvision' },
            ],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText('Darkvision')).toBeInTheDocument();
    });

    it('displays language options', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            speed: 25,
            ability_bonuses: [],
            racial_traits: [],
            language_options: { from: ['Common', 'Dwarvish'] },
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText(/Language Options/)).toBeInTheDocument();
        expect(screen.getByText(/Common/)).toBeInTheDocument();
    });

    it('displays special options with descriptions', () => {
        const subrace = {
            index: 'hill-dwarf',
            name: 'Hill Dwarf',
            speed: 25,
            ability_bonuses: [],
            racial_traits: [
                { name: 'Stonecunning', desc: 'You have advantage on History checks.' },
            ],
        };
        render(<Subrace2024 subrace={subrace} />);
        expect(screen.getByText(/Special Options/)).toBeInTheDocument();
        expect(screen.getByText('Stonecunning')).toBeInTheDocument();
    });
});
