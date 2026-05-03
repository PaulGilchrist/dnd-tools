import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerClassBasicInfo from './PlayerClassBasicInfo';

describe('PlayerClassBasicInfo', () => {
    const mockGetNameString = (items) => items.join(', ');

    it('returns null when playerClass is not provided', () => {
        const { container } = render(
            <PlayerClassBasicInfo playerClass={null} getNameString={mockGetNameString} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays description', () => {
        render(
            <PlayerClassBasicInfo
                playerClass={{ desc: 'A brave warrior' }}
                getNameString={mockGetNameString}
            />
        );
        expect(screen.getByText(/A brave warrior/)).toBeInTheDocument();
    });

    it('displays hit die', () => {
        render(
            <PlayerClassBasicInfo
                playerClass={{ desc: 'test', hit_die: 10 }}
                getNameString={mockGetNameString}
            />
        );
        expect(screen.getByText(/Hit Die/)).toBeInTheDocument();
        expect(screen.getByText(/d10/)).toBeInTheDocument();
    });

    it('displays proficiencies', () => {
        render(
            <PlayerClassBasicInfo
                playerClass={{
                    desc: 'test',
                    hit_die: 10,
                    proficiencies: ['Simple weapons', 'Martial weapons'],
                }}
                getNameString={mockGetNameString}
            />
        );
        expect(screen.getByText(/Proficiencies/)).toBeInTheDocument();
        expect(screen.getByText(/Simple weapons/)).toBeInTheDocument();
    });

    it('displays proficiency choices', () => {
        render(
            <PlayerClassBasicInfo
                playerClass={{
                    desc: 'test',
                    hit_die: 10,
                    proficiency_choices: [{ choose: 2, from: ['History', 'Perception'] }],
                }}
                getNameString={mockGetNameString}
            />
        );
        expect(screen.getByText(/Choose 2/)).toBeInTheDocument();
        expect(screen.getByText(/History/)).toBeInTheDocument();
    });

    it('displays saving throws', () => {
        render(
            <PlayerClassBasicInfo
                playerClass={{
                    desc: 'test',
                    hit_die: 10,
                    saving_throws: ['Strength', 'Constitution'],
                }}
                getNameString={mockGetNameString}
            />
        );
        expect(screen.getByText(/Saving Throws/)).toBeInTheDocument();
        expect(screen.getByText(/Strength/)).toBeInTheDocument();
    });

    it('displays starting wealth', () => {
        render(
            <PlayerClassBasicInfo
                playerClass={{
                    desc: 'test',
                    hit_die: 10,
                    starting_wealth: '5d4 x 10 gp',
                }}
                getNameString={mockGetNameString}
            />
        );
        expect(screen.getByText(/Starting Wealth/)).toBeInTheDocument();
        expect(screen.getByText(/5d4 x 10 gp/)).toBeInTheDocument();
    });
});
