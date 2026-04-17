/**
 * Scroll card header to the top of the viewport with smooth behavior
 * Works for all components by finding the card container and scrolling to it
 * @param {string} index - The index of the card whose header should scroll into view
 */
export const scrollIntoView = (index) => {
    // Use a longer timeout to ensure the card body has fully rendered
    setTimeout(() => {
        // Try to find the card container by looking for the element with this index as ID
        const cardElement = document.getElementById(index);
        
        if (cardElement) {
            // Get the card's position relative to the document
            const rect = cardElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Calculate the scroll position needed to bring the card to the top
            // Add a small offset to account for the fixed navbar (61px)
            const navbarOffset = 61;
            const targetScrollTop = scrollTop + rect.top - navbarOffset;
            
            // Scroll to the calculated position
            window.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
        }
    }, 300);
};

