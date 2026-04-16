import { usePlayerClassLogic } from '../../../hooks/usePlayerClassLogic';
import PlayerClassHeader from './PlayerClassHeader';
import PlayerClassBasicInfo from './PlayerClassBasicInfo';
import PlayerClassFeatures from './PlayerClassFeatures';
import PlayerClassLevels from './PlayerClassLevels';
import PlayerClassSubclasses from './PlayerClassSubclasses';

function PlayerClass({ playerClass, expand, onExpand }) {
    const {
        isExpanded,
        shownLevel,
        shownSubclass,
        getNameString,
        getPrerequisites,
        getSpells,
        toggleDetails,
        showLevel,
        showSubclass,
        classFeatures,
        subclassFeatures
    } = usePlayerClassLogic(playerClass, expand === 'active' ? 1 : 0, '');

    // Forward the onExpand callback from parent
    const handleToggle = () => {
        toggleDetails();
        onExpand(!isExpanded);
    };

    if (!playerClass) {
        return null;
    }

    return (
        <div className={`playerClass-outer card w-100 ${isExpanded ? 'active' : ''}`} id={playerClass.index}>
            <PlayerClassHeader 
                playerClass={playerClass}
                isExpanded={isExpanded}
                onToggle={handleToggle}
            />

            {isExpanded && (
                <>
                    <PlayerClassBasicInfo playerClass={playerClass} getNameString={getNameString} />

                    {/* Features that are not level specific */}
                    {playerClass.features && playerClass.features.length > 0 && (
                        <div className="card-body">
                            <PlayerClassFeatures 
                                features={playerClass.features}
                                shownLevel={shownLevel}
                                getPrerequisites={getPrerequisites}
                            />
                        </div>
                    )}

                    <div className="card-body">
                        <PlayerClassLevels 
                            playerClass={playerClass}
                            shownLevel={shownLevel}
                            onShowLevel={showLevel}
                        />
                    </div>

                    <div className="card-body">
                        <PlayerClassSubclasses 
                            playerClass={playerClass}
                            shownLevel={shownLevel}
                            shownSubclass={shownSubclass}
                            onShowSubclass={showSubclass}
                            getSpells={getSpells}
                            classFeatures={classFeatures}
                            subclassFeatures={subclassFeatures}
                        />
                    </div>

                    <div className="card-body">
                        <br />
                        {playerClass.page && (
                            <div>{playerClass.book} (page {playerClass.page})</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default PlayerClass;
