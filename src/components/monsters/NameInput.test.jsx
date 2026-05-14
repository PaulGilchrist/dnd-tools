import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NameInput from './NameInput';

describe('NameInput', () => {
    const defaultProps = {
        filter: { name: '' },
        updateFilter: vi.fn(),
     };

    beforeEach(() => {
        vi.clearAllMocks();
     });

    it('renders the name label', () => {
        render(<NameInput {...defaultProps} />);
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
     });

    it('renders the name input with id', () => {
        render(<NameInput {...defaultProps} />);
        expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'name');
     });

    it('renders the name input with name attribute', () => {
        render(<NameInput {...defaultProps} />);
        expect(screen.getByLabelText('Name')).toHaveAttribute('name', 'name');
     });

    it('renders the name input with maxLength 50', () => {
        render(<NameInput {...defaultProps} />);
        expect(screen.getByLabelText('Name')).toHaveAttribute('maxlength', '50');
     });

    it('renders the name input with correct pattern', () => {
        render(<NameInput {...defaultProps} />);
        expect(screen.getByLabelText('Name')).toHaveAttribute('pattern', '[A-Za-z ]+');
     });

    it('renders input with filter name value', () => {
        render(<NameInput {...{ ...defaultProps, filter: { name: 'goblin' } }} />);
        expect(screen.getByDisplayValue('goblin')).toBeInTheDocument();
     });

    it('calls updateFilter when name changes under 50 chars', () => {
        render(<NameInput {...defaultProps} />);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'orc' } });
        expect(defaultProps.updateFilter).toHaveBeenCalledWith('name', 'orc');
     });

    it('updates local value on input change', () => {
        render(<NameInput {...defaultProps} />);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'dragon' } });
        expect(defaultProps.updateFilter).toHaveBeenCalledWith('name', 'dragon');
      });

    it('does not call updateFilter when name reaches 50 characters', () => {
        render(<NameInput {...defaultProps} />);
        const longName = 'a'.repeat(50);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: longName } });
        expect(defaultProps.updateFilter).not.toHaveBeenCalled();
     });

    it('shows validation error when name has 50 or more characters', () => {
        render(<NameInput {...{ ...defaultProps, filter: { name: 'a'.repeat(50) } }} />);
        expect(screen.getByText('Name should be less than 50 characters')).toBeInTheDocument();
     });

    it('adds invalid class when name has 50 or more characters', () => {
        const { container } = render(
            <NameInput {...{ ...defaultProps, filter: { name: 'a'.repeat(50) } }} />
        );
        expect(container.querySelector('.has-error.invalid')).toBeInTheDocument();
     });

    it('does not show validation error when name is less than 50 characters', () => {
        render(<NameInput {...defaultProps} />);
        expect(screen.queryByText('Name should be less than 50 characters')).not.toBeInTheDocument();
     });

    it('does not add invalid class when name is less than 50 characters', () => {
        const { container } = render(<NameInput {...defaultProps} />);
        expect(container.querySelector('.has-error.invalid')).not.toBeInTheDocument();
     });

    it('synchronizes local value when filter.name prop changes', () => {
        const { rerender } = render(<NameInput {...defaultProps} />);
        rerender(<NameInput {...{ ...defaultProps, filter: { name: 'updated' } }} />);
        expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
     });

    it('handles clearing the name field', () => {
        render(<NameInput {...{ ...defaultProps, filter: { name: 'initial' } }} />);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: '' } });
        expect(defaultProps.updateFilter).toHaveBeenCalledWith('name', '');
     });

    it('renders form-control class on input', () => {
        render(<NameInput {...defaultProps} />);
        expect(screen.getByLabelText('Name')).toHaveClass('form-control');
     });

    it('renders has-error div wrapper', () => {
        const { container } = render(<NameInput {...defaultProps} />);
        expect(container.querySelector('.has-error')).toBeInTheDocument();
     });

    it('does not call updateFilter for names over 49 characters', () => {
        render(<NameInput {...defaultProps} />);
        const overLimit = 'a'.repeat(55);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: overLimit } });
        expect(defaultProps.updateFilter).not.toHaveBeenCalled();
     });

    it('calls updateFilter for name at 49 characters', () => {
        render(<NameInput {...defaultProps} />);
        const underLimit = 'a'.repeat(49);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: underLimit } });
        expect(defaultProps.updateFilter).toHaveBeenCalledWith('name', underLimit);
     });

    it('renders col-form-label class on label', () => {
        const { container } = render(<NameInput {...defaultProps} />);
        expect(container.querySelector('label')).toHaveClass('col-form-label');
     });
});
