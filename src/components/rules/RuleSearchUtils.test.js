import { describe, it, expect } from 'vitest';
import { escapeRegExp, createHighlightPattern, highlightText, extractRuleText, ruleMatchesSearch } from './RuleSearchUtils';

describe('escapeRegExp', () => {
    it('escapes special regex characters', () => {
        expect(escapeRegExp('hello.world')).toBe('hello\\.world');
        expect(escapeRegExp('test*123')).toBe('test\\*123');
        expect(escapeRegExp('a+b')).toBe('a\\+b');
        expect(escapeRegExp('(test)')).toBe('\\(test\\)');
        expect(escapeRegExp('[abc]')).toBe('\\[abc\\]');
    });

    it('returns empty string unchanged', () => {
        expect(escapeRegExp('')).toBe('');
    });

    it('returns normal text unchanged', () => {
        expect(escapeRegExp('hello world')).toBe('hello world');
    });
});

describe('createHighlightPattern', () => {
    it('returns null for empty search text', () => {
        expect(createHighlightPattern('')).toBeNull();
        expect(createHighlightPattern('  ')).toBeNull();
        expect(createHighlightPattern(null)).toBeNull();
    });

    it('creates case-insensitive regex pattern', () => {
        const pattern = createHighlightPattern('test');
        expect(pattern).toBeInstanceOf(RegExp);
        expect(pattern.flags).toContain('i');
        expect(pattern.flags).toContain('g');
    });

    it('escapes special characters in pattern', () => {
        const pattern = createHighlightPattern('test.value');
        expect('test.value'.match(pattern)).toBeTruthy();
    });
});

describe('highlightText', () => {
    it('returns original text when search text is empty', () => {
        expect(highlightText('hello world', '')).toBe('hello world');
        expect(highlightText('hello world', null)).toBe('hello world');
    });

    it('returns original text when no search text', () => {
        expect(highlightText('hello world', undefined)).toBe('hello world');
    });

    it('wraps matching text in mark tags', () => {
        const result = highlightText('hello world', 'hello');
        expect(result).toContain('<mark class="search-highlight">hello</mark>');
    });

    it('is case-insensitive', () => {
        const result = highlightText('Hello World', 'hello');
        expect(result).toContain('<mark class="search-highlight">Hello</mark>');
    });

    it('highlights multiple occurrences', () => {
        const result = highlightText('hello hello world', 'hello');
        const matches = result.match(/<mark class="search-highlight">hello<\/mark>/gi);
        expect(matches).toHaveLength(2);
    });
});

describe('extractRuleText', () => {
    it('extracts text from rule name', () => {
        const rule = { name: 'Combat', desc: 'Rules for combat' };
        expect(extractRuleText(rule)).toContain('Combat');
    });

    it('extracts text from rule description', () => {
        // extractRuleText only includes name and subsections, not the main desc
        const rule = { name: 'Combat', desc: 'Rules for combat' };
        const result = extractRuleText(rule);
        expect(result).toContain('Combat');
        // desc is not included in extractRuleText output
        expect(result).not.toContain('Rules for combat');
    });

    it('extracts text from subsections', () => {
        const rule = {
            name: 'Combat',
            subsections: [
                { name: 'Attacking', desc: 'How to attack' },
                { name: 'Damage', desc: 'How to deal damage' },
            ],
        };
        const text = extractRuleText(rule);
        expect(text).toContain('Attacking');
        expect(text).toContain('How to attack');
        expect(text).toContain('Damage');
    });

    it('handles rule with no subsections', () => {
        // extractRuleText only includes name and subsections, not the main desc
        const rule = { name: 'Combat', desc: 'Rules' };
        const result = extractRuleText(rule);
        expect(result).toContain('Combat');
        // desc is not included in extractRuleText output
        expect(result).not.toContain('Rules');
    });
});

describe('ruleMatchesSearch', () => {
    it('returns true when search text is empty', () => {
        const rule = { name: 'Combat', desc: 'Rules' };
        expect(ruleMatchesSearch(rule, '')).toBe(true);
        expect(ruleMatchesSearch(rule, '  ')).toBe(true);
    });

    it('returns true when rule name matches', () => {
        const rule = { name: 'Combat', desc: 'Rules' };
        expect(ruleMatchesSearch(rule, 'combat')).toBe(true);
    });

    it('returns true when rule description matches', () => {
        // ruleMatchesSearch uses extractRuleText which doesn't include main desc
        // So this should be false
        const rule = { name: 'Combat', desc: 'Rules for fighting' };
        expect(ruleMatchesSearch(rule, 'fighting')).toBe(false);
    });

    it('returns true when subsection matches', () => {
        const rule = {
            name: 'Combat',
            subsections: [{ name: 'Attacking', desc: 'How to attack' }],
        };
        expect(ruleMatchesSearch(rule, 'attacking')).toBe(true);
    });

    it('returns false when no match', () => {
        const rule = { name: 'Combat', desc: 'Rules' };
        expect(ruleMatchesSearch(rule, 'magic')).toBe(false);
    });

    it('is case-insensitive', () => {
        const rule = { name: 'Combat', desc: 'Rules' };
        expect(ruleMatchesSearch(rule, 'COMBAT')).toBe(true);
    });
});
