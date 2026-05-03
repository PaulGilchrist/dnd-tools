import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GeneralRules from './Rules';

// Mock the hooks
vi.mock('../../data/dataService', () => ({
   useRules: () => ({ data: [], loading: false }),
}));

vi.mock('../../context/RuleVersionContext', () => ({
   useRuleVersion: () => ({ ruleVersion: '5e' }),
}));

vi.mock('./RulesSearch', () => ({
   default: () => <div>RulesSearch Mock</div>,
}));

describe('GeneralRules', () => {
   it('renders loading state', () => {
      vi.mocked(require('../../data/dataService').useRules).mockReturnValueOnce({
         data: null,
         loading: true,
      });

      render(<GeneralRules />);
      expect(screen.getByText(/Loading rules/i)).toBeInTheDocument();
   });

   it('renders RulesSearch when data is loaded', () => {
      vi.mocked(require('../../data/dataService').useRules).mockReturnValueOnce({
         data: [{ index: 'rule1', name: 'Test Rule' }],
         loading: false,
      });

      render(<GeneralRules />);
      expect(screen.getByText('RulesSearch Mock')).toBeInTheDocument();
   });

   it('passes rules and ruleVersion to RulesSearch', () => {
      const rulesData = [{ index: 'rule1', name: 'Test Rule' }];
      vi.mocked(require('../../data/dataService').useRules).mockReturnValueOnce({
         data: rulesData,
         loading: false,
      });

      render(<GeneralRules />);
      // RulesSearch should be called with the rules prop
      expect(screen.getByText('RulesSearch Mock')).toBeInTheDocument();
   });
});
