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

// Helper to strip HTML tags for text content assertions
const stripHtml = (html) => html.replace(/<[^>]*>/g, '');

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
         const { container } = render(<SpellCasting magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Save DC: 13');
              });

      it('displays attack bonus', () => {
         const magicItem = createMagicItem({
            spellCasting: { attack_bonus: 5 }
            });
         const { container } = render(<SpellCasting magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Spell Attack Bonus: 5');
              });

      it('displays spells list', () => {
         const magicItem = createMagicItem({
            spellCasting: {
               spells: [
                    { name: 'Fireball', level: 3, charge_cost: 3 }
                      ]
                   }
                 });
         const { container } = render(<SpellCasting magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Fireball');
              });

      it('handles singular charge cost', () => {
         const magicItem = createMagicItem({
            spellCasting: {
               spells: [
                    { name: 'Burning Hands', level: 2, charge_cost: 1 }
                      ]
                   }
                 });
         const { container } = render(<SpellCasting magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('1 charge');
              });

      it('handles plural charge cost', () => {
         const magicItem = createMagicItem({
            spellCasting: {
               spells: [
                    { name: 'Fireball', level: 3, charge_cost: 3 }
                      ]
                   }
                 });
         const { container } = render(<SpellCasting magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('3 charges');
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
         const { container } = render(<Damage magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Damage: 2d8 fire');
              });

      it('displays extra damage', () => {
         const magicItem = createMagicItem({
            damage: { extra_damage: '1d6 force' }
   });
         const { container } = render(<Damage magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Extra Damage: 1d6 force');
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
         const { container } = render(<SavingThrows magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('DC 13 Dexterity');
         expect(stripHtml(container.innerHTML)).toContain('10 fire damage');
              });

      it('displays effect on success', () => {
         const magicItem = createMagicItem({
            savingThrows: [
                  { dc: 13, ability: 'Dexterity', effect_on_fail: '10 fire damage', effect_on_success: 'half damage' }
                   ]
                 });
         const { container } = render(<SavingThrows magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('half damage');
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
         const { container } = render(<Bonuses magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Attack Bonus: +3');
              });

      it('displays damage bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { damage_bonus: 3 }
            });
         const { container } = render(<Bonuses magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Damage Bonus: +3');
              });

      it('displays AC bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { ac_bonus: 1 }
            });
         const { container } = render(<Bonuses magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('AC Bonus: +1');
              });

      it('displays saving throw bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { saving_throw_bonus: 2 }
            });
         const { container } = render(<Bonuses magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Saving Throw Bonus: +2');
              });

      it('displays ability check bonus', () => {
         const magicItem = createMagicItem({
            bonuses: { ability_check_bonus: 2 }
            });
         const { container } = render(<Bonuses magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Ability Check Bonus: +2');
              });

      it('displays ability score increase', () => {
         const magicItem = createMagicItem({
            bonuses: {
               ability_score_increase: { amount: 1, ability: 'Strength', maximum: 20 }
                   }
                 });
         const { container } = render(<Bonuses magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Ability Score Increase: +1 to Strength');
         expect(stripHtml(container.innerHTML)).toContain('max 20');
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
         const { container } = render(<AdvantageDisadvantage magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Advantage on:');
              });

      it('displays disadvantage on', () => {
         const magicItem = createMagicItem({
            advantageDisadvantage: { disadvantage_on: ['Charisma checks'] }
            });
         const { container } = render(<AdvantageDisadvantage magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Disadvantage on:');
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
         const { container } = render(<ResistancesImmunities magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Resistances:');
         expect(stripHtml(container.innerHTML)).toContain('fire, cold');
              });

      it('displays immunities', () => {
         const magicItem = createMagicItem({ immunities: ['poison'] });
         const { container } = render(<ResistancesImmunities magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Immunities:');
         expect(stripHtml(container.innerHTML)).toContain('poison');
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
         const { container } = render(<Sentience magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Alignment: Chaotic Good');
         expect(stripHtml(container.innerHTML)).toContain('Intelligence: 10');
         expect(stripHtml(container.innerHTML)).toContain('Wisdom: 12');
         expect(stripHtml(container.innerHTML)).toContain('Charisma: 14');
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
         const { container } = render(<ItemSlot magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Item Slot:');
         expect(stripHtml(container.innerHTML)).toContain('Ring');
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
         const { container } = render(<UsageLimit magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Usage Limit:');
         expect(stripHtml(container.innerHTML)).toContain('3 times per day');
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
         const { container } = render(<Duration magicItem={magicItem} />);
         expect(stripHtml(container.innerHTML)).toContain('Duration:');
         expect(stripHtml(container.innerHTML)).toContain('1 hour');
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
