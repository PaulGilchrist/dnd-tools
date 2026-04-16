import { useState, useEffect } from 'react';

function MagicItem({ magicItem, expand, onExpand, onBookmarkChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
        }
    }, [expand]);

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    const toggleBookmark = () => {
        magicItem.bookmarked = !magicItem.bookmarked;
        onBookmarkChange(magicItem.index, magicItem.bookmarked);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        magicItem.bookmarked = e.target.checked;
        onBookmarkChange(magicItem.index, magicItem.bookmarked);
    };

    const handleLabelClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    if (!magicItem) {
        return null;
    }

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={magicItem.index}>
            <div className="card-header clickable">
                <div onClick={toggleDetails}>
                    <div className="card-title">{magicItem.name}</div>
                    <div>
                        <i>{magicItem.type}, {magicItem.rarity}</i>
                        {magicItem.requiresAttunement && (
                            <span>, Requires Attunement</span>
                        )}
                    </div>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`bookmarked-${magicItem.index}`}
                        checked={magicItem.bookmarked || false}
                        onChange={handleCheckboxChange}
                    />
                    <label 
                        className="form-check-label" 
                        htmlFor={`bookmarked-${magicItem.index}`}
                        onClick={handleLabelClick}
                    >
                        Bookmarked
                    </label>
                </div>
            </div>

            {isExpanded && (
                <div className="card-body">
                    <div className="card-text">
                        {/* Description */}
                        {magicItem.description && (
                            <div>
                                <b>Description:</b><br />
                                <div dangerouslySetInnerHTML={{ __html: magicItem.description }} />
                            </div>
                        )}

                        {/* Subtype */}
                        {magicItem.subtype && (
                            <div>
                                <b>Subtype:</b>&nbsp;{magicItem.subtype}<br />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MagicItem;

