import { highlightText } from './ruleSearchUtils';
import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Component to render a single rule or subsection item in the search results
 */
function RuleSearchItem({ item, isHighlighted, searchText, onRuleClick }) {
    const trimmedSearch = searchText.trim();
    const searchLower = trimmedSearch.toLowerCase();

    const handleClick = () => {
        onRuleClick(item.index);
    };

    return (
        <div
            key={`${item.type}-${item.index}`}
            id={item.index}
            className={`rules-flow-item ${isHighlighted ? 'highlighted-rule' : ''}`}
            onClick={handleClick}
        >
            {item.type === 'rule' && (
                <>
                    <h2 className="rules-flow-title">
                        {trimmedSearch && item.name && item.name.toLowerCase().includes(searchLower) ? (
                            <span dangerouslySetInnerHTML={renderHtmlContent(highlightText(item.name, trimmedSearch))} />
                        ) : (
                            item.name
                        )}
                    </h2>
                    {item.desc && (
                        <div className="rules-flow-desc">
                            {trimmedSearch && item.desc && item.desc.toLowerCase().includes(searchLower) ? (
                                <span dangerouslySetInnerHTML={renderHtmlContent(highlightText(item.desc, trimmedSearch))} />
                            ) : (
                                <div dangerouslySetInnerHTML={renderHtmlContent(item.desc)} />
                            )}
                        </div>
                    )}
                </>
            )}

            {item.type === 'subsection' && (
                <>
                    <h3 className="subsection-title">
                        {trimmedSearch && item.name && item.name.toLowerCase().includes(searchLower) ? (
                            <span dangerouslySetInnerHTML={renderHtmlContent(highlightText(item.name, trimmedSearch))} />
                        ) : (
                            item.name
                        )}
                    </h3>
                    {item.desc && (
                        <div className="subsection-desc">
                            {trimmedSearch && item.desc && item.desc.toLowerCase().includes(searchLower) ? (
                                <span dangerouslySetInnerHTML={renderHtmlContent(highlightText(item.desc, trimmedSearch))} />
                            ) : (
                                <div dangerouslySetInnerHTML={renderHtmlContent(item.desc)} />
                            )}
                        </div>
                    )}
                    {item.page && (
                        <div className="subsection-page">
                            {item.book} (page {item.page})
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default RuleSearchItem;
