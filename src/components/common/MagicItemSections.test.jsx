import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
   ChargeSystem,
   SpellCasting,
   Damage,
   SavingThrows,
   Bonuses,
   AdvantageDisadvantage,
   Conditions,
   ResistancesImmunities,
   Curse,
   Sentience,
   ItemSlot,
   UsageLimit,
   Duration,
   ActionTypes,
   Properties,
   AttunementRequirements
} from './MagicItemSections';

vi.mock('../../utils/htmlUtils', () => ({
   renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('MagicItemSections', () => {
   const createMagicItem = (overrides = {}) => ({
      index: 'wand-of-fireball',
      name: 'Wand of Fireball',
               ...overrides,
               });

   describe('ChargeSystem', () => {
      it('returns null when chargeSystem is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<ChargeSystem magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays total charges', () => {
         const magicItem = createMagicItem({
            chargeSystem: { total_charges: 10 }
               });
         render(<ChargeSystem magicItem={magicItem} />);
         expect(screen.getByText(/Has 10 charges/)).toBeInTheDocument();
            });

      it('displays regain type', () => {
         const magicItem = createMagicItem({
            chargeSystem: { regain_type: '2d8 charges at dawn' }
               });
         render(<ChargeSystem magicItem={magicItem} />);
         expect(screen.getByText(/Regains 2d8 charges at dawn/)).toBeInTheDocument();
            });

      it('displays regain formula', () => {
         const magicItem = createMagicItem({
            chargeSystem: { regain_formula: '2d8' }
               });
         render(<ChargeSystem magicItem={magicItem} />);
         expect(screen.getByText(/2d8/)).toBeInTheDocument();
            });

      it('displays destroy on exhaust warning', () => {
         const magicItem = createMagicItem({
            chargeSystem: { destroy_on_exhaust: true }
               });
         render(<ChargeSystem magicItem={magicItem} />);
         expect(screen.getByText(/Destroyed when last charge expended/)).toBeInTheDocument();
            });

      it('displays recovery on exhaust info', () => {
         const magicItem = createMagicItem({
            chargeSystem: { recovery_on_exhaust: true }
               });
         render(<ChargeSystem magicItem={magicItem} />);
         expect(screen.getByText(/Chance to recover charges/)).toBeInTheDocument();
            });

      it('displays all charge system properties', () => {
         const magicItem = createMagicItem({
            chargeSystem: {
               total_charges: 10,
               regain_type: '2d8 charges',
               regain_formula: '2d8',
               destroy_on_exhaust: true
                 }
               });
         render(<ChargeSystem magicItem={magicItem} />);
         expect(screen.getByText(/Charge System:/)).toBeInTheDocument();
   });
    });

   describe('SpellCasting', () => {
      it('returns null when spellCasting is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<SpellCasting magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays save DC', () => {
         const magicItem = createMagicItem({
            spellCasting: { save_dc: 13 }
               });
         render(<SpellCasting magicItem={magicItem} />);
         expect(screen.getByText(/Save DC: 13/)).toBeInTheDocument();
            });

      it('displays attack bonus', () => {
         const magicItem = createMagicItem({
            spellCasting: { attack_bonus: 5 }
               });
         render(<SpellCasting magicItem={magicItem} />);
         expect(screen.getByText(/Spell Attack Bonus: 5/)).toBeInTheDocument();
            });

      it('displays spells list', () => {
         const magicItem = createMagicItem({
            spellCasting: {
               spells: [
                  { name: 'Fireball', level: 3, charge_cost: 3 }
                    ]
                 }
               });
         render(<SpellCasting magicItem={magicItem} />);
         expect(screen.getByText(/Fireball/)).toBeInTheDocument();
            });

      it('handles singular charge cost', () => {
         const magicItem = createMagicItem({
            spellCasting: {
               spells: [
                  { name: 'Burning Hands', level: 2, charge_cost: 1 }
                    ]
                 }
               });
         render(<SpellCasting magicItem={magicItem} />);
         expect(screen.getByText(/1 charge/)).toBeInTheDocument();
            });

      it('handles plural charge cost', () => {
         const magicItem = createMagicItem({
            spellCasting: {
               spells: [
                  { name: 'Fireball', level: 3, charge_cost: 3 }
                    ]
                 }
               });
         render(<SpellCasting magicItem={magicItem} />);
         expect(screen.getByText(/3 charges/)).toBeInTheDocument();
   });
    });

   describe('Damage', () => {
      it('returns null when damage is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<Damage magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays damage dice and type', () => {
         const magicItem = createMagicItem({
            damage: { damage_dice: '2d8', damage_type: 'fire' }
               });
         render(<Damage magicItem={magicItem} />);
         expect(screen.getByText(/Damage: 2d8 fire/)).toBeInTheDocument();
            });

      it('displays extra damage', () => {
         const magicItem = createMagicItem({
            damage: { extra_damage: '1d6 force' }
               });
         render(<Damage magicItem={magicItem} />);
         expect(screen.getByText(/Extra Damage: 1d6 force/)).toBeInTheDocument();
   });
    });

   describe('SavingThrows', () => {
      it('returns null when savingThrows is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<SavingThrows magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('returns null when savingThrows is empty', () => {
         const magicItem = createMagicItem({ savingThrows: [] });
         const { container } = render(<SavingThrows magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays saving throws', () => {
         const magicItem = createMagicItem({
            savingThrows: [
                { dc: 13, ability: 'Dexterity', effect_on_fail: '10 fire damage' }
                 ]
               });
         render(<SavingThrows magicItem={magicItem} />);
         expect(screen.getByText(/DC 13 Dexterity/)).toBeInTheDocument();
         expect(screen.getByText(/10 fire damage/)).toBeInTheDocument();
            });

      it('displays effect on success', () => {
         const magicItem = createMagicItem({
            savingThrows: [
                { dc: 13, ability: 'Dexterity', effect_on_fail: '10 fire damage', effect_on_success: 'half damage' }
                 ]
               });
         render(<SavingThrows magicItem={magicItem} />);
         expect(screen.getByText(/half damage/)).toBeInTheDocument();
   });
    });

   describe('Bonuses', () => {
      it('returns null when bonuses is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<Bonuses magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays attack bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { attack_bonus: 3 }
               });
         render(<Bonuses magicItem={magicItem} />);
         expect(screen.getByText(/Attack Bonus: \+3/)).toBeInTheDocument();
            });

      it('displays damage bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { damage_bonus: 3 }
               });
         render(<Bonuses magicItem={magicItem} />);
         expect(screen.getByText(/Damage Bonus: \+3/)).toBeInTheDocument();
            });

      it('displays AC bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { ac_bonus: 1 }
               });
         render(<Bonuses magicItem={magicItem} />);
         expect(screen.getByText(/AC Bonus: \+1/)).toBeInTheDocument();
            });

      it('displays saving throw bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { saving_throw_bonus: 2 }
               });
         render(<Bonuses magicItem={magicItem} />);
         expect(screen.getByText(/Saving Throw Bonus: \+2/)).toBeInTheDocument();
            });

      it('displays ability check bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { ability_check_bonus: 2 }
               });
         render(<Bonuses magicItem={magicItem} />);
         expect(screen.getByText(/Ability Check Bonus: \+2/)).toBeInTheDocument();
            });

      it('displays ability score increase', () => {
         const magicItem = createMagicItem({
            bonuses: {
               ability_score_increase: { amount: 1, ability: 'Strength', maximum: 20 }
                 }
               });
         render(<Bonuses magicItem={magicItem} />);
         expect(screen.getByText(/Ability Score Increase: \+1 to Strength/)).toBeInTheDocument();
         expect(screen.getByText(/max 20/)).toBeInTheDocument();
   });
    });

   describe('AdvantageDisadvantage', () => {
      it('returns null when advantageDisadvantage is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<AdvantageDisadvantage magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays advantage on', () => {
         const magicItem = createMagicItem({
            advantageDisadvantage: { advantage_on: ['Stealth checks', 'Perception checks'] }
               });
         render(<AdvantageDisadvantage magicItem={magicItem} />);
         expect(screen.getByText(/Advantage on:/)).toBeInTheDocument();
            });

      it('displays disadvantage on', () => {
         const magicItem = createMagicItem({
            advantageDisadvantage: { disadvantage_on: ['Charisma checks'] }
               });
         render(<AdvantageDisadvantage magicItem={magicItem} />);
         expect(screen.getByText(/Disadvantage on:/)).toBeInTheDocument();
            });

      it('returns null when both lists are empty', () => {
         const magicItem = createMagicItem({
            advantageDisadvantage: { advantage_on: [], disadvantage_on: [] }
               });
         const { container } = render(<AdvantageDisadvantage magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
   });
    });

   describe('Conditions', () => {
      it('returns null when conditions is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<Conditions magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('returns null when conditions is empty', () => {
         const magicItem = createMagicItem({ conditions: [] });
         const { container } = render(<Conditions magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays conditions', () => {
         const magicItem = createMagicItem({ conditions: ['Poisoned', 'Blinded'] });
         render(<Conditions magicItem={magicItem} />);
         expect(screen.getByText(/Conditions:/)).toBeInTheDocument();
         expect(screen.getByText(/Poisoned, Blinded/)).toBeInTheDocument();
   });
    });

   describe('ResistancesImmunities', () => {
      it('returns null when neither resistances nor immunities are provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<ResistancesImmunities magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays resistances', () => {
         const magicItem = createMagicItem({ resistances: ['fire', 'cold'] });
         render(<ResistancesImmunities magicItem={magicItem} />);
         expect(screen.getByText(/Resistances:/)).toBeInTheDocument();
         expect(screen.getByText(/fire, cold/)).toBeInTheDocument();
            });

      it('displays immunities', () => {
         const magicItem = createMagicItem({ immunities: ['poison'] });
         render(<ResistancesImmunities magicItem={magicItem} />);
         expect(screen.getByText(/Immunities:/)).toBeInTheDocument();
         expect(screen.getByText(/poison/)).toBeInTheDocument();
   });
    });

   describe('Curse', () => {
      it('returns null when curse is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<Curse magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays curse description', () => {
         const magicItem = createMagicItem({
            curse: { description: 'Cannot remove the item' }
               });
         render(<Curse magicItem={magicItem} />);
         expect(screen.getByText(/Curse:/)).toBeInTheDocument();
         expect(screen.getByText(/Cannot remove the item/)).toBeInTheDocument();
            });

      it('displays curse removal info', () => {
         const magicItem = createMagicItem({
            curse: { description: 'Cursed', removal: 'Wish spell' }
               });
         render(<Curse magicItem={magicItem} />);
         expect(screen.getByText(/Removal: Wish spell/)).toBeInTheDocument();
   });
    });

   describe('Sentience', () => {
      it('returns null when sentience is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<Sentience magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays sentience properties', () => {
         const magicItem = createMagicItem({
            sentience: {
               alignment: 'Chaotic Good',
               intelligence: 10,
               wisdom: 12,
               charisma: 14,
               languages: ['Common', 'Elvish'],
               personality: 'Friendly',
               purpose: 'Protect its owner',
               communication: 'Telepathy'
                 }
               });
         render(<Sentience magicItem={magicItem} />);
         expect(screen.getByText(/Alignment: Chaotic Good/)).toBeInTheDocument();
         expect(screen.getByText(/Intelligence: 10/)).toBeInTheDocument();
         expect(screen.getByText(/Wisdom: 12/)).toBeInTheDocument();
         expect(screen.getByText(/Charisma: 14/)).toBeInTheDocument();
   });
    });

   describe('ItemSlot', () => {
      it('returns null when itemSlot is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<ItemSlot magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays item slot', () => {
         const magicItem = createMagicItem({ itemSlot: 'Ring' });
         render(<ItemSlot magicItem={magicItem} />);
         expect(screen.getByText(/Item Slot: Ring/)).toBeInTheDocument();
   });
    });

   describe('UsageLimit', () => {
      it('returns null when usageLimit is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<UsageLimit magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays usage limit', () => {
         const magicItem = createMagicItem({ usageLimit: '3 times per day' });
         render(<UsageLimit magicItem={magicItem} />);
         expect(screen.getByText(/Usage Limit: 3 times per day/)).toBeInTheDocument();
   });
    });

   describe('Duration', () => {
      it('returns null when duration is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<Duration magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays duration', () => {
         const magicItem = createMagicItem({ duration: '1 hour' });
         render(<Duration magicItem={magicItem} />);
         expect(screen.getByText(/Duration: 1 hour/)).toBeInTheDocument();
   });
    });

   describe('ActionTypes', () => {
      it('returns null when actionTypes is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<ActionTypes magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('returns null when actionTypes is empty', () => {
         const magicItem = createMagicItem({ actionTypes: [] });
         const { container } = render(<ActionTypes magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays action types', () => {
         const magicItem = createMagicItem({ actionTypes: ['Action', 'Bonus Action'] });
         render(<ActionTypes magicItem={magicItem} />);
         expect(screen.getByText(/Action Types:/)).toBeInTheDocument();
         expect(screen.getByText(/Action, Bonus Action/)).toBeInTheDocument();
   });
    });

   describe('Properties', () => {
      it('returns null when properties is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<Properties magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('returns null when properties is empty', () => {
         const magicItem = createMagicItem({ properties: [] });
         const { container } = render(<Properties magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays properties', () => {
         const magicItem = createMagicItem({ properties: ['Ranged', 'Loading'] });
         render(<Properties magicItem={magicItem} />);
         expect(screen.getByText(/Properties:/)).toBeInTheDocument();
         expect(screen.getByText(/Ranged, Loading/)).toBeInTheDocument();
   });
    });

   describe('AttunementRequirements', () => {
      it('returns null when attunementRequirements is not provided', () => {
         const magicItem = createMagicItem();
         const { container } = render(<AttunementRequirements magicItem={magicItem} />);
         expect(container.firstChild).toBeNull();
            });

      it('displays attunement requirements', () => {
         const magicItem = createMagicItem({ attunementRequirements: 'Requires attunement by a wizard' });
         render(<AttunementRequirements magicItem={magicItem} />);
         expect(screen.getByText(/Attunement Requirement:/)).toBeInTheDocument();
         expect(screen.getByText(/Requires attunement by a wizard/)).toBeInTheDocument();
   });
    });
});