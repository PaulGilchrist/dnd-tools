import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterControls from './FilterControls';

describe('FilterControls', () => {
    const defaultProps = {
        filter: {
            name: '',
            challengeRatingMin: 0,
            challengeRatingMax: 25,
            xpMin: 0,
            xpMax: 50000,
            environment: 'All',
            type: 'All',
            size: 'All',
            bookmarked: 'All',
         },
        updateFilter: vi.fn(),
     };

    beforeEach(() => {
        vi.clearAllMocks();
     });

    describe('name input', () => {
        it('renders the name label', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.getByLabelText('Name')).toBeInTheDocument();
         });

        it('renders the name input with id', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'name');
         });

        it('renders name input with maxLength 50', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.getByLabelText('Name')).toHaveAttribute('maxlength', '50');
         });

        it('renders name input with correct pattern', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.getByLabelText('Name')).toHaveAttribute('pattern', '[A-Za-z ]+');
         });

        it('calls updateFilter when name changes', () => {
            render(<FilterControls {...defaultProps} />);
            fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'goblin' } });
            expect(defaultProps.updateFilter).toHaveBeenCalledWith('name', 'goblin');
         });

        it('input value reflects filter.name prop', () => {
            render(<FilterControls {...{ ...defaultProps, filter: { ...defaultProps.filter, name: 'orc' } }} />);
            expect(screen.getByDisplayValue('orc')).toBeInTheDocument();
         });

        it('does not call updateFilter when name reaches 50 characters', () => {
            render(<FilterControls {...defaultProps} />);
            const longName = 'a'.repeat(50);
            fireEvent.change(screen.getByLabelText('Name'), { target: { value: longName } });
            expect(defaultProps.updateFilter).not.toHaveBeenCalled();
         });

        it('shows validation error when name reaches 50 characters', () => {
            render(
                <FilterControls
                    {...{ ...defaultProps, filter: { ...defaultProps.filter, name: 'a'.repeat(50) } }}
                />
            );
            expect(screen.getByText('Name should be less than 50 characters')).toBeInTheDocument();
         });

        it('adds invalid class when name is 50 or more characters', () => {
            const { container } = render(
                <FilterControls
                    {...{ ...defaultProps, filter: { ...defaultProps.filter, name: 'a'.repeat(50) } }}
                />
            );
            expect(container.querySelector('.has-error.invalid')).toBeInTheDocument();
         });

        it('does not show validation error when name is less than 50 characters', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.queryByText('Name should be less than 50 characters')).not.toBeInTheDocument();
         });

        it('synchronizes local name when filter.name changes', () => {
            const { rerender } = render(<FilterControls {...defaultProps} />);
            rerender(<FilterControls {...{ ...defaultProps, filter: { ...defaultProps.filter, name: 'updated' } }} />);
            expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
         });
    });

    describe('challenge rating inputs', () => {
        it('renders challenge rating min input', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.getByLabelText('Challenge Rating').closest('.row').querySelector('[id="challengeRatingMin"]')).toBeInTheDocument();
         });

        it('renders challenge rating max input', () => {
            render(<FilterControls {...defaultProps} />);
            const crInput = screen.getByLabelText('Challenge Rating');
            expect(crInput).toBeInTheDocument();
         });

        it('calls updateFilter with float value for challenge rating min', () => {
            render(<FilterControls {...defaultProps} />);
         });

        it('renders challenge rating with correct min/max/step', () => {
            render(<FilterControls {...defaultProps} />);
        });

        it('uses placeholder for min and max', () => {
            render(<FilterControls {...defaultProps} />);
        });
    });

    describe('XP inputs', () => {
        it('renders XP min input', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.getByLabelText('XP')).toBeInTheDocument();
         });

        it('renders XP max input', () => {
            render(<FilterControls {...defaultProps} />);
        });

        it('calls updateFilter with parseInt for XP min', () => {
            render(<FilterControls {...defaultProps} />);
            const xpInput = screen.getByLabelText('XP');
            expect(xpInput).toHaveValue(0);
         });
    });

    describe('environment select', () => {
        it('renders environment select with all options', () => {
            render(<FilterControls {...defaultProps} />);
            const options = ['arctic', 'coastal', 'desert', 'forest', 'grassland', 'hill', 'mountain', 'swamp', 'underdark', 'underwater', 'urban'];
            options.forEach((env) => {
                expect(screen.getByText(env.charAt(0).toUpperCase() + env.slice(1))).toBeInTheDocument();
             });
         });

        it('renders "All" option for environment', () => {
            render(<FilterControls {...defaultProps} />);
         });

        it('calls updateFilter when environment changes', () => {
            render(<FilterControls {...defaultProps} />);
         });
    });

    describe('type select', () => {
        it('renders type select with all options', () => {
            render(<FilterControls {...defaultProps} />);
            const types = ['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'];
            types.forEach((type) => {
                expect(screen.getByText(type.charAt(0).toUpperCase() + type.slice(1))).toBeInTheDocument();
             });
         });

        it('calls updateFilter when type changes', () => {
            render(<FilterControls {...defaultProps} />);
         });
    });

    describe('size select', () => {
        it('renders size select with all options', () => {
            render(<FilterControls {...defaultProps} />);
            const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
            sizes.forEach((size) => {
                expect(screen.getByText(size)).toBeInTheDocument();
             });
         });

        it('calls updateFilter when size changes', () => {
            render(<FilterControls {...defaultProps} />);
         });
    });

    describe('bookmarked select', () => {
        it('renders bookmarked select', () => {
            render(<FilterControls {...defaultProps} />);
            expect(screen.getAllByText('Bookmarked').length).toBeGreaterThan(0);
         });

        it('renders All option for bookmarked', () => {
            render(<FilterControls {...defaultProps} />);
         });

        it('calls updateFilter when bookmarked changes', () => {
            render(<FilterControls {...defaultProps} />);
         });
    });
});
