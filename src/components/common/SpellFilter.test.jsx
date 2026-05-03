import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SpellFilter from './SpellFilter';

describe('SpellFilter', () => {
   const defaultFilter = {
      castingTime: 'All',
      class: 'All',
      levelMin: 0,
      levelMax: 9,
      name: '',
      status: 'All',
   };

   it('renders all filter inputs', () => {
      render(<SpellFilter filter={defaultFilter} onFilterChange={() => {}} />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByText('Class')).toBeInTheDocument();
      expect(screen.getByText('Level Range')).toBeInTheDocument();
      expect(screen.getByText('Casting Time')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
   });

   it('displays current filter values', () => {
      const filter = { ...defaultFilter, name: 'fireball', class: 'Wizard' };
      render(<SpellFilter filter={filter} onFilterChange={() => {}} />);

      expect(screen.getByLabelText('Name')).toHaveValue('fireball');
      const classSelect = document.querySelector('select[name="class"]');
      expect(classSelect).toHaveValue('Wizard');
   });

   it('calls onFilterChange when name input changes', () => {
      const onFilterChange = vi.fn();
      render(<SpellFilter filter={defaultFilter} onFilterChange={onFilterChange} />);

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'fire' } });

      expect(onFilterChange).toHaveBeenCalledWith(
         expect.objectContaining({ name: 'fire' })
      );
   });

   it('calls onFilterChange when class select changes', () => {
      const onFilterChange = vi.fn();
      render(<SpellFilter filter={defaultFilter} onFilterChange={onFilterChange} />);

      fireEvent.change(document.querySelector('select[name="class"]'), { target: { value: 'Wizard' } });

      expect(onFilterChange).toHaveBeenCalledWith(
         expect.objectContaining({ class: 'Wizard' })
      );
   });

   it('calls onFilterChange when level min changes', () => {
      const onFilterChange = vi.fn();
      render(<SpellFilter filter={defaultFilter} onFilterChange={onFilterChange} />);

      const levelMinInput = document.querySelector('input[name="levelMin"]');
      fireEvent.change(levelMinInput, { target: { value: '3' } });

      expect(onFilterChange).toHaveBeenCalledWith(
         expect.objectContaining({ levelMin: 3 })
      );
   });

   it('calls onFilterChange when casting time changes', () => {
      const onFilterChange = vi.fn();
      render(<SpellFilter filter={defaultFilter} onFilterChange={onFilterChange} />);

      fireEvent.change(document.querySelector('select[name="castingTime"]'), { target: { value: 'Action' } });

      expect(onFilterChange).toHaveBeenCalledWith(
         expect.objectContaining({ castingTime: 'Action' })
      );
   });

   it('shows error when name is too long', () => {
      const longName = 'A'.repeat(50);
      const filter = { ...defaultFilter, name: longName };
      render(<SpellFilter filter={filter} onFilterChange={() => {}} />);

      expect(screen.getByText('Name should be less than 50 characters')).toBeInTheDocument();
   });

   it('handles missing onFilterChange callback', () => {
      render(<SpellFilter filter={defaultFilter} />);

      expect(() => {
         fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'test' } });
      }).not.toThrow();
   });
});
