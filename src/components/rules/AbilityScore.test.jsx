import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AbilityScore from './AbilityScore';
import { renderHtmlContent } from '../../utils/htmlUtils';

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('AbilityScore', () => {
  const mockAbilityScore = {
    index: 'str',
    full_name: 'Strength',
    desc: '<p>Strength measures bodily power.</p>',
    skills: ['Athletics'],
  };

  it('returns null when abilityScore is not provided', () => {
    const { container } = render(<AbilityScore abilityScore={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders ability score name', () => {
    render(<AbilityScore abilityScore={mockAbilityScore} />);
    expect(screen.getByText('Strength')).toBeInTheDocument();
  });

  it('displays skills when available', () => {
    render(<AbilityScore abilityScore={mockAbilityScore} />);
    expect(screen.getByText(/Athletics/)).toBeInTheDocument();
  });

  it('does not display skills section when no skills', () => {
    const abilityScoreNoSkills = { ...mockAbilityScore, skills: [] };
    render(<AbilityScore abilityScore={abilityScoreNoSkills} />);
    expect(screen.queryByText(/Athletics/)).not.toBeInTheDocument();
  });

  it('is not expanded by default', () => {
    render(<AbilityScore abilityScore={mockAbilityScore} />);
    expect(screen.queryByText('Strength measures bodily power.')).not.toBeInTheDocument();
  });

  it('expands when expand prop is true', () => {
    render(<AbilityScore abilityScore={mockAbilityScore} expand={true} />);
    expect(screen.getByText('Strength measures bodily power.')).toBeInTheDocument();
  });

  it('calls onExpand when header is clicked', () => {
    const onExpand = vi.fn();
    render(<AbilityScore abilityScore={mockAbilityScore} onExpand={onExpand} />);
    fireEvent.click(screen.getByText('Strength'));
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('renders description with html content', () => {
    render(<AbilityScore abilityScore={mockAbilityScore} expand={true} />);
    expect(renderHtmlContent).toHaveBeenCalledWith('<p>Strength measures bodily power.</p>');
  });
});
