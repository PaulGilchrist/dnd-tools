import { useEffect } from 'react';
import { scrollIntoView } from '../../../../data/utils';

function PlayerClass2024Header({ playerClass, isExpanded, onToggle }) {
    useEffect(() => {
        if (isExpanded) {
            scrollIntoView(playerClass.index);
        }
    }, [isExpanded, playerClass.index]);

    return (
        <div className="card-header clickable" onClick={onToggle}>
            <div className="card-title">{playerClass.name}</div>
        </div>
    );
}

export default PlayerClass2024Header;