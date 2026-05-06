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
