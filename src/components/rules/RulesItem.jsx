import { useState } from 'react';
import { scrollIntoView } from '../../data/utils';
import './RulesItem.css';

function RulesItem({ rule, expand = false, onExpand }) {
    const [shownSubsection, setShownSubsection] = useState('');

    const showSubsection = (subsection) => {
        if (shownSubsection === subsection) {
            setShownSubsection('');
        } else {
            setShownSubsection(subsection);
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
                <div className={`rulesItem-inner card ${shownSubsection === subsection.index ? 'active' : ''}`}>
                    <div className="inner card-header clickable" onClick={() => showSubsection(subsection.index)}>
                        <div className="card-title">{subsection.name}</div>
                    </div>
                    <div className={`rulesItem-inner card-body ${shownSubsection !== subsection.index ? 'rulesItem-hidden' : ''}`}>
                        <div dangerouslySetInnerHTML={{ __html: subsection.desc }}></div>
                        {subsection.page && (
                            <div>{subsection.book} (page {subsection.page})</div>
                        )}
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="rulesItem-component">
            <div className={`card outer w-100 ${expand ? 'active' : ''}`}>
                <div className="card-header clickable" onClick={toggleDetails}>
                    <div className="card-title">{rule.name}</div>
                </div>
                {expand && (
                    <div className="card-body">
                        {renderSubsections()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RulesItem;

