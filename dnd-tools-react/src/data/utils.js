// Javascript utilities (matching Angular)

/**
 * Scrolls an element into view smoothly and centers it
 * @param {string} index - The ID of the element to scroll into view
 */
function scrollIntoView(index) {
    const element = document.getElementById(index);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

export { scrollIntoView };
