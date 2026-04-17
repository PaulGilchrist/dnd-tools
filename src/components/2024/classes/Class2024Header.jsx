import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';

function Class2024Header({ playerClass, isExpanded, onToggle }) {
    useEffect(() => {
        if (isExpanded) {
            scrollIntoView(playerClass.index);
        }
    }, [isExpanded]);

    return (
        <div className="card-header clickable" onClick={onToggle}>
            <div className="card-title">{playerClass.name}</div>
        </div>
    );
}

export default Class2024Header;