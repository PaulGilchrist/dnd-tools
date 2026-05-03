import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { scrollIntoView } from './utils';

describe('scrollIntoView', () => {
   let originalScrollTo;
   let originalGetElementById;

   beforeEach(() => {
      originalScrollTo = window.scrollTo;
      originalGetElementById = document.getElementById;
      window.scrollTo = vi.fn();
      document.getElementById = vi.fn();
      vi.useFakeTimers();
   });

   afterEach(() => {
      window.scrollTo = originalScrollTo;
      document.getElementById = originalGetElementById;
      vi.useRealTimers();
   });

   it('does nothing when element is not found', () => {
      document.getElementById.mockReturnValue(null);
      scrollIntoView('test-index');
      vi.advanceTimersByTime(300);
      expect(window.scrollTo).not.toHaveBeenCalled();
   });

   it('scrolls to element when found', () => {
      const mockElement = {
         getBoundingClientRect: () => ({ top: 100 }),
      };
      document.getElementById.mockReturnValue(mockElement);
      Object.defineProperty(window, 'pageYOffset', { value: 50, writable: true });

      scrollIntoView('test-index');
      vi.advanceTimersByTime(300);

      expect(window.scrollTo).toHaveBeenCalledWith({
         top: 89, // 50 + 100 - 61 (navbar offset)
         behavior: 'smooth',
      });
   });
});
