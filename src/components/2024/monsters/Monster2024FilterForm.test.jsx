import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Monster2024FilterForm from './Monster2024FilterForm';

describe('Monster2024FilterForm', () => {
    it('renders the form with filter-form class', () => {
        render(
            <Monster2024FilterForm>
                <div data-testid="child">Child content</div>
            </Monster2024FilterForm>
        );
        const form = document.querySelector('.filter-form');
        expect(form).toBeInTheDocument();
    });

    it('renders children inside the form', () => {
        render(
            <Monster2024FilterForm>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </Monster2024FilterForm>
        );
        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('renders empty form when no children provided', () => {
        render(<Monster2024FilterForm />);
        const form = document.querySelector('.filter-form');
        expect(form).toBeInTheDocument();
        expect(form.children).toHaveLength(0);
    });
});
