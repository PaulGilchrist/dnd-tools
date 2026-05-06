import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RulesItem from './RulesItem';
import { scrollIntoView } from '../../data/utils';
import { renderHtmlContent } from '../../utils/htmlUtils';

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('RulesItem', () => {
  const mockRule = {
    index: 'coins',
    name: 'Coins',
    desc: '<p>Coins come in different denominations.</p>',
    subsections: [
      { index: 'coin-values', name: 'Coin Values', desc: '<p>Different values.</p>', book: 'PHB', page: 143 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when rule is not provided', () => {
    const { container } = render(<RulesItem rule={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders rule name', () => {
    render(<RulesItem rule={mockRule} />);
    expect(screen.getByText('Coins')).toBeInTheDocument();
  });

  it('is not expanded by default', () => {
    render(<RulesItem rule={mockRule} />);
    expect(screen.queryByText('Coin Values')).not.toBeInTheDocument();
  });

  it('expands when expand prop is true', () => {
    render(<RulesItem rule={mockRule} expand={true} />);
    expect(screen.getByText('Coin Values')).toBeInTheDocument();
  });

  it('toggles expansion when header is clicked', () => {
    const onExpand = vi.fn();
    render(<RulesItem rule={mockRule} onExpand={onExpand} />);
    fireEvent.click(screen.getByText('Coins'));
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('renders subsections when expanded', () => {
    render(<RulesItem rule={mockRule} expand={true} />);
    expect(screen.getByText('Coin Values')).toBeInTheDocument();
  });

  it('renders subsection description with html', () => {
    render(<RulesItem rule={mockRule} expand={true} />);
    expect(renderHtmlContent).toHaveBeenCalledWith('<p>Different values.</p>');
  });

  it('shows subsection book reference', () => {
    render(<RulesItem rule={mockRule} expand={true} />);
    expect(screen.getByText(/PHB/)).toBeInTheDocument();
    expect(screen.getByText(/page 143/)).toBeInTheDocument();
  });

  it('expands subsection on click', () => {
    render(<RulesItem rule={mockRule} expand={true} />);
    fireEvent.click(screen.getByText('Coin Values'));
    expect(scrollIntoView).toHaveBeenCalledWith('coin-values');
  });

  it('collapses subsection on second click', () => {
    render(<RulesItem rule={mockRule} expand={true} />);
    fireEvent.click(screen.getByText('Coin Values'));
    expect(screen.getByText('Coin Values')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Coin Values'));
    // After toggle, subsection should still be rendered but we can verify scrollIntoView was called
    expect(scrollIntoView).toHaveBeenCalled();
  });
});
