import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
    it('renders loading text', () => {
        render(<Loading />);
        expect(screen.getByText('Loading monsters...')).toBeInTheDocument();
     });

    it('renders outer div with list class', () => {
        const { container } = render(<Loading />);
        expect(container.querySelector('div.list')).toBeInTheDocument();
     });

    it('renders inner div inside list', () => {
        const { container } = render(<Loading />);
        expect(container.querySelectorAll('div')).toHaveLength(2);
     });
});
