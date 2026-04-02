# dnd-tools

## Dungeons & Dragons 5th edition - Quick reference tools

Responsive design supporting smartphones, tablets, and desktops

### Migration from Angular to Plain JavaScript (No Framework)

This project is being migrated incrementally from Angular to plain JavaScript without any framework dependencies. This migration allows us to modernize the codebase while maintaining continuous functionality.

#### Current Status
- **Base Application**: Angular (CLI)
- **Target Architecture**: Plain JavaScript using Web Components
- **Migration Approach**: Incremental - one component at a time
- **Framework Replacement**: No external frameworks (React, Vue, etc.)
- **Current Components**:
  - ✅ NavTop Component: Converted to `<nav-top-js>`
  - ✅ EquipmentItem Component: Converted to `<equipment-item-js>`
  - ✅ Spell Component: Converted to `<spell-js>`
  - ✅ Condition Component: Converted to `<condition-js>`
  - ✅ Race Component: Converted to `<race-js>`

#### Converting Angular Components to Plain JavaScript

Follow these steps to convert an Angular component to a plain JavaScript web component:

1. **Create a new branch for the migration**
   ```bash
   git checkout -b feature/js-migration
   ```

2. **Identify the Angular component to convert**
   - Locate the component in `src/app/components/`
   - Note its selector (e.g., `<app-nav-top>`)
   - Document its HTML template, CSS styles, and TypeScript logic

3. **Create the plain JavaScript Web Component**
   - Create a new file in `src/js/components/` named after the component (e.g., `nav-top.js`)
   - Implement a class extending `HTMLElement`
   - Use the `connectedCallback()` lifecycle method to render content
   - Inject HTML via `innerHTML` and styles via `<style>` tags

4. **Register the custom element**
   - Add at the end of the file:
     ```javascript
     customElements.define('component-selector', ComponentClass);
     ```
   - Example: `customElements.define('nav-top-js', NavTopJs);`

5. **Update Angular template to use the new Web Component**
   - Replace the Angular selector with the custom element selector
   - Example: `<app-nav-top>` → `<nav-top-js>`

6. **Update `angular.json` to include the plain JavaScript file**
   - Add the path to the assets section:
     ```json
     {
       "input": "src/js/components/nav-top.js",
       "output": "/assets/"
     }
     ```
   - Or use glob pattern for all JS files:
     ```json
     {
       "glob": "*.js",
       "input": "src/js/components",
       "output": "/assets/js/components"
     }
     ```

7. **Update `src/index.html` to import the Web Component**
   - Add a script tag before closing `</body>`:
     ```html
     <script src="assets/js/components/nav-top.js"></script>
     ```

8. **Test the component**
   - Run `ng serve` and verify the component renders correctly
   - Check for console errors in browser DevTools
   - Verify interactivity and styling match the original Angular component

9. **Remove the original Angular component files**
   - Delete the component directory in `src/app/components/`
   - Remove the module import if no longer needed
   - Update any other references to the Angular component

10. **Update parent components**
    - Modify parent components to work with the new Web Component
    - Update event handlers for CustomEvents (they may be received as objects with `detail` property)
    - Update template syntax for attribute bindings

11. **Remove obsolete components**
    - Check if any existing Web Components are no longer needed
    - Remove old JavaScript files and their references in `index.html`

12. **Commit and document the conversion**
    - Use a descriptive commit message: `feat: convert [ComponentName] to plain JavaScript`
    - Use single_find_and_replace to update this README with any improvements to the process.
    - Document any known issues or limitations

