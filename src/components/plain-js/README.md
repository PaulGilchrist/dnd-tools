# Component Conversion Process

This directory contains components converted from Angular to plain JavaScript.

## Current Status
- ✅ NavTop Component: Converted to `<nav-top-js>`
  - Original: `src/app/components/nav-top/nav-top.component.ts`
  - Features: Dropdown selection tracking, URL redirect handling via localStorage

- ✅ EquipmentItem Component: Converted to `<equipment-item-js>`
  - Original: `src/app/components/equipment-item/equipment-item.component.ts`
  - Features: Item display with bookmarking, expandable details for various equipment types

- ✅ Condition Component: Converted to `<condition-js>`
  - Original: `src/app/components/condition/condition.component.ts`
  - Features: Condition display with description

## Conversion Strategy

### Phase 1: Angular → Plain JavaScript
The goal is to remove all Angular dependencies first:
- Replace Angular components with vanilla JS classes
- Remove Angular-specific features (dependency injection, decorators, etc.)
- Keep the same functionality and behavior
- Maintain CSS styling from original components

## Files Structure

```
src/
├── components/                      # All components
│   ├── angular/                     # Original Angular components (to be removed)
│   └── plain-js/                    # Components converted to plain JS
├── js/
│   └── components/                  # Alternative location for plain JS components
```

## Adding New Components

1. Start with the Angular component (e.g., `src/app/components/component-name/`)
2. Create a plain JavaScript version in `src/js/components/component-name.js`
3. Test functionality matches the Angular original
4. Update templates to use plain JavaScript (remove Angular directives like `*ngIf`, `[routerLink]`, etc.)

## Benefits of This Approach

1. **Lower Risk**: Convert components one at a time without introducing React complexity
2. **Gradual Migration**: Remove Angular dependencies before adopting new framework
3. **Easier Testing**: Plain JS components are simpler to unit test
4. **Better Understanding**: Fully understand component logic before refactoring
