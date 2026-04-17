import React from 'react';

/**
 * Component to display a summary of class features up to the current level
 */
function Class2024ClassFeatures({ classFeatures }) {
    if (!classFeatures || classFeatures.length === 0) {
        return null;
    }

    return (
        <div className="class-features-section" style={{ marginBottom: '1rem' }}>
            <h5>Class Features</h5>
            {classFeatures.map((feature, index) => (
                <div key={index} className="feature-item" style={{ marginBottom: '1rem' }}>
                    <b>{feature.name} (Level {feature.level}):</b>&nbsp;
                    {feature.description && (
                        <span dangerouslySetInnerHTML={{ __html: feature.description }} />
                    )}
                    <br />
                </div>
            ))}
        </div>
    );
}

export default Class2024ClassFeatures;