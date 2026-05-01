import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MonsterStats from './MonsterStats';

describe('MonsterStats', () => {
   const mockHandleImageClick = vi.fn();

   const createMonster = (overrides = {}) => ({
      armorClass: 15,
      armorClassDetails: 'natural armor',
      hitPoints: 45,
      hitDice: '5d10',
      initiativeDetails: '+2',
      speed: {
         walk: '30 ft.',
         burrow: '20 ft.',
         climb: '30 ft.',
         fly: '40 ft.',
         hover: true,
         swim: '30 ft.',
         other: ['hover'],
       },
      image: '/images/monster.png',
         ...overrides,
        });

   beforeEach(() => {
      vi.clearAllMocks();
       });

   it('returns null when monster is not provided', () => {
      const { container } = render(<MonsterStats monster={null} handleImageClick={mockHandleImageClick} />);
      expect(container.firstChild).toBeNull();
    });

   it('displays armor class with details', () => {
      const monster = createMonster();
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/Armor Class:/)).toBeInTheDocument();
      expect(screen.getByText(/15/)).toBeInTheDocument();
      expect(screen.getByText(/natural armor/)).toBeInTheDocument();
         });

   it('displays hit points and hit dice', () => {
      const monster = createMonster();
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/Hit Points:/)).toBeInTheDocument();
      expect(screen.getByText(/45/)).toBeInTheDocument();
      expect(screen.getByText(/5d10/)).toBeInTheDocument();
       });

   it('displays initiative details when present', () => {
      const monster = createMonster();
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/Initiative:/)).toBeInTheDocument();
      expect(screen.getByText(/\+2/)).toBeInTheDocument();
       });

   it('does not display initiative when not present', () => {
      const monster = createMonster({ initiativeDetails: null });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.queryByText(/Initiative:/)).not.toBeInTheDocument();
    });

   it('displays walk speed', () => {
      const monster = createMonster({ speed: { walk: '30 ft.' } });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/Speed:/)).toBeInTheDocument();
      expect(screen.getByText(/30 ft\./)).toBeInTheDocument();
       });

   it('displays 0 ft. when no walk speed', () => {
      const monster = createMonster({ speed: {} });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/0 ft\./)).toBeInTheDocument();
       });

   it('displays burrow speed when present', () => {
      const monster = createMonster({ speed: { walk: '30 ft.', burrow: '20 ft.' } });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/burrow 20 ft\./)).toBeInTheDocument();
         });

   it('displays climb speed when present', () => {
      const monster = createMonster({ speed: { walk: '30 ft.', climb: '25 ft.' } });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/climb 25 ft\./)).toBeInTheDocument();
         });

   it('displays fly speed with hover when present', () => {
      const monster = createMonster({ speed: { walk: '30 ft.', fly: '40 ft.', hover: true } });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/fly 40 ft\./)).toBeInTheDocument();
      expect(screen.getByText(/\(hover\)/)).toBeInTheDocument();
         });

   it('displays swim speed when present', () => {
      const monster = createMonster({ speed: { walk: '30 ft.', swim: '30 ft.' } });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByText(/swim 30 ft\./)).toBeInTheDocument();
         });

   it('displays image button when monster has image', () => {
      const monster = createMonster();
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.getByRole('button', { name: 'Image' })).toBeInTheDocument();
    });

   it('does not display image button when no image', () => {
      const monster = createMonster({ image: null });
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      expect(screen.queryByRole('button', { name: 'Image' })).not.toBeInTheDocument();
    });

   it('calls handleImageClick when image button is clicked', () => {
      const monster = createMonster();
      render(<MonsterStats monster={monster} handleImageClick={mockHandleImageClick} />);
      const button = screen.getByRole('button', { name: 'Image' });
      button.click();
      expect(mockHandleImageClick).toHaveBeenCalled();
       });
});