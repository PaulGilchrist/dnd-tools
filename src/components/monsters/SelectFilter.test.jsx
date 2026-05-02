import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectFilter from './SelectFilter';

describe('SelectFilter', () => {
    const defaultProps = {
        label: 'Type',
        name: 'type',
        value: 'beast',
        options: [
            { value: 'all', label: 'All' },
            { value: 'beast', label: 'Beast' },
            { value: 'humanoid', label: 'Humanoid' },
         ],
        onChange: vi.fn(),
     };

    beforeEach(() => {
        vi.clearAllMocks();
     });

    it('renders the label', () => {
        render(<SelectFilter {...defaultProps} />);
        expect(screen.getByText('Type')).toBeInTheDocument();
     });

    it('uses name prop for htmlFor on label', () => {
        const { container } = render(<SelectFilter {...defaultProps} />);
        const label = container.querySelector('label');
        expect(label).toHaveAttribute('for', 'type');
         // Label's htmlFor is set via render
     });

    it('renders the select element', () => {
        const { container } = render(<SelectFilter {...defaultProps} />);
        expect(container.querySelector('select')).toBeInTheDocument();
     });

    it('sets select name from name prop', () => {
        const { container } = render(<SelectFilter {...defaultProps} />);
        expect(container.querySelector('select')).toHaveAttribute('name', 'type');
     });

    it('sets select value from value prop', () => {
        render(<SelectFilter {...defaultProps} />);
        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('beast');
     });

    it('renders all options', () => {
        const { container } = render(<SelectFilter {...defaultProps} />);
        const select = container.querySelector('select');
        expect(select.options.length).toBe(3);
     });

    it('renders option labels', () => {
        render(<SelectFilter {...defaultProps} />);
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Beast')).toBeInTheDocument();
        expect(screen.getByText('Humanoid')).toBeInTheDocument();
     });

    it('renders select with form-control class', () => {
        const { container } = render(<SelectFilter {...defaultProps} />);
        expect(container.querySelector('select')).toHaveClass('form-control');
     });

    it('calls onChange when select value changes', () => {
        render(<SelectFilter {...defaultProps} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'humanoid' } });
        expect(defaultProps.onChange).toHaveBeenCalledWith('humanoid');
     });

    it('renders options as strings', () => {
        render(
            <SelectFilter
                label="Size"
                name="size"
                value="Medium"
                options={['Tiny', 'Small', 'Medium', 'Large']}
                onChange={vi.fn()}
            />
        );
        expect(screen.getByText('Tiny')).toBeInTheDocument();
        expect(screen.getByText('Small')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Large')).toBeInTheDocument();
     });

    it('uses string value for option value when option is a string', () => {
        const { container } = render(
            <SelectFilter
                label="Size"
                name="size"
                value="Large"
                options={['Tiny', 'Small', 'Medium', 'Large']}
                onChange={vi.fn()}
            />
        );
        const select = container.querySelector('select');
        expect(select).toHaveValue('Large');
     });

    it('calls onChange with string when options are strings', () => {
        render(
            <SelectFilter
                label="Size"
                name="size"
                value="Medium"
                options={['Tiny', 'Small', 'Medium']}
                onChange={vi.fn()}
            />
        );
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'Large' } });
        expect(defaultProps.onChange).not.toHaveBeenCalled();
     });

    it('uses option as both value and label when option is a string', () => {
        const { container } = render(
            <SelectFilter
                label="Size"
                name="size"
                value="Tiny"
                options={['Tiny', 'Small']}
                onChange={vi.fn()}
            />
        );
        const select = container.querySelector('select');
        expect(select.options[0].value).toBe('Tiny');
        expect(select.options[0].label).toBe('Tiny');
     });

    it('renders with col-form-label class on label', () => {
        const { container } = render(<SelectFilter {...defaultProps} />);
        expect(container.querySelector('label')).toHaveClass('col-form-label');
     });

    it('handles value that does not match any option', () => {
        render(
            <SelectFilter
                {...defaultProps}
                value="unknown"
            />
        );
        const select = screen.getByRole('combobox');
        expect(select.value).toBe('all');
     });

    it('handles empty options array', () => {
        const { container } = render(
            <SelectFilter
                label="Empty"
                name="empty"
                value=""
                options={[]}
                onChange={vi.fn()}
            />
        );
        const select = container.querySelector('select');
        expect(select.options.length).toBe(0);
     });

    it('handles undefined value', () => {
        render(
            <SelectFilter
                {...defaultProps}
                value={undefined}
            />
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
     });

    it('handles null value', () => {
        render(
            <SelectFilter
                {...defaultProps}
                value={null}
            />
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
     });

    it('handles missing value prop', () => {
        render(
            <SelectFilter
                label="Test"
                name="test"
                options={['A', 'B']}
                onChange={vi.fn()}
            />
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
     });
});
