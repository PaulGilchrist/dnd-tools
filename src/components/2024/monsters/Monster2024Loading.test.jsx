import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Monster2024Loading from './Monster2024Loading';

describe('Monster2024Loading', () => {
    it('renders the loading container', () => {
        render(<Monster2024Loading />);
        const container = document.querySelector('.list');
        expect(container).toBeInTheDocument();
    });

    it('renders the spinner element', () => {
        render(<Monster2024Loading />);
        const spinner = document.querySelector('.spinner-border');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveAttribute('role', 'status');
    });

    it('renders the loading text', () => {
        render(<Monster2024Loading />);
        expect(screen.getByText('Loading 2024 monsters...')).toBeInTheDocument();
    });

    it('has visually-hidden span for accessibility', () => {
        render(<Monster2024Loading />);
        expect(screen.getByText('Loading...')).toHaveClass('visually-hidden');
    });
});
