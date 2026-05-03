import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerClass2024CoreTraits from './PlayerClass2024CoreTraits';

describe('PlayerClass2024CoreTraits', () => {
    it('returns null when playerClass is not provided', () => {
        const { container } = render(<PlayerClass2024CoreTraits playerClass={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays core traits heading', () => {
        const playerClass = {
            primary_ability: 'Strength',
            hit_point_die: 12,
            saving_throw_proficiencies: ['Strength', 'Constitution'],
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText('Core Traits')).toBeInTheDocument();
    });

    it('displays primary ability', () => {
        const playerClass = {
            primary_ability: 'Strength',
            hit_point_die: 12,
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Primary Ability/)).toBeInTheDocument();
        expect(screen.getByText(/Strength/)).toBeInTheDocument();
    });

    it('formats hit die from number', () => {
        const playerClass = {
            hit_point_die: 12,
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Hit Die/)).toBeInTheDocument();
        expect(screen.getByText(/d12/)).toBeInTheDocument();
    });

    it('formats hit die from string', () => {
        const playerClass = {
            hit_point_die: 'd10',
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Hit Die/)).toBeInTheDocument();
        expect(screen.getByText(/d10/)).toBeInTheDocument();
    });

    it('displays saving throw proficiencies', () => {
        const playerClass = {
            saving_throw_proficiencies: ['Strength', 'Constitution'],
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Saving Throw Proficiencies/)).toBeInTheDocument();
        expect(screen.getByText(/Strength/)).toBeInTheDocument();
        expect(screen.getByText(/Constitution/)).toBeInTheDocument();
    });

    it('displays skill proficiencies', () => {
        const playerClass = {
            skill_proficiency_choices: 'Choose 2 from: Athletics, Perception',
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Skill Proficiencies/)).toBeInTheDocument();
        expect(screen.getByText(/Athletics/)).toBeInTheDocument();
    });

    it('displays weapon proficiencies', () => {
        const playerClass = {
            weapon_proficiencies: 'Simple weapons, martial weapons',
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Weapon Proficiencies/)).toBeInTheDocument();
        expect(screen.getByText(/Simple weapons/)).toBeInTheDocument();
    });

    it('displays armor training', () => {
        const playerClass = {
            armor_training: 'Light armor, medium armor, shields',
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Armor Training/)).toBeInTheDocument();
        expect(screen.getByText(/Light armor/)).toBeInTheDocument();
    });

    it('displays tool proficiencies', () => {
        const playerClass = {
            tool_proficiencies: 'Choose one type of artisan\'s tools',
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Tool Proficiencies/)).toBeInTheDocument();
    });

    it('displays starting equipment', () => {
        const playerClass = {
            starting_equipment: 'Leather armor, longsword, shield',
        };
        render(<PlayerClass2024CoreTraits playerClass={playerClass} />);
        expect(screen.getByText(/Starting Equipment/)).toBeInTheDocument();
        expect(screen.getByText(/Leather armor/)).toBeInTheDocument();
    });
});
