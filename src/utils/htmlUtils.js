/**
 * HTML Utility Functions
 * Handles safe rendering of HTML content from JSON data
 * Uses DOMPurify to sanitize HTML and prevent XSS attacks
 */

import DOMPurify from 'dompurify';

/**
 * Safely renders HTML content from JSON data
 * Sanitizes the HTML to prevent XSS attacks while preserving
 * the formatting tags used in D&D JSON data.
 *
 * @param {string} htmlContent - The HTML content to render
 * @returns {object} - Object with __html property for dangerouslySetInnerHTML
 */
export function renderHtmlContent(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return { __html: '' };
    }

    const cleanHtml = DOMPurify.sanitize(htmlContent, {
            ALLOWED_TAGS: [
                 'b', 'i', 'em', 'strong', 'br', 'hr',
                 'ul', 'ol', 'li',
                 'span', 'div', 'mark', 'small', 'a',
                 'h5', 'h6', 'p',
                 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col'
             ],
            ALLOWED_ATTR: [
                 'class', 'href', 'target', 'rel', 'style', 'scope', 'colspan', 'rowspan'
             ],
         });

    return { __html: cleanHtml };
}
