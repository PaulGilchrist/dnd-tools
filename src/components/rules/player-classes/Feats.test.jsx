import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Feats from './Feats';

describe('Feats', () => {
    it('returns null when level is not provided', () => {
        const { container } = render(<Feats level={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when level is 0', () => {
        const { container } = render(<Feats level={0} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when level is less than 4', () => {
        const { container } = render(<Feats level={3} />);
        expect(container.firstChild).toBeNull();
    });

    it('displays 1 feat at level 4', () => {
        render(<Feats level={4} />);
        expect(screen.getByText(/Feats/)).toBeInTheDocument();
        expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('displays 2 feats at level 8', () => {
        render(<Feats level={8} />);
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays 3 feats at level 12', () => {
        render(<Feats level={12} />);
        expect(screen.getByText(/3/)).toBeInTheDocument();
    });

    it('displays 4 feats at level 16', () => {
        render(<Feats level={16} />);
        expect(screen.getByText(/4/)).toBeInTheDocument();
    });

    it('displays 5 feats at level 20', () => {
        render(<Feats level={20} />);
        expect(screen.getByText(/5/)).toBeInTheDocument();
    });
});
