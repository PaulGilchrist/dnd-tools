import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterForm from './FilterForm';

describe('FilterForm', () => {
    it('renders a form element', () => {
        const { container } = render(<FilterForm />);
        expect(container.querySelector('form')).toBeInTheDocument();
     });

    it('renders with filter-form class', () => {
        const { container } = render(<FilterForm />);
        expect(container.querySelector('form')).toHaveClass('filter-form');
     });

    it('renders children inside the form', () => {
        render(
            <FilterForm>
                <div data-testid="child">Test Child</div>
            </FilterForm>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
     });

    it('renders multiple children', () => {
        render(
            <FilterForm>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </FilterForm>
        );
        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
     });

    it('renders nothing as children when given empty', () => {
        const { container } = render(<FilterForm />);
        const form = container.querySelector('form');
        expect(form.children.length).toBe(0);
     });

    it('renders null children without errors', () => {
        const { container } = render(
            <FilterForm>
                {null}
            </FilterForm>
        );
        expect(container.querySelector('form')).toBeInTheDocument();
     });

    it('renders form when children is undefined', () => {
        const { container } = render(
            <FilterForm>
                {undefined}
            </FilterForm>
        );
        expect(container.querySelector('form')).toBeInTheDocument();
     });

    it('renders filter controls as children', () => {
        render(
            <FilterForm>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" />
            </FilterForm>
        );
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
     });
});
