import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';
import { renderHtmlContent } from '../../../utils/htmlUtils';
import './PlayerClassFeatures.css';

function PlayerClassFeatures({ features, shownLevel, getPrerequisites }) {
    useEffect(() => {
        if (shownLevel === 0) {
            scrollIntoView(0);
        }
    }, [shownLevel]);

    if (!features || features.length === 0) return null;

    return (
        <div className="playerClass-inner card w-100">
            <div className="card-header clickable" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="card-title">Features</div>
            </div>
            <div className={`card-body player-class-features-card-body ${shownLevel !== 0 ? 'hidden' : ''}`}>
                {features.map((feature) => (
                    <div key={`${feature.name}-${feature.level}`}>
                    <b>{feature.name}:</b>&nbsp;
                          {feature.description && (
                              <span dangerouslySetInnerHTML={renderHtmlContent(feature.description)} />
                          )}

                        {feature.prerequisites && feature.prerequisites.length > 0 && (
                            <div>
                                <b>Prerequisites:</b>&nbsp;{getPrerequisites(feature.prerequisites)}<br />
                                <br />
                            </div>
                        )}

                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlayerClassFeatures;

