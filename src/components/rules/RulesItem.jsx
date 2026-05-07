import { useState } from 'react';
import { scrollIntoView } from '../../data/utils';
import { renderHtmlContent } from '../../utils/htmlUtils';

function RulesItem({ rule, expand = false, onExpand }) {
    const [realShownSubsection, setRealShownSubsection] = useState(null);
    const shownSubsection = expand ? realShownSubsection : null;

    const showSubsection = (subsection) => {
        if (realShownSubsection === subsection) {
            setRealShownSubsection(null);
        } else {
            setRealShownSubsection(subsection);
            scrollIntoView(subsection);
        }
    };

    const toggleDetails = () => {
        const newExpandState = !expand;
        if (onExpand) {
            onExpand(newExpandState);
        }
    };

    if (!rule) {
        return null;
    }

    // Convert subsections to JSX with innerHtml handling
    const renderSubsections = () => {
        if (!rule.subsections) return null;

        return rule.subsections.map((subsection) => (
            <div key={subsection.index} id={subsection.index}>
                <div className={`inner card ${shownSubsection === subsection.index ? 'active' : ''}`}>
                    <div className="inner card-header clickable" onClick={() => showSubsection(subsection.index)}>
                        <div className="card-title">{subsection.name}</div>
                    </div>
                    <div className={`inner card-body ${shownSubsection === subsection.index ? '' : 'hidden'}`}>
                        <div dangerouslySetInnerHTML={renderHtmlContent(subsection.desc)}></div>
                        {subsection.page && (
                            <div>{subsection.book} (page {subsection.page})</div>
                        )}
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="component">
            <div className={`card outer w-100 ${expand ? 'active' : ''}`}>
                <div className="card-header clickable" onClick={toggleDetails}>
                    <div className="card-title">{rule.name}</div>
                </div>
                {expand && (
                    <div key={expand} className="card-body">
                        {renderSubsections()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RulesItem;
