import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { RuleVersionProvider, useRuleVersion } from './RuleVersionContext';

// Mock localStorage
const mockGetLocalStorageString = vi.fn(() => null);
const mockSetLocalStorageString = vi.fn();

vi.mock('../utils/localStorage', () => ({
   LOCAL_STORAGE_KEYS: {
      RULE_VERSION: 'ruleVersion',
   },
   getLocalStorageString: () => mockGetLocalStorageString(),
   setLocalStorageString: (...args) => mockSetLocalStorageString(...args),
}));

describe('RuleVersionContext', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   describe('RuleVersionProvider', () => {
       it('provides default rule version of 5e', () => {
          const { result } = renderHook(() => useRuleVersion(), {
             wrapper: RuleVersionProvider,
          });

          expect(result.current.ruleVersion).toBe('5e');
       });

       it('loads rule version from localStorage', () => {
          mockGetLocalStorageString.mockReturnValue('2024');

          const { result } = renderHook(() => useRuleVersion(), {
             wrapper: RuleVersionProvider,
          });

          expect(result.current.ruleVersion).toBe('2024');
       });

       it('updates rule version and saves to localStorage', () => {
          const { result } = renderHook(() => useRuleVersion(), {
             wrapper: RuleVersionProvider,
          });

          result.current.setRuleVersion('2024');

          expect(result.current.ruleVersion).toBe('2024');
         expect(mockSetLocalStorageString).toHaveBeenCalledWith('ruleVersion', '2024');
       });
   });

   describe('useRuleVersion', () => {
      it('throws error when used outside provider', () => {
         // Suppress console.error for this test
         const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

         expect(() => {
            renderHook(() => useRuleVersion());
         }).toThrow();

         consoleSpy.mockRestore();
       });

       it('returns context when used within provider', () => {
          const { result } = renderHook(() => useRuleVersion(), {
             wrapper: RuleVersionProvider,
          });

          expect(result.current).toHaveProperty('ruleVersion');
          expect(result.current).toHaveProperty('setRuleVersion');
       });
   });
});
