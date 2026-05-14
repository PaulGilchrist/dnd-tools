/**
 * Flatten all rules and subsections into a single list
 * @param {Array} rules - The rules array
 * @param {string} ruleVersion - The rule version to filter by
 * @returns {Array} Flattened list of rules and subsections
 */
export function flattenRules(rules, ruleVersion) {
    const flatList = [];

    (rules || []).forEach((rule, ruleIdx) => {
        // Filter main rule by rule version
        if (rule.rules && rule.rules !== ruleVersion) {
            return;
        }

        // Add the main rule
        flatList.push({
            type: 'rule',
            index: rule.index,
            name: rule.name,
            desc: rule.desc,
            ruleIdx: ruleIdx
        });

        // Add all subsections
        if (rule.subsections) {
            rule.subsections.forEach((sub, subIdx) => {
                // Filter by rule version
                if (sub.rules && sub.rules !== ruleVersion) {
                    return;
                }

                flatList.push({
                    type: 'subsection',
                    index: sub.index,
                    name: sub.name,
                    desc: sub.desc,
                    book: sub.book,
                    page: sub.page,
                    ruleIdx: ruleIdx,
                    subIdx: subIdx
                });
            });
        }
    });

    return flatList;
}

/**
 * Utility function to escape special regex characters
 */
export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a regex pattern for highlighting text
 */
export function createHighlightPattern(searchText) {
    if (!searchText || searchText.trim() === '') return null;
    const escaped = escapeRegExp(searchText.trim());
    return new RegExp('(' + escaped + ')', 'gi');
}

/**
 * Highlights text in a string
 */
export function highlightText(text, searchText) {
    if (!text || !searchText || searchText.trim() === '') {
        return text;
     }
     
    const pattern = createHighlightPattern(searchText);
    if (!pattern) return text;
     
    return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
}

/**
 * Extracts all searchable text from a rule and its subsections
 */
export function extractRuleText(rule) {
    let text = rule.name || '';
     
    if (rule.subsections) {
        rule.subsections.forEach(sub => {
            if (sub.name) text += ' ' + sub.name;
            if (sub.desc) text += ' ' + sub.desc;
         });
     }
     
    return text;
}

/**
 * Checks if a rule contains the search text
 */
export function ruleMatchesSearch(rule, searchText) {
    if (!searchText || searchText.trim() === '') return true;
     
    const ruleText = extractRuleText(rule);
    const searchLower = searchText.toLowerCase();
     
    return ruleText.toLowerCase().includes(searchLower);
}
