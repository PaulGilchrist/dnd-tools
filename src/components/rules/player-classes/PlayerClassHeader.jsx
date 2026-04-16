import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';

function PlayerClassHeader({ playerClass, isExpanded, onToggle }) {
    useEffect(() => {
        if (isExpanded) {
            scrollIntoView(playerClass.index);
        }
    }, [isExpanded]);

    return (
        <div className="playerClass-card-header clickable" onClick={onToggle}>
            <div className="card-title">{playerClass.name}</div>
        </div>
    );
}

export default PlayerClassHeader;
