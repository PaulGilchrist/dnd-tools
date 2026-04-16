import { useState } from 'react';


function ConditionItem({ condition, expand = false, onExpand }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    // Update local state when prop changes
    if (expand !== isExpanded) {
        setIsExpanded(expand);
    }

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    if (!condition) {
        return null;
    }

    // Convert desc array to JSX with proper line breaks
    const renderDescription = () => {
        if (!condition.desc || condition.desc.length === 0) {
            return null;
        }

        return condition.desc.map((desc, index) => (
            <span key={index}>
                {desc}<br /><br />
            </span>
        ));
    };

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={condition.index}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div className="card-title">{condition.name}</div>
            </div>
            {isExpanded && (
                <div className="card-body">
                    {renderDescription()}
                </div>
            )}
        </div>
    );
}

export default ConditionItem;
