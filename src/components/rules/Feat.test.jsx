import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Feat from './Feat';

describe('Feat', () => {
  const mockFeat = {
    index: 'alert',
    name: 'Alert',
    desc: ['You are never surprised while you are conscious.'],
    prerequisite: 'Dexterity 13 or higher',
    benefits: ['You gain a +5 bonus to initiative.'],
  };

  it('returns null when feat is not provided', () => {
    const { container } = render(<Feat feat={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders feat name', () => {
    render(<Feat feat={mockFeat} />);
    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('is not expanded by default', () => {
    render(<Feat feat={mockFeat} />);
    expect(screen.queryByText('You are never surprised while you are conscious.')).not.toBeInTheDocument();
  });

  it('expands when expand prop is true', () => {
    render(<Feat feat={mockFeat} expand={true} />);
    expect(screen.getByText('You are never surprised while you are conscious.')).toBeInTheDocument();
  });

  it('toggles expansion when header is clicked', () => {
    const onExpand = vi.fn();
    render(<Feat feat={mockFeat} onExpand={onExpand} />);
    fireEvent.click(screen.getByText('Alert'));
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('displays prerequisite when provided', () => {
    render(<Feat feat={mockFeat} expand={true} />);
    expect(screen.getByText(/Prerequisite/)).toBeInTheDocument();
    expect(screen.getByText(/Dexterity 13 or higher/)).toBeInTheDocument();
  });

  it('does not display prerequisite when not provided', () => {
    const featNoPrereq = { ...mockFeat, prerequisite: undefined };
    render(<Feat feat={featNoPrereq} expand={true} />);
    expect(screen.queryByText(/Prerequisite/)).not.toBeInTheDocument();
  });

  it('displays benefits when provided', () => {
    render(<Feat feat={mockFeat} expand={true} />);
    expect(screen.getByText('You gain a +5 bonus to initiative.')).toBeInTheDocument();
  });

  it('renders multiple description paragraphs', () => {
    const featMultiDesc = {
      ...mockFeat,
      desc: ['First paragraph.', 'Second paragraph.'],
    };
    render(<Feat feat={featMultiDesc} expand={true} />);
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
  });
});
