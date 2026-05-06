export const getNameString = (names) => {
    if (!names || names.length === 0) return '';
    let nameString = '';
    names.forEach((name) => {
        nameString += `${name}, `;
    });
    return nameString.substring(0, nameString.length - 2);
};

/**
 * Parse a challenge rating string or number into a numeric value.
 * Handles whole numbers, fractions (e.g. "1/2"), and decimals.
 * @param {string|number|undefined} cr
 * @returns {number}
 */
export function parseChallengeRating(cr) {
    if (cr === undefined || cr === null || cr === '') {
        return 0;
    }

    if (typeof cr === 'number') {
        return Number.isFinite(cr) ? cr : 0;
    }

    if (typeof cr === 'string') {
        const trimmed = cr.trim();
        if (trimmed === '') {
            return 0;
        }

        // Fraction format: "1/2", "1/4", "1/8"
        const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
        if (fractionMatch) {
            const numerator = parseInt(fractionMatch[1], 10);
            const denominator = parseInt(fractionMatch[2], 10);
            if (denominator === 0) return 0;
            return numerator / denominator;
        }

        // Decimal or whole number
        const num = parseFloat(trimmed);
        return Number.isFinite(num) ? num : 0;
    }

    return 0;
}
