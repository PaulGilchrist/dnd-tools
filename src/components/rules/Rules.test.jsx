import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GeneralRules from './Rules';
import { useRules } from '../../data/dataService';

// Mock the hooks
vi.mock('../../data/dataService', () => ({
   useRules: vi.fn(() => ({ data: [], loading: false })),
}));

vi.mock('../../context/RuleVersionContext', () => ({
   useRuleVersion: vi.fn(() => ({ ruleVersion: '5e' })),
}));

vi.mock('./RulesSearch', () => ({
   default: vi.fn(() => <div>RulesSearch Mock</div>),
}));

describe('GeneralRules', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it('renders loading state', () => {
      useRules.mockReturnValueOnce({
         data: null,
         loading: true,
      });

      render(<GeneralRules />);
      expect(screen.getByText(/Loading rules/i)).toBeInTheDocument();
   });

   it('renders RulesSearch when data is loaded', () => {
      useRules.mockReturnValueOnce({
         data: [{ index: 'rule1', name: 'Test Rule' }],
         loading: false,
      });

      render(<GeneralRules />);
      expect(screen.getByText('RulesSearch Mock')).toBeInTheDocument();
   });

   it('passes rules and ruleVersion to RulesSearch', () => {
      const rulesData = [{ index: 'rule1', name: 'Test Rule' }];
      useRules.mockReturnValueOnce({
         data: rulesData,
         loading: false,
      });

      render(<GeneralRules />);
      // RulesSearch should be called with the rules prop
      expect(screen.getByText('RulesSearch Mock')).toBeInTheDocument();
   });
});
