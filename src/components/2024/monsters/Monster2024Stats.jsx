import { useState } from 'react';

/**
 * Monster2024Stats component - Displays basic monster statistics
 * @param {object} monster - The monster data object
 * @param {function} handleImageClick - Callback to open image modal
 */
function Monster2024Stats({ monster, handleImageClick }) {
    if (!monster) {
        return null;
    }

    return (
        <div className="stats">
            <div>
                <b>Armor Class:</b>&nbsp;{monster.armor_class} {monster.armor_class_details && <span>({monster.armor_class_details})</span>}<br />
                <b>Hit Points:</b>&nbsp;{monster.hit_points} ({monster.hit_dice})<br />
                <b>Initiative:</b>&nbsp;{monster.initiative_details}<br />
                <b>Speed:</b>&nbsp;{monster.speed?.walk || '0 ft.'}
                {monster.speed?.fly && <span>, fly {monster.speed.fly}</span>}
                {monster.speed?.swim && <span>, swim {monster.speed.swim}</span>}
                {monster.speed?.climb && <span>, climb {monster.speed.climb}</span>}
                {monster.speed?.burrow && <span>, burrow {monster.speed.burrow}</span>}
                {monster.speed?.other && monster.speed.other.length > 0 && (
                    <span>, {monster.speed.other.join(', ')}</span>
                )}<br />
            </div>
            <div>
                {monster.image && (
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleImageClick}
                    >
                        Image
                    </button>
                )}
            </div>
        </div>
    );
}

export default Monster2024Stats;