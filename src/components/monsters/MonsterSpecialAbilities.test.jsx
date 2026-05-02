import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterSpecialAbilities from './MonsterSpecialAbilities';

vi.mock('../../utils/monsterUtils', () => ({
    getNameString: vi.fn((name) => name),
}));

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html || '' })),
}));

import { renderHtmlContent } from '../../utils/htmlUtils';

describe('MonsterSpecialAbilities', () => {
    const createMonster = (overrides = {}) => ({
        index: 'dragon',
        name: 'Dragon',
        special_abilities: [
              {
                name: 'Amphibious',
                desc: 'The dragon can breathe air and water.',
                usage: null,
              },
              {
                name: 'Legendary Resistance',
                desc: 'The dragon rerolls a failed save.',
                usage: { times: 3, type: 'per day' },
              },
          ],
          ...overrides,
      });

    beforeEach(() => {
        vi.clearAllMocks();
      });

    it('returns null when monster is not provided', () => {
        const { container } = render(<MonsterSpecialAbilities monster={null} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when monster is undefined', () => {
        const { container } = render(<MonsterSpecialAbilities monster={undefined} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when monster has no special_abilities', () => {
        const { container } = render(<MonsterSpecialAbilities monster={{ index: 'test' }} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when special_abilities is empty array', () => {
        const { container } = render(<MonsterSpecialAbilities monster={{ index: 'test', special_abilities: [] }} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when special_abilities is undefined', () => {
        const { container } = render(<MonsterSpecialAbilities monster={{ index: 'test', special_abilities: undefined }} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when special_abilities is null', () => {
        const { container } = render(<MonsterSpecialAbilities monster={{ index: 'test', special_abilities: null }} />);
        expect(container.firstChild).toBeNull();
      });

    it('renders the Special Traits header', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        expect(screen.getByText('Special Traits')).toBeInTheDocument();
      });

    it('renders each special ability name', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        expect(screen.getByText((content, element) => {
             return element.tagName === 'B' && element.textContent.includes('Amphibious');
          })).toBeInTheDocument();
      });

    it('renders ability description', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        expect(screen.getByText('The dragon can breathe air and water.')).toBeInTheDocument();
      });

    it('renders description via dangerouslySetInnerHTML', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        expect(renderHtmlContent).toHaveBeenCalledWith('The dragon can breathe air and water.');
      });

    it('shows usage times per day when usage.type is per day', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        const elements = screen.getAllByText((content, element) => {
             return element?.tagName === 'B' && element.textContent.includes('Legendary Resistance') && element.textContent.includes('3/day');
          });
        expect(elements.length).toBeGreaterThan(0);
      });

    it('does not show usage when type is not per day', () => {
        render(
             <MonsterSpecialAbilities
                monster={createMonster({
                    special_abilities: [
                         { name: 'Breath Weapon', desc: 'Fire breath.', usage: { times: '1', type: 'recharge' } },
                      ],
                  })}
             />
         );
        expect(screen.queryByText(/1\/day/)).not.toBeInTheDocument();
      });

    it('does not show usage when usage is null', () => {
        render(
             <MonsterSpecialAbilities
                monster={createMonster({ special_abilities: [{ name: 'Test', desc: 'Test desc.', usage: null }] })}
             />
         );
        expect(screen.queryByText(/null\/day/)).not.toBeInTheDocument();
      });

    it('does not show usage when usage is undefined', () => {
        render(
             <MonsterSpecialAbilities
                monster={createMonster({ special_abilities: [{ name: 'Test', desc: 'Test desc.', usage: undefined }] })}
             />
         );
        expect(screen.queryByText(/null\/day/)).not.toBeInTheDocument();
      });

    it('renders multiple abilities', () => {
        const monster = createMonster({
            special_abilities: [
                 { name: 'Ability 1', desc: 'Desc 1' },
                 { name: 'Ability 2', desc: 'Desc 2' },
                 { name: 'Ability 3', desc: 'Desc 3' },
              ],
          });
        render(<MonsterSpecialAbilities monster={monster} />);
        expect(screen.getByText('Desc 1')).toBeInTheDocument();
        expect(screen.getByText('Desc 2')).toBeInTheDocument();
        expect(screen.getByText('Desc 3')).toBeInTheDocument();
      });

    it('renders span wrapper for each ability', () => {
        const { container } = render(<MonsterSpecialAbilities monster={createMonster()} />);
        const spans = container.querySelectorAll('span b');
        expect(spans).toHaveLength(2);
      });

    it('renders parenthetical with usage times', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        const allText = screen.getAllByText(/3/);
        expect(allText.length).toBeGreaterThan(0);
        const dayText = screen.getAllByText(/\/day/);
        expect(dayText.length).toBeGreaterThan(0);
      });

    it('renders usage parenthetical with non-numeric times value', () => {
        render(
             <MonsterSpecialAbilities
                monster={createMonster({
                    special_abilities: [
                         { name: 'Special', desc: 'Test.', usage: { times: 'recharge 5-6', type: 'per day' } },
                      ],
                  })}
             />
         );
        const dayText = screen.getAllByText(/\/day/);
        expect(dayText.length).toBeGreaterThan(0);
      });

    it('renders colon after each ability name', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        const colons = document.querySelectorAll('b');
        expect(colons.length).toBeGreaterThan(0);
      });

    it('renders all ability descriptions', () => {
        render(<MonsterSpecialAbilities monster={createMonster()} />);
        expect(screen.getByText('The dragon can breathe air and water.')).toBeInTheDocument();
        expect(screen.getByText('The dragon rerolls a failed save.')).toBeInTheDocument();
      });
});
