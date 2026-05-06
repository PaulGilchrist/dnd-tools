import { useState, useEffect } from 'react';


function Feat({ feat, expand, onExpand }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
        }
    }, [expand, isExpanded]);

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    if (!feat) {
        return null;
    }

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={feat.index}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div className="card-title">{feat.name}</div>
            </div>
            {isExpanded && (
                <div className="card-body">
                    <div className="card-text">
                        {feat.prerequisite && (
                            <div>
                                <b>Prerequisite</b>: {feat.prerequisite}<br /><br />
                            </div>
                        )}
                        {feat.desc && feat.desc.map((desc) => (
                            <span key={desc}>
                                {desc}<br /><br />
                            </span>
                        ))}
                        {feat.benefits && feat.benefits.length > 0 && (
                            <ul>
                                {feat.benefits.map((benefit) => (
                                    <li key={benefit}>{benefit}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feat;