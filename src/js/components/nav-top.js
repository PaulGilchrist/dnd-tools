// NavTop component - Plain JavaScript replacement for Angular component

class NavTop {
    constructor() {
        this.selected = '';
        this.initialize();
    }

    initialize() {
        // Check for redirect URL in localStorage (from Angular's OnInit)
        const url = localStorage.getItem('url');
        if (url !== null) {
            localStorage.removeItem('url');
            window.location.href = url;
        }
    }

    showDropdown(name) {
        console.log('Show Dropdown');
        return name === this.selected;
    }

    setSelected(selected) {
        this.selected = selected;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const navTop = new NavTop();
    
    // Add event listeners for dropdown toggles if needed
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Bootstrap handles the dropdown display, we just need to track selection
            const parentLi = e.target.closest('li.nav-item.dropdown');
            if (parentLi) {
                const menuTitle = parentLi.querySelector('.dropdown-toggle').innerText.trim();
                navTop.setSelected(menuTitle);
            }
        });
    });
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavTop;
}
