import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';
import './PlayerClass.css';

function LevelSelector({ playerClass, shownLevel, onShowLevel }) {
    useEffect(() => {
        if (shownLevel > 0) {
            scrollIntoView(shownLevel);
        }
    }, [shownLevel]);

    if (!playerClass || !playerClass.class_levels) return null;

    return (
        <>
            <div className="subtext">Choose Level</div>
            <div className="level-group">
                {playerClass.class_levels.map((level) => (
                    <div key={level.level} className="btn-group">
                        <button 
                            type="button" 
                            className={`btn btn-outline-primary btn-level ${shownLevel === level.level ? 'active' : ''}`}
                            onClick={() => onShowLevel(level.level)}
                        >
                            {level.level}
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default LevelSelector;
