/**
 * NavTop Component - Plain JavaScript implementation
 * Replaces Angular NavTopComponent
 */

class NavTop {
    constructor() {
        this.selected = '';
        // Check for redirect URL in localStorage
        const url = localStorage.getItem('url');
        if (url) {
            localStorage.removeItem('url');
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => {
                window.location.href = url;
            }, 100);
        }
        
        // Initialize after DOM loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Set active state for current page
        this.setActiveLinks();
        
        // Handle dropdown selection
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const parentLi = dropdown.closest('li');
                    if (parentLi) {
                        this.selected = parentLi.querySelector('.dropdown-toggle').textContent.trim();
                    }
                });
            }
        });
        
        // Handle link clicks for active state
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.setActiveLinks());
        });
    }
    
    setActiveLinks() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to matching nav items based on current path
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) {
                // Find parent nav-item
                const navItem = link.closest('.nav-item');
                if (navItem) {
                    navItem.classList.add('active');
                    
                    // Handle dropdown parent
                    const parentDropdown = navItem.closest('.dropdown');
                    if (parentDropdown) {
                        const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
                        if (dropdownToggle) {
                            this.selected = dropdownToggle.textContent.trim();
                        }
                    }
                }
            }
        });
    }
    
    showDropdown(name) {
        console.log('Show Dropdown');
        return name === this.selected;
    }

    setSelected(selected) {
        this.selected = selected;
    }
}

// Custom element class for <nav-top-js> component
class NavTopJs extends HTMLElement {
    connectedCallback() {
        // Inject the nav HTML directly
        this.innerHTML = `
<nav class="navbar navbar-dark bg-dark navbar-expand-md fixed-top">
  <a class="navbar-brand ms-2" href="/">D&D Tools</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="/equipment-items">Equipment</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/locations">Locations</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/magic-items">Magic Items</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMonsters" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Monsters
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMonsters">
          <li><a class="dropdown-item" href="/monster/encounters">Encounters</a></li>
          <li><a class="dropdown-item" href="/monster/lore">Lore</a></li>
          <li><a class="dropdown-item" href="/monster/search">Search</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/names">Names</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownRules" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Rules
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdownRules">
          <li><a class="dropdown-item" href="/rules/general">General</a></li>
          <li><a class="dropdown-item" href="/rules/ability-scores">Abilities</a></li>
          <li><a class="dropdown-item" href="/rules/classes">Classes</a></li>
          <li><a class="dropdown-item" href="/rules/conditions">Conditions</a></li>
          <li><a class="dropdown-item" href="/rules/feats">Feats</a></li>
          <li><a class="dropdown-item" href="/rules/races">Races</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/spells">Spells</a>
      </li>
    </ul>
  </div>
</nav>

<style>
.active > .nav-link {
    background-color: var(--background-color-inverse);
    border-radius: 5px;
    color: var(--color-header) !important;
}
.navbar-brand {
    color: var(--color-header);
    font-weight: 900;
}
</style>
        `;
        
        // Initialize navigation after DOM is ready
        setTimeout(() => {
            this.initNav();
        }, 10);
    }
    
    initNav() {
        // Set active state for current page
        this.setActiveLinks();
        
        // Handle dropdown selection
        const dropdowns = this.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const parentLi = dropdown.closest('li');
                    if (parentLi) {
                        // Update the selected item
                        this.selected = parentLi.querySelector('.dropdown-toggle').textContent.trim();
                    }
                });
            }
        });
        
        // Handle link clicks for active state
        const navLinks = this.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.setActiveLinks());
        });
    }
    
    setActiveLinks() {
        // Remove active class from all nav items
        this.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to matching nav items based on current path
        const currentPath = window.location.pathname;
        this.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) {
                // Find parent nav-item
                const navItem = link.closest('.nav-item');
                if (navItem) {
                    navItem.classList.add('active');
                    
                    // Handle dropdown parent
                    const parentDropdown = navItem.closest('.dropdown');
                    if (parentDropdown) {
                        const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
                        if (dropdownToggle) {
                            this.selected = dropdownToggle.textContent.trim();
                        }
                    }
                }
            }
        });
    }
}

// Register custom element
customElements.define('nav-top-js', NavTopJs);
