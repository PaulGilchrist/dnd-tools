import React from 'react';
import { renderHtmlContent } from '../../../../utils/htmlUtils';

/**
 * Component to display multiclassing information
 */
function PlayerClass2024Multiclassing({ multiclassing }) {
    if (!multiclassing) {
        return null;
    }

    return (
        <div className="multiclassing-info">
            <h4>Multiclassing</h4>
            <div dangerouslySetInnerHTML={renderHtmlContent(multiclassing.requirements)} />
            {multiclassing.core_traits_gained && (
                <div>
                    <b>Core Traits Gained:</b>
                    <span dangerouslySetInnerHTML={renderHtmlContent(multiclassing.core_traits_gained)} />
                </div>
            )}
            {multiclassing.features_gained && (
                <div>
                    <b>Features Gained:</b>
                    <span dangerouslySetInnerHTML={renderHtmlContent(multiclassing.features_gained)} />
                </div>
            )}
        </div>
    );
}

export default PlayerClass2024Multiclassing;