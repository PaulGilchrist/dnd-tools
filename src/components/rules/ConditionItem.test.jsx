import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConditionItem from './ConditionItem';
import { renderHtmlContent } from '../../utils/htmlUtils';

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('ConditionItem', () => {
  const mockCondition = {
    index: 'blinded',
    name: 'Blinded',
    desc: '<p>A blinded creature cannot see.</p>',
  };

  it('returns null when condition is not provided', () => {
    const { container } = render(<ConditionItem condition={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders condition name', () => {
    render(<ConditionItem condition={mockCondition} />);
    expect(screen.getByText('Blinded')).toBeInTheDocument();
  });

  it('is not expanded by default', () => {
    render(<ConditionItem condition={mockCondition} />);
    expect(screen.queryByText('A blinded creature cannot see.')).not.toBeInTheDocument();
  });

  it('expands when expand prop is true', () => {
    render(<ConditionItem condition={mockCondition} expand={true} />);
    expect(screen.getByText('A blinded creature cannot see.')).toBeInTheDocument();
  });

  it('toggles expansion when header is clicked', () => {
    const onExpand = vi.fn();
    render(<ConditionItem condition={mockCondition} onExpand={onExpand} />);
    fireEvent.click(screen.getByText('Blinded'));
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('collapses when clicked again', () => {
    const onExpand = vi.fn();
    render(<ConditionItem condition={mockCondition} expand={true} onExpand={onExpand} />);
    fireEvent.click(screen.getByText('Blinded'));
    expect(onExpand).toHaveBeenCalledWith(false);
  });

  it('renders description html content', () => {
    render(<ConditionItem condition={mockCondition} expand={true} />);
    expect(renderHtmlContent).toHaveBeenCalledWith('<p>A blinded creature cannot see.</p>');
  });

  it('handles condition without desc', () => {
    const conditionNoDesc = { index: 'charmed', name: 'Charmed' };
    render(<ConditionItem condition={conditionNoDesc} expand={true} />);
    expect(screen.getByText('Charmed')).toBeInTheDocument();
  });
});
