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
    } = usePlayerClassLogic(playerClass, expand ? 1 : 0, '');

    // Forward the onExpand callback from parent
    const handleToggle = () => {
        toggleDetails();
        onExpand(!isExpanded);
    };

    if (!playerClass) {
        return null;
    }

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={playerClass.index}>
            <PlayerClassHeader
                playerClass={playerClass}
                isExpanded={isExpanded}
                onToggle={handleToggle}
            />

            {isExpanded && (
                <div className="card-body">
                    <PlayerClassBasicInfo playerClass={playerClass} getNameString={getNameString} />
                    {/* Features that are not level specific */}
                    {playerClass.features && playerClass.features.length > 0 && (
                        <div>
                            <PlayerClassFeatures
                                features={playerClass.features}
                                shownLevel={shownLevel}
                                getPrerequisites={getPrerequisites}
                            />
                        </div>
                    )}
                    <br />
                    <div>
                        <PlayerClassLevels
                            playerClass={playerClass}
                            shownLevel={shownLevel}
                            onShowLevel={showLevel}
                            classFeatures={classFeatures}
                        />
                    </div>
                    <div>
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
                    <div>
                        {playerClass.page && (
                            <div>{playerClass.book} (page {playerClass.page})</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerClass;
