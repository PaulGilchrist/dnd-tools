import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SorcererStats from './SorcererStats';

describe('SorcererStats', () => {
    it('returns null when class_specific is not provided', () => {
        const { container } = render(<SorcererStats class_specific={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays sorcery points', () => {
        render(<SorcererStats class_specific={{ sorcery_points: 3 }} />);
        expect(screen.getByText(/Sorcery Points/)).toBeInTheDocument();
        expect(screen.getByText(/3/)).toBeInTheDocument();
    });

    it('displays metamagic known', () => {
        render(<SorcererStats class_specific={{ metamagic_known: 2 }} />);
        expect(screen.getByText(/Metamagic Known/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays creating spell slots', () => {
        render(
            <SorcererStats
                class_specific={{
                    creating_spell_slots: [
                        { spell_slot_level: 1, sorcery_point_cost: 2 },
                        { spell_slot_level: 2, sorcery_point_cost: 3 },
                    ],
                }}
            />
        );
        expect(screen.getByText(/Creating Spell Slots/)).toBeInTheDocument();
        expect(screen.getByText(/Level 1 Point Cost = 2/)).toBeInTheDocument();
        expect(screen.getByText(/Level 2 Point Cost = 3/)).toBeInTheDocument();
    });

    it('displays all stats together', () => {
        render(
            <SorcererStats
                class_specific={{
                    sorcery_points: 4,
                    metamagic_known: 2,
                    creating_spell_slots: [{ spell_slot_level: 1, sorcery_point_cost: 2 }],
                }}
            />
        );
        expect(screen.getByText(/Sorcery Points/)).toBeInTheDocument();
        expect(screen.getByText(/Metamagic Known/)).toBeInTheDocument();
        expect(screen.getByText(/Creating Spell Slots/)).toBeInTheDocument();
    });

    it('does not display sorcery points when 0', () => {
        render(<SorcererStats class_specific={{ sorcery_points: 0 }} />);
        expect(screen.queryByText(/Sorcery Points/)).not.toBeInTheDocument();
    });

    it('does not display metamagic when 0', () => {
        render(<SorcererStats class_specific={{ metamagic_known: 0 }} />);
        expect(screen.queryByText(/Metamagic Known/)).not.toBeInTheDocument();
    });
});
