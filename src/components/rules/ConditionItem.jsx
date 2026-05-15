import { renderHtmlContent } from '../../utils/htmlUtils';


function ConditionItem({ condition, expand = false, onExpand }) {
    const isExpanded = expand;

    const toggleDetails = () => {
        onExpand(!isExpanded);
    };

    if (!condition) {
        return null;
    }

    // Render desc as HTML string
    const renderDescription = () => {
        if (!condition.desc) {
            return null;
        }
        return <div dangerouslySetInnerHTML={renderHtmlContent(condition.desc)} />;
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
