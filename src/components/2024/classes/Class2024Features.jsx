import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';

function Class2024Features({ features, shownLevel }) {
    useEffect(() => {
        if (shownLevel === 0) {
            scrollIntoView(0);
        }
    }, [shownLevel]);

    if (!features || features.length === 0) return null;

    return (
        <div className="playerClass-inner card w-100" style={{ marginBottom: '1rem' }}>
            <div className="card-header clickable">
                <div className="card-title">Class Features</div>
            </div>
            <div className="card-body" style={{ display: shownLevel !== 0 ? 'none' : 'block' }}>
                {features.map((feature, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                        <b>{feature.name} (Level {feature.level}):</b>&nbsp;
                        {feature.description && (
                            <span dangerouslySetInnerHTML={{ __html: feature.description }} />
                        )}
                        <br /><br />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Class2024Features;