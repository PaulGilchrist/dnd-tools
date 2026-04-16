import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';

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
            <div className="card-body" style={{ display: shownLevel !== 0 ? 'none' : 'block' }}>
                {features.map((feature, index) => (
                    <div key={index}>
                        <b>{feature.name}:</b>&nbsp;
                        {feature.desc && feature.desc.map((desc, descIndex) => (
                            <span key={descIndex}>
                                {desc}<br />
                            </span>
                        ))}

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
