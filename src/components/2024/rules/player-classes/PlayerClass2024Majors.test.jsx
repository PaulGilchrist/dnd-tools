import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerClass2024Majors from './PlayerClass2024Majors';

vi.mock('../../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

describe('PlayerClass2024Majors', () => {
    const mockPlayerClass = {
        majors: [
            {
                name: 'Path of the Berserker',
                subtitle: 'Berserker',
                description: 'A furious warrior.',
                features: [
                    { level: 3, name: 'Frenzy', description: 'You can go into a frenzy.' },
                ],
                spells: [],
            },
            {
                name: 'Path of the Totem Warrior',
                subtitle: 'Totem Warrior',
                description: 'A spiritual warrior.',
                features: [
                    { level: 3, name: 'Totem Spirit', description: 'Choose a totem spirit.' },
                ],
                spells: [{ name: 'Hunter\'s Mark', level: 1 }],
            },
        ],
    };

    const onShowMajor = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when playerClass has no majors', () => {
        const { container } = render(
            <PlayerClass2024Majors
                playerClass={{}}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('returns null when majors array is empty', () => {
        const { container } = render(
            <PlayerClass2024Majors
                playerClass={{ majors: [] }}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays major options heading', () => {
        render(
            <PlayerClass2024Majors
                playerClass={mockPlayerClass}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        expect(screen.getByText('Major Options')).toBeInTheDocument();
    });

    it('displays all majors', () => {
        render(
            <PlayerClass2024Majors
                playerClass={mockPlayerClass}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        expect(screen.getByText('Path of the Berserker')).toBeInTheDocument();
        expect(screen.getByText('Path of the Totem Warrior')).toBeInTheDocument();
    });

    it('displays major subtitle', () => {
        render(
            <PlayerClass2024Majors
                playerClass={mockPlayerClass}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        expect(screen.getByText('Berserker')).toBeInTheDocument();
        expect(screen.getByText('Totem Warrior')).toBeInTheDocument();
    });

    it('displays major description when expanded', async () => {
        const user = userEvent.setup();
        render(
            <PlayerClass2024Majors
                playerClass={mockPlayerClass}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        const header = screen.getByText('Path of the Berserker').closest('.card-header');
        await user.click(header);
        await waitFor(() => {
            expect(screen.getByText(/A furious warrior/)).toBeInTheDocument();
        });
    });

    it('displays major features when expanded', async () => {
        const user = userEvent.setup();
        render(
            <PlayerClass2024Majors
                playerClass={mockPlayerClass}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        const header = screen.getByText('Path of the Berserker').closest('.card-header');
        await user.click(header);
        await waitFor(() => {
            expect(screen.getByText(/Frenzy/)).toBeInTheDocument();
        });
    });

    it('calls onShowMajor when major header is clicked', () => {
        render(
            <PlayerClass2024Majors
                playerClass={mockPlayerClass}
                shownMajor=""
                onShowMajor={onShowMajor}
                majorFeatures={[]}
            />
        );
        const header = screen.getByText('Path of the Berserker').closest('.card-header');
        header.click();
        expect(onShowMajor).toHaveBeenCalledWith('Path of the Berserker');
    });
});
