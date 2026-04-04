/**
 * Scroll element into view with smooth behavior
 * @param {string} index - The ID of the element to scroll into view
 */
export const scrollIntoView = (index) => {
    const element = document.getElementById(index);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};
