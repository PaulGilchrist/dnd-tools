import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterLairActions from './MonsterLairActions';

vi.mock('../../utils/monsterUtils', () => ({
    getNameString: vi.fn((name) => name),
}));

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html || '' })),
}));

import { renderHtmlContent } from '../../utils/htmlUtils';

describe('MonsterLairActions', () => {
    const createMonster = (overrides = {}) => ({
        index: 'dragon',
        name: 'Dragon',
        lair_actions: {
            summary: 'Starting when the dragon enters a lair',
            actions: [
                 'A dim light fills the lair.',
                 'The dragon knows intruder location.',
              ],
            usage: 'These actions can only be used in the dragon lair.',
          },
          ...overrides,
      });

    beforeEach(() => {
        vi.clearAllMocks();
      });

    it('returns null when monster is not provided', () => {
        const { container } = render(<MonsterLairActions monster={null} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when monster is undefined', () => {
        const { container } = render(<MonsterLairActions monster={undefined} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when monster has no lair_actions', () => {
        const { container } = render(<MonsterLairActions monster={{ index: 'test' }} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when lair_actions is null', () => {
        const { container } = render(<MonsterLairActions monster={{ index: 'test', lair_actions: null }} />);
        expect(container.firstChild).toBeNull();
      });

    it('returns null when lair_actions is undefined', () => {
        const { container } = render(<MonsterLairActions monster={{ index: 'test', lair_actions: undefined }} />);
        expect(container.firstChild).toBeNull();
      });

    it('renders summary via dangerouslySetInnerHTML', () => {
        render(<MonsterLairActions monster={createMonster()} />);
        expect(renderHtmlContent).toHaveBeenCalledWith('Starting when the dragon enters a lair');
      });

    it('renders each lair action as a list item', () => {
        render(<MonsterLairActions monster={createMonster()} />);
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
      });

    it('renders action text via dangerouslySetInnerHTML', () => {
        render(<MonsterLairActions monster={createMonster()} />);
        expect(renderHtmlContent).toHaveBeenCalledWith('A dim light fills the lair.');
        expect(renderHtmlContent).toHaveBeenCalledWith('The dragon knows intruder location.');
      });

    it('renders usage when present', () => {
        render(<MonsterLairActions monster={createMonster()} />);
        expect(renderHtmlContent).toHaveBeenCalledWith('These actions can only be used in the dragon lair.');
      });

    it('does not render usage when not present', () => {
        render(
             <MonsterLairActions
                monster={createMonster({
                    lair_actions: {
                        summary: 'Test summary',
                        actions: ['Action 1'],
                        usage: null,
                      },
                  })}
             />
         );
        expect(screen.queryByText('These actions can only be used in the dragon lair.')).not.toBeInTheDocument();
      });

    it('does not render usage when undefined', () => {
        render(
             <MonsterLairActions
                monster={createMonster({
                    lair_actions: {
                        summary: 'Test summary',
                        actions: ['Action 1'],
                        usage: undefined,
                      },
                  })}
             />
         );
        const { container } = render(
             <MonsterLairActions
                monster={createMonster({
                    lair_actions: { summary: 'Test', actions: ['Action 1'], usage: undefined },
                  })}
             />
         );
        expect(container.querySelector('ul')).toBeInTheDocument();
      });

    it('renders empty actions array as empty list', () => {
        const { container } = render(
             <MonsterLairActions
                monster={createMonster({
                    lair_actions: {
                        summary: 'Test summary',
                        actions: [],
                        usage: 'Usage text',
                      },
                  })}
             />
         );
        expect(container.querySelector('ul')).toBeInTheDocument();
        expect(container.querySelectorAll('li')).toHaveLength(0);
      });

    it('renders single action', () => {
        render(
             <MonsterLairActions
                monster={createMonster({
                    lair_actions: {
                        summary: 'Test',
                        actions: ['Single action'],
                      },
                  })}
             />
         );
        expect(screen.getAllByRole('listitem')).toHaveLength(1);
      });

    it('renders without usage when usage is empty string', () => {
        const { container } = render(
             <MonsterLairActions
                monster={createMonster({
                    lair_actions: {
                        summary: 'Test',
                        actions: ['Action 1'],
                        usage: '',
                      },
                  })}
             />
         );
        expect(container.querySelector('ul')).toBeInTheDocument();
      });

    it('calls renderHtmlContent for summary and each action', () => {
        render(<MonsterLairActions monster={createMonster()} />);
        expect(renderHtmlContent).toHaveBeenCalledTimes(4);
      });

    it('renders wrapper div structure', () => {
        const { container } = render(<MonsterLairActions monster={createMonster()} />);
        expect(container.querySelector('div > div')).toBeInTheDocument();
        expect(container.querySelector('br')).toBeInTheDocument();
        expect(container.querySelector('ul')).toBeInTheDocument();
      });
});
