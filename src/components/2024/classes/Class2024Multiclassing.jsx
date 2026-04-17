import React from 'react';

/**
 * Component to display multiclassing information
 */
function Class2024Multiclassing({ multiclassing }) {
    if (!multiclassing) {
        return null;
    }

    return (
        <div className="multiclassing-info">
            <h4>Multiclassing</h4>
            <div dangerouslySetInnerHTML={{ __html: multiclassing.requirements }} />
            {multiclassing.core_traits_gained && (
                <div>
                    <b>Core Traits Gained:</b>
                    <span dangerouslySetInnerHTML={{ __html: multiclassing.core_traits_gained }} />
                </div>
            )}
            {multiclassing.features_gained && (
                <div>
                    <b>Features Gained:</b>
                    <span dangerouslySetInnerHTML={{ __html: multiclassing.features_gained }} />
                </div>
            )}
        </div>
    );
}

export default Class2024Multiclassing;