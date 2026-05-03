import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sort, handleError, __clearCache } from './dataService';

describe('dataService', () => {
   describe('sort', () => {
      it('sorts array by property name ascending', () => {
         const arr = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
         sort(arr, 'name');
         expect(arr[0].name).toBe('Alice');
         expect(arr[1].name).toBe('Bob');
         expect(arr[2].name).toBe('Charlie');
      });

      it('sorts array by property name descending', () => {
         const arr = [{ name: 'Alice' }, { name: 'Charlie' }, { name: 'Bob' }];
         sort(arr, 'name', true);
         expect(arr[0].name).toBe('Charlie');
         expect(arr[1].name).toBe('Bob');
         expect(arr[2].name).toBe('Alice');
      });

      it('handles null array', () => {
         expect(() => sort(null, 'name')).not.toThrow();
      });

      it('handles missing property name', () => {
         const arr = [{ name: 'Alice' }];
         expect(() => sort(arr, null)).not.toThrow();
      });

      it('handles numeric properties', () => {
         const arr = [{ level: 3 }, { level: 1 }, { level: 2 }];
         sort(arr, 'level');
         expect(arr[0].level).toBe(1);
         expect(arr[1].level).toBe(2);
         expect(arr[2].level).toBe(3);
      });
   });

   describe('handleError', () => {
      it('throws the error passed to it', () => {
         const error = new Error('Test error');
         expect(() => handleError(error)).toThrow('Test error');
      });

      it('logs error to console', () => {
         const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
         const error = new Error('Test error');
         try {
            handleError(error);
         } catch (e) {
            // Expected to throw
         }
         expect(consoleSpy).toHaveBeenCalledWith(error);
         consoleSpy.mockRestore();
      });
   });
});
