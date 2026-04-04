import { useEffect } from 'react';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index, offset = 0) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function PlayerClassHeader({ playerClass, isExpanded, onToggle }) {
    useEffect(() => {
        if (isExpanded) {
            utils.scrollIntoView(playerClass.index);
        }
    }, [isExpanded]);

    return (
        <div className="card-header clickable" onClick={onToggle}>
            <div className="card-title">{playerClass.name}</div>
        </div>
    );
}

export default PlayerClassHeader;
