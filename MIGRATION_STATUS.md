# D&D Tools Migration Status

## Overview
This document tracks the migration from Angular to plain JavaScript (ES6+ Web Components).

## Migration Progress

### ✅ Completed Components
1. **nav-top** - Navigation component migrated to `src/js/components/nav-top.js`
2. **equipment-item** - Equipment item component migrated to `src/js/components/equipment-item.js`
3. **spell** - Spell card component migrated to `src/js/components/spell.js`

### 📋 Migration Checklist for Each Component

#### 1. Create JavaScript Version
- [ ] Read Angular component TypeScript file
- [ ] Identify all dependencies (services, interfaces, etc.)
- [ ] Create plain JavaScript file with Web Component class
- [ ] Implement `connectedCallback()` for initialization
- [ ] Convert Angular templates to template literals
- [ ] Replace Angular directives with vanilla JS:
  - `[property]` → Direct property assignment or `setAttribute()`
  - `(event)` → `addEventListener()`
  - `*ngFor` → JavaScript loop with template creation
  - `*ngIf` → Conditional DOM manipulation or class toggling
  - `[class.x]="condition"` → `classList.toggle()`
- [ ] Convert Angular pipes to helper functions
- [ ] Handle event dispatching with `CustomEvent`

#### 2. CSS Handling
**Approach**: Each component includes its own styles in a `<style>` tag within the template.

- [ ] Extract CSS from Angular component's `styles` array
- [ ] Convert to template literal in JavaScript file
- [ ] Add to component's `innerHTML` via `getStyle()` method or inline
- [ ] Use CSS variables for theming (e.g., `var(--background-color-inverse)`)
- [ ] Ensure responsive design is maintained

#### 3. Event Handling
- [ ] Replace Angular event binding with `addEventListener()`
- [ ] Use `event.stopPropagation()` to prevent bubbling when needed
- [ ] Dispatch custom events for parent communication:
  ```javascript
  this.dispatchEvent(new CustomEvent('eventName', { 
    detail: { data },
    bubbles: true,
    composed: true
  }));
  ```

#### 4. Data Binding
- [ ] Convert two-way binding to property setters/getters
- [ ] Use `textContent` for text content (prevents XSS)
- [ ] Use `innerHTML` only when HTML is trusted/needed
- [ ] Implement property setters to trigger re-rendering

#### 5. Testing
- [ ] Verify component renders correctly
- [ ] Test all interactive elements (clicks, checkboxes, etc.)
- [ ] Verify event dispatching works correctly
- [ ] Check responsive behavior
- [ ] Test with sample data

### 🔄 Next Component to Migrate

**Recommended**: Choose the next component based on:
1. **Low dependencies** - Components that don't rely heavily on other Angular services
2. **High visibility** - Components users interact with frequently
3. **Complexity** - Start with simpler components to establish patterns

**Suggestions**:
- Check `src/app/` directory for remaining Angular components
- Look for presentational components (less logic, more UI)
- Consider components used in multiple places (higher impact)

### 📝 Migration Patterns & Best Practices

#### Template Structure
```javascript
connectedCallback() {
  this.innerHTML = `
    ${this.getStyle()}
    <div class="component-wrapper">
      <!-- Component HTML here -->
    </div>
  `;
  
  // Initialize event listeners
  this.setupEventListeners();
}
```

#### Event Handling Pattern
```javascript
// Setup event listener
const element = this.querySelector('.clickable');
if (element) {
  element.addEventListener('click', () => {
    // Handle click
    this.dispatchEvent(new CustomEvent('customEvent', { 
      detail: { value },
      bubbles: true,
      composed: true
    }));
  });
}
```

#### CSS Variable Usage
```css
.card.active {
  background-color: var(--background-color-inverse);
  border-radius: 5px;
}
```

#### Property Setter Pattern
```javascript
set spell(value) {
  this._spell = value;
  const expand = this.getAttribute('expand') === 'true';
  if (value) {
    this.populateData(value, expand);
  }
}

get spell() {
  return this._spell;
}
```

### 🛠️ Tools & Commands

- **Build**: `npm run build`
- **Serve development**: `ng serve` (Angular) or set up Vite/webpack for JS
- **Check build output**: `dist/dnd-tools/browser/`

### 📚 Resources

- **Web Components Spec**: https://webcomponents.github.io/specs/
- **Custom Elements**: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
- **Shadow DOM**: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
- **Custom Events**: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent

---

**Last Updated**: 2026-04-02
**Migration Status**: 3 components completed
