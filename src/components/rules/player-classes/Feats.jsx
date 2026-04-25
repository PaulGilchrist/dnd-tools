import React from 'react';

/**
 * Component to display the number of feats a character can have (5e rules)
 * First feat at level 4, then one additional at levels 8, 12, 16, and 20
 */
function Feats({ level }) {
    if (!level || level < 1) {
        return null;
     }

     // Calculate total feats based on level
     // Feats gained at levels 4, 8, 12, 16, and 20
    const featLevels = [4, 8, 12, 16, 20];
    const totalFeats = featLevels.filter(featLevel => level >= featLevel).length;

    if (totalFeats === 0) {
        return null;
     }

    return (
         <div>
             <b>Feats:</b>&nbsp;{totalFeats}<br />
         </div>
     );
}

export default Feats;