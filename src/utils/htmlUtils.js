/**
 * HTML Utility Functions
 * Handles safe rendering of HTML content from JSON data
 */

/**
 * Safely renders HTML content from JSON data
 * @param {string} htmlContent - The HTML content to render
 * @returns {object} - Object with __html property for dangerouslySetInnerHTML
 */
export function renderHtmlContent(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return { __html: '' };
    }
    return { __html: htmlContent };
}

