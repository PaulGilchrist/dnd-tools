import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeaponPropertyDescription from './WeaponPropertyDescription';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

describe('WeaponPropertyDescription', () => {
    const getWeaponPropertyDescription = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
     });

    describe('default rendering', () => {
        it('renders when category is Weapon and property is not All', () => {
            getWeaponPropertyDescription.mockReturnValue('Weapon can be used with one or two hands.');
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="Versatile"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.getByText(/Weapon Property - Versatile/)).toBeInTheDocument();
            expect(document.querySelector('.equipmentItems-weapon-property-description')).toBeInTheDocument();
         });

        it('calls getWeaponPropertyDescription with the property name', () => {
            getWeaponPropertyDescription.mockReturnValue('A longer description.');
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="Finesse"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(getWeaponPropertyDescription).toHaveBeenCalledWith('Finesse');
         });

        it('renders the description returned by getWeaponPropertyDescription', () => {
            getWeaponPropertyDescription.mockReturnValue('Use DEX instead of STR.');
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="Finesse"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.getByText(/Use DEX instead of STR/)).toBeInTheDocument();
         });
     });

    describe('conditional rendering', () => {
        it('returns null when category is not Weapon', () => {
            const { container } = render(
                 <WeaponPropertyDescription
                     category="Armor"
                     property="Finesse"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(container.querySelector('.equipmentItems-weapon-property-description')).not.toBeInTheDocument();
         });

        it('returns null when property is All regardless of category', () => {
            const { container } = render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="All"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(container.querySelector('.equipmentItems-weapon-property-description')).not.toBeInTheDocument();
         });

        it('returns null when category is not Weapon and property is All', () => {
            const { container } = render(
                 <WeaponPropertyDescription
                     category="Tools"
                     property="All"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(container.querySelector('.equipmentItems-weapon-property-description')).not.toBeInTheDocument();
         });

        it('does not call getWeaponPropertyDescription when property is All', () => {
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="All"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(getWeaponPropertyDescription).not.toHaveBeenCalled();
         });

        it('does not call getWeaponPropertyDescription when category is not Weapon', () => {
            render(
                 <WeaponPropertyDescription
                     category="Armor"
                     property="Heavy"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(getWeaponPropertyDescription).not.toHaveBeenCalled();
         });
     });

    describe('all weapon properties', () => {
        const weaponProperties = [
         'Ammunition', 'Finesse', 'Heavy', 'Light', 'Loading',
         'Monk', 'Reach', 'Thrown', 'Two-Handed', 'Versatile',
        ];

        weaponProperties.forEach((prop) => {
            it(`renders description for ${prop} property`, () => {
                getWeaponPropertyDescription.mockReturnValue(`Description for ${prop}.`);
                render(
                     <WeaponPropertyDescription
                         category="Weapon"
                         property={prop}
                         getWeaponPropertyDescription={getWeaponPropertyDescription}
                     />,
                 );
                expect(screen.getByText(new RegExp(`Weapon Property - ${prop}`))).toBeInTheDocument();
             });
         });
     });

    describe('edge cases', () => {
        it('renders empty description when getWeaponPropertyDescription returns empty string', () => {
            getWeaponPropertyDescription.mockReturnValue('');
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="Unknown"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.getByText(/Weapon Property - Unknown/)).toBeInTheDocument();
         });

        it('renders description when getWeaponPropertyDescription returns undefined', () => {
            getWeaponPropertyDescription.mockReturnValue(undefined);
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="UnknownProperty"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.getByText(/Weapon Property - UnknownProperty/)).toBeInTheDocument();
         });

        it('handles category being undefined', () => {
            render(
                 <WeaponPropertyDescription
                     category={undefined}
                     property="Finesse"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.queryByText(/Weapon Property/)).not.toBeInTheDocument();
         });

        it('handles both category and property being undefined', () => {
            render(
                 <WeaponPropertyDescription
                     category={undefined}
                     property={undefined}
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.queryByText(/Weapon Property/)).not.toBeInTheDocument();
         });

        it('handles getWeaponPropertyDescription returning null', () => {
            getWeaponPropertyDescription.mockReturnValue(null);
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="Broken"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.getByText(/Weapon Property - Broken/)).toBeInTheDocument();
         });

        it('handles property with hyphens', () => {
            getWeaponPropertyDescription.mockReturnValue('Description for Two-Handed.');
            render(
                 <WeaponPropertyDescription
                     category="Weapon"
                     property="Two-Handed"
                     getWeaponPropertyDescription={getWeaponPropertyDescription}
                 />,
             );
            expect(screen.getByText(/Weapon Property - Two-Handed/)).toBeInTheDocument();
         });
     });
});
