import { useState, useEffect, useCallback, useRef, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { flattenRules } from './RuleSearchUtils';
import RuleSearchItem from './RuleSearchItem';
import './RulesSearch.css';

// Reducer for managing search state
function searchReducer(state, action) {
    switch (action.type) {
        case 'SET_MATCHES':
            return {
                ...state,
                matches: action.matches,
                highlightIndex: action.matches.length > 0 ? 0 : -1
            };
        case 'SET_HIGHLIGHT':
            return {
                ...state,
                highlightIndex: action.index
            };
        default:
            return state;
    }
}

function RulesSearch({ rules, ruleVersion }) {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchState, dispatch] = useReducer(searchReducer, { matches: [], highlightIndex: -1 });
    const { matches, highlightIndex } = searchState;
    const containerRef = useRef(null);

    // Get flattened rules - memoized to prevent infinite loop
    const flatRules = useMemo(() => flattenRules(rules || [], ruleVersion), [rules, ruleVersion]);

    // Find all matches in the flattened rules and update state via reducer
    useEffect(() => {
        const trimmedSearch = searchText.trim();
        
        if (flatRules.length === 0 || !trimmedSearch) {
            dispatch({ type: 'SET_MATCHES', matches: [] });
            return;
        }

        const searchLower = trimmedSearch.toLowerCase();
        const allMatches = [];
        
        flatRules.forEach((item, idx) => {
            // Check name
            if (item.name && item.name.toLowerCase().includes(searchLower)) {
                allMatches.push({ 
                    index: idx, 
                    type: item.type,
                    ruleIndex: item.index,
                    matchText: item.name
                });
            }
            
            // Check desc - strip HTML tags for searching
            if (item.desc) {
                const descText = item.desc.replace(/<[^>]*>/g, '').toLowerCase();
                if (descText.includes(searchLower)) {
                    allMatches.push({ 
                        index: idx, 
                        type: item.type,
                        ruleIndex: item.index,
                        matchText: item.desc
                    });
                }
            }
        });

        dispatch({ type: 'SET_MATCHES', matches: allMatches });
    }, [flatRules, searchText]);

    // Scroll to match
    const scrollToMatch = useCallback((index) => {
        if (index < 0 || index >= matches.length) return;
        
        const match = matches[index];
        if (!match) return;
        
        // Scroll to the element with the rule index
        const element = document.getElementById(match.ruleIndex);
        if (element) {
            // Get the sticky header height
            const header = document.querySelector('.rules-search-container');
            const headerHeight = header ? header.offsetHeight : 80;
            
            // Calculate the element's position relative to the document
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            
            // Calculate the target scroll position
            // We want the element to appear just below the sticky header
            // The sticky header is at 61px from top (accounting for fixed NavTop)
            // So we need: elementTop - headerHeight
            const targetScroll = elementTop - headerHeight;
            
            // Scroll to the target position
            window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
        }
    }, [matches]);

    // Removed auto-scroll on every keystroke - only scroll when user explicitly navigates

    // Navigate to next/previous match
    const navigateToMatch = useCallback((direction) => {
        if (matches.length === 0) return;
        
        let newIndex = highlightIndex + direction;
        if (newIndex < 0) newIndex = matches.length - 1;
        if (newIndex >= matches.length) newIndex = 0;
        
        dispatch({ type: 'SET_HIGHLIGHT', index: newIndex });
        scrollToMatch(newIndex);
    }, [highlightIndex, matches.length, scrollToMatch, dispatch]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only handle if search input is not focused
            if (document.activeElement && (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA' ||
                document.activeElement.tagName === 'SELECT')) {
                return;
            }
            
            if (e.key === 'ArrowDown' || (e.altKey && e.key === 'j')) {
                e.preventDefault();
                navigateToMatch(1);
            } else if (e.key === 'ArrowUp' || (e.altKey && e.key === 'k')) {
                e.preventDefault();
                navigateToMatch(-1);
            } else if (e.key === 'Escape') {
                // Clear search
                setSearchText('');
                const input = document.querySelector('.rules-search-input');
                if (input) input.blur();
            }
        }; 
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigateToMatch]);

    // Handle rule click to navigate
    const handleRuleClick = (ruleIndex) => {
        navigate(`/rules/general?index=${ruleIndex}`);
    };

    if (!rules || rules.length === 0) {
        return <div className="list"><div>No rules found.</div></div>;
    }

    return (
        <div className="rules-search-wrapper">
            <div className="rules-search-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        className="form-control rules-search-input"
                        placeholder="Search all rules..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        autoFocus
                    />
                    {matches.length > 0 && (
                        <div className="match-counter">
                            {highlightIndex + 1} of {matches.length}
                        </div>
                    )}
                </div>
                
                {/* Navigation Buttons - inside sticky container */}
                {matches.length > 0 && (
                    <div className="rules-navigation">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigateToMatch(-1)}
                            title="Previous match (Alt+Up)"
                        >
                            ▲
                        </button>
                        <span className="match-count-display">
                            {highlightIndex + 1} / {matches.length}
                        </span>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigateToMatch(1)}
                            title="Next match (Alt+Down)"
                        >
                            ▼
                        </button>
                    </div>
                )}
            </div>
            
            {/* Rules List - Flat Flow */}
            <div className="rules-flow-container" ref={containerRef}>
                {flatRules.map((item, idx) => {
                    const isHighlighted = matches.some(m => m.index === idx);
                    return (
                        <RuleSearchItem
                            key={`${item.type}-${item.index}`}
                            item={item}
                            isHighlighted={isHighlighted}
                            searchText={searchText}
                            onRuleClick={handleRuleClick}
                        />
                    );
                })}
            </div>
            
            {/* Empty State */}
            {matches.length === 0 && searchText && (
                <div className="empty-search-results">
                    <p>No rules found matching "{searchText}"</p>
                </div>
            )}
        </div>
    );
}

export default RulesSearch;