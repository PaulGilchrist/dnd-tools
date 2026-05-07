import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Feats2024, ExtraAttacks, EnergyInfo, SpellcastingInfo, BarbarianInfo, BardicInfo, ChannelDivinity, DruidInfo, FighterInfo, MonkInfo, RangerInfo, RogueInfo, SorcererInfo, WarlockInfo } from './ClassLevelRenderers';

describe('Feats2024', () => {
    it('returns null when level is not provided', () => {
        const { container } = render(<Feats2024 level={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when level is 0', () => {
        const { container } = render(<Feats2024 level={0} />);
        expect(container.firstChild).toBeNull();
    });

    it('shows origin feat at level 1', () => {
        const { container } = render(<Feats2024 level={1} />);
        expect(container.firstChild).not.toBeNull();
        expect(screen.getByText(/1 Origin/)).toBeInTheDocument();
    });

    it('shows general feats at level 4', () => {
        render(<Feats2024 level={4} />);
        expect(screen.getByText(/1 General/)).toBeInTheDocument();
    });

    it('shows multiple general feats at higher levels', () => {
        render(<Feats2024 level={12} />);
        expect(screen.getByText(/3 General/)).toBeInTheDocument();
    });

    it('shows epic boon at level 19', () => {
        render(<Feats2024 level={19} />);
        expect(screen.getByText(/1 Epic Boon/)).toBeInTheDocument();
    });

    it('shows all feat types at level 19', () => {
        render(<Feats2024 level={19} />);
        expect(screen.getByText(/1 Origin/)).toBeInTheDocument();
        expect(screen.getByText(/4 General/)).toBeInTheDocument();
        expect(screen.getByText(/1 Epic Boon/)).toBeInTheDocument();
    });
});

describe('ExtraAttacks', () => {
    it('returns null when extra_attacks is not defined', () => {
        const { container } = render(<ExtraAttacks level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when extra_attacks is 0', () => {
        const { container } = render(<ExtraAttacks level={{ extra_attacks: 0 }} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays extra attacks when greater than 0', () => {
        render(<ExtraAttacks level={{ extra_attacks: 2 }} />);
        expect(screen.getByText(/Extra Attacks/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });
});

describe('EnergyInfo', () => {
    it('returns null when energy is not provided', () => {
        const { container } = render(<EnergyInfo energy={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when energy die info is incomplete', () => {
        const { container } = render(<EnergyInfo energy={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays energy info when complete', () => {
        render(<EnergyInfo energy={{ energy_die_num: 2, energy_die_type: 6 }} />);
        expect(screen.getByText(/Energy/)).toBeInTheDocument();
        expect(screen.getByText(/2d6/)).toBeInTheDocument();
    });
});

describe('SpellcastingInfo', () => {
    it('returns null when no spellcasting info', () => {
        const { container } = render(<SpellcastingInfo spellcasting={{}} />);
        expect(container.firstChild).not.toBeNull();
    });

    it('displays cantrips known', () => {
        render(<SpellcastingInfo spellcasting={{ cantrips_known: 3 }} />);
        expect(screen.getByText(/Cantrips Known/)).toBeInTheDocument();
        expect(screen.getByText(/3/)).toBeInTheDocument();
    });

    it('displays spell slots', () => {
        render(<SpellcastingInfo spellcasting={{ spell_slots_level_1: 2, spell_slots_level_2: 1 }} />);
        expect(screen.getByText(/Spell Slots/)).toBeInTheDocument();
        expect(screen.getByText(/2 of level 1/)).toBeInTheDocument();
        expect(screen.getByText(/1 of level 2/)).toBeInTheDocument();
    });
});

describe('BarbarianInfo', () => {
    it('returns null when no barbarian info', () => {
        const { container } = render(<BarbarianInfo level={{}} className="Barbarian" />);
        expect(container.firstChild).toBeNull();
    });

    it('displays rages', () => {
        render(<BarbarianInfo level={{ rages: 2 }} className="Barbarian" />);
        expect(screen.getByText(/Rages/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays rage damage', () => {
        render(<BarbarianInfo level={{ rage_damage: 2 }} className="Barbarian" />);
        expect(screen.getByText(/Rage Damage/)).toBeInTheDocument();
        expect(screen.getByText(/\+2/)).toBeInTheDocument();
    });
});

describe('BardicInfo', () => {
    it('returns null when no bardic die', () => {
        const { container } = render(<BardicInfo level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays bardic die', () => {
        render(<BardicInfo level={{ bardic_die: 8 }} />);
        expect(screen.getByText(/Bardic Die/)).toBeInTheDocument();
        expect(screen.getByText(/d8/)).toBeInTheDocument();
    });
});

describe('ChannelDivinity', () => {
    it('returns null when channel divinity is not defined', () => {
        const { container } = render(<ChannelDivinity level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays channel divinity uses', () => {
        render(<ChannelDivinity level={{ channel_divinity: 2 }} />);
        expect(screen.getByText(/Channel Divinity/)).toBeInTheDocument();
        expect(screen.getByText(/2 uses/)).toBeInTheDocument();
    });
});

describe('DruidInfo', () => {
    it('returns null when no druid info', () => {
        const { container } = render(<DruidInfo level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays wild shape', () => {
        render(<DruidInfo level={{ wild_shape: 'Yes' }} />);
        expect(screen.getByText(/Wild Shape/)).toBeInTheDocument();
    });
});

describe('FighterInfo', () => {
    it('returns null when no fighter info', () => {
        const { container } = render(<FighterInfo level={{}} className="Fighter" />);
        expect(container.firstChild).toBeNull();
    });

    it('displays second wind', () => {
        render(<FighterInfo level={{ second_wind: 1 }} className="Fighter" />);
        expect(screen.getByText(/Second Wind/)).toBeInTheDocument();
    });
});

describe('MonkInfo', () => {
    it('returns null when no monk info', () => {
        const { container } = render(<MonkInfo level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays martial arts die', () => {
        render(<MonkInfo level={{ martial_arts_die: 6 }} />);
        expect(screen.getByText(/Martial Arts Die/)).toBeInTheDocument();
        expect(screen.getByText(/d6/)).toBeInTheDocument();
    });

    it('displays focus points', () => {
        render(<MonkInfo level={{ focus_points: 4 }} />);
        expect(screen.getByText(/Focus Points/)).toBeInTheDocument();
        expect(screen.getByText(/4/)).toBeInTheDocument();
    });
});

describe('RangerInfo', () => {
    it('returns null when no ranger info', () => {
        const { container } = render(<RangerInfo level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays favored enemy', () => {
        render(<RangerInfo level={{ favored_enemy: 1 }} />);
        expect(screen.getByText(/Favored Enemy/)).toBeInTheDocument();
    });
});

describe('RogueInfo', () => {
    it('returns null when no rogue info', () => {
        const { container } = render(<RogueInfo level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays sneak attack', () => {
        render(<RogueInfo level={{ sneak_attack_num_d6: 3 }} />);
        expect(screen.getByText(/Sneak Attack/)).toBeInTheDocument();
        expect(screen.getByText(/3d6/)).toBeInTheDocument();
    });
});

describe('SorcererInfo', () => {
    it('returns null when no sorcerer info', () => {
        const { container } = render(<SorcererInfo level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays sorcery points', () => {
        render(<SorcererInfo level={{ sorcery_points: 3 }} />);
        expect(screen.getByText(/Sorcery Points/)).toBeInTheDocument();
        expect(screen.getByText(/3/)).toBeInTheDocument();
    });
});

describe('WarlockInfo', () => {
    it('returns null when no warlock info', () => {
        const { container } = render(<WarlockInfo level={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays eldritch invocations', () => {
        render(<WarlockInfo level={{ eldritch_invocations: 2 }} />);
        expect(screen.getByText(/Eldritch Invocations/)).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });
});
