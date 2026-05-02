import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollIntoView } from './utils';

describe('scrollIntoView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('scrolls element into view with correct offset', () => {
    const cardElement = document.createElement('div');
    cardElement.id = 'card-0';
    document.body.appendChild(cardElement);

    const rect = { top: 200, left: 0, width: 100, height: 100 };
    vi.spyOn(cardElement, 'getBoundingClientRect').mockReturnValue(rect);
    vi.spyOn(window, 'scrollTo');

    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
    });

    scrollIntoView('card-0');
    vi.runAllTimers();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 200 - 61,
      behavior: 'smooth',
    });
  });

  it('applies navbar offset of 61px from current scroll position', () => {
    const cardElement = document.createElement('div');
    cardElement.id = 'test-card';
    document.body.appendChild(cardElement);

    const rect = { top: 300, left: 0, width: 100, height: 100 };
    vi.spyOn(cardElement, 'getBoundingClientRect').mockReturnValue(rect);
    vi.spyOn(window, 'scrollTo');

    Object.defineProperty(window, 'pageYOffset', {
      value: 100,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 100,
      writable: true,
    });

    scrollIntoView('test-card');
    vi.runAllTimers();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 100 + 300 - 61,
      behavior: 'smooth',
    });
  });

  it('does nothing when element is not found', () => {
    vi.spyOn(window, 'scrollTo');

    scrollIntoView('nonexistent');
    vi.runAllTimers();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('waits 300ms before scrolling', () => {
    const cardElement = document.createElement('div');
    cardElement.id = 'delayed-card';
    document.body.appendChild(cardElement);

    const rect = { top: 150, left: 0, width: 100, height: 100 };
    vi.spyOn(cardElement, 'getBoundingClientRect').mockReturnValue(rect);
    vi.spyOn(window, 'scrollTo');

    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });

    scrollIntoView('delayed-card');

    expect(window.scrollTo).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(window.scrollTo).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('uses documentElement.scrollTop as fallback when pageYOffset is undefined', () => {
    const cardElement = document.createElement('div');
    cardElement.id = 'fallback-card';
    document.body.appendChild(cardElement);

    const rect = { top: 500, left: 0, width: 100, height: 100 };
    vi.spyOn(cardElement, 'getBoundingClientRect').mockReturnValue(rect);
    vi.spyOn(window, 'scrollTo');

    Object.defineProperty(window, 'pageYOffset', {
      value: undefined,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 200,
      writable: true,
    });

    scrollIntoView('fallback-card');
    vi.runAllTimers();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 200 + 500 - 61,
      behavior: 'smooth',
    });
  });

  it('handles multiple sequential calls independently', () => {
    const card1 = document.createElement('div');
    card1.id = 'card-a';
    document.body.appendChild(card1);

    const card2 = document.createElement('div');
    card2.id = 'card-b';
    document.body.appendChild(card2);

    const rect1 = { top: 100, left: 0, width: 100, height: 100 };
    const rect2 = { top: 300, left: 0, width: 100, height: 100 };
    vi.spyOn(card1, 'getBoundingClientRect').mockReturnValue(rect1);
    vi.spyOn(card2, 'getBoundingClientRect').mockReturnValue(rect2);
    vi.spyOn(window, 'scrollTo');

    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
    });

    scrollIntoView('card-a');
    scrollIntoView('card-b');
    vi.runAllTimers();

    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });

  it('does not call getBoundingClientRect when element is missing', () => {
    const getBoundingRectSpy = vi.spyOn(
      Object.getPrototypeOf(document.createElement('div')),
      'getBoundingClientRect'
    );

    scrollIntoView('missing');
    vi.runAllTimers();

    expect(getBoundingRectSpy).not.toHaveBeenCalled();
  });

  it('handles empty string index', () => {
    vi.spyOn(window, 'scrollTo');

    scrollIntoView('');
    vi.runAllTimers();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('handles null index', () => {
    vi.spyOn(window, 'scrollTo');

    scrollIntoView(null);
    vi.runAllTimers();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('handles undefined index', () => {
    vi.spyOn(window, 'scrollTo');

    scrollIntoView(undefined);
    vi.runAllTimers();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('handles element at top of viewport (rect.top is 0)', () => {
    const cardElement = document.createElement('div');
    cardElement.id = 'top-card';
    document.body.appendChild(cardElement);

    const rect = { top: 0, left: 0, width: 100, height: 100 };
    vi.spyOn(cardElement, 'getBoundingClientRect').mockReturnValue(rect);
    vi.spyOn(window, 'scrollTo');

    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });

    scrollIntoView('top-card');
    vi.runAllTimers();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0 - 61,
      behavior: 'smooth',
    });
  });

  it('handles element below current viewport', () => {
    const cardElement = document.createElement('div');
    cardElement.id = 'below-card';
    document.body.appendChild(cardElement);

    const rect = { top: 800, left: 0, width: 100, height: 100 };
    vi.spyOn(cardElement, 'getBoundingClientRect').mockReturnValue(rect);
    vi.spyOn(window, 'scrollTo');

    Object.defineProperty(window, 'pageYOffset', {
      value: 500,
      writable: true,
    });

    scrollIntoView('below-card');
    vi.runAllTimers();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 500 + 800 - 61,
      behavior: 'smooth',
    });
  });
});
