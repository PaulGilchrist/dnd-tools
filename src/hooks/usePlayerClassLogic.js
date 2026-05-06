import { useState, useRef } from 'react';

export function usePlayerClassLogic(playerClass, initialShownLevel = 0, initialShownSubclass = '') {
    const userOverrodeLevel = useRef(false);
    const [shownLevel, setShownLevel] = useState(() => initialShownLevel > 0 ? initialShownLevel : 1);
    const [isExpanded, setIsExpanded] = useState(() => !!initialShownLevel);
    const [shownSubclass, setShownSubclass] = useState(initialShownSubclass);

    const getNameString = (names) => {
        if (!names || names.length === 0) return '';
        let nameString = '';
        names.forEach((name) => {
            nameString += `${name}, `;
        });
        return nameString.substring(0, nameString.length - 2);
    };

    const getPrerequisites = (prerequisites) => {
        if (!prerequisites || prerequisites.length === 0) return '';
        let prerequisitesText = '';
        prerequisites.forEach((prerequisite) => {
            switch (prerequisite.type) {
                case 'feature':
                    prerequisitesText += `feature ${prerequisite.feature.substr(14)}, `;
                    break;
                case 'level':
                    break;
                case 'proficiency':
                    prerequisitesText += `proficiency ${prerequisite.proficiency.substr(19)}, `;
                    break;
                case 'Spell':
                    prerequisitesText += `spell ${prerequisite.spell.substr(12)}, `;
                    break;
                default:
                    prerequisitesText += `${prerequisite.type} ${prerequisite[Object.keys(prerequisite).find(key => key !== 'type')]} , `;
            }
        });
        return prerequisitesText.substring(0, prerequisitesText.length - 2);
    };

    const getSpells = (spells) => {
        if (!spells || spells.length === 0) return '';
        let spellNames = '';
        let lastFeature = '';
        let lastLevel = '';
        spells.forEach((spell) => {
            let level = spell.prerequisites[0].index;
            const levelIndex = level.indexOf('-');
            level = level.substring(levelIndex + 1, 2);
            let feature = '';
            if (spell.prerequisites[1]) {
                feature = spell.prerequisites[1].name;
                if (feature !== lastFeature) {
                    if (lastFeature !== '') {
                        spellNames += `<br/><br/>`;
                    }
                    spellNames += `<b>${feature}</b>:<br/>`;
                }
            }
            if (level !== lastLevel) {
                if (lastLevel !== '' && feature === lastFeature) {
                    spellNames += `<br/>`;
                }
                spellNames += `Level ${level}: ${spell.spell.name}`;
            } else {
                spellNames += `, ${spell.spell.name}`;
            }
            lastFeature = feature;
            lastLevel = level;
        });
        return spellNames;
    };

    const updateFeatures = () => {
        if (!playerClass.class_levels) return [];
        
        const classLevels = playerClass.class_levels.filter((classLevel) => classLevel.level <= shownLevel);
        // Go through levels highest to lowest so is an ability increases at higher levels, that is the one retained in the array
        let classFeatures = [];
        for (let i = classLevels.length - 1; i >= 0; i--) {
            if (classLevels[i].features) {
                classLevels[i].features.forEach((feature) => {
                    const featureSummary = {
                        name: feature.name,
                        description: feature.description,
                        details: feature.details
                     };
                    if (!classFeatures.some((classFeature) => classFeature.name === feature.name)) {
                        classFeatures.push(featureSummary);
                     }
                  });
              }
          }
        return classFeatures;
     };

    const updateSubclassFeatures = () => {
        if (!shownSubclass || !playerClass.subclasses) return [];
        
        const subclass = playerClass.subclasses.find((clonedSubclass) => clonedSubclass.index === shownSubclass);
        if (!subclass || !subclass.class_levels) return [];

        const subclassLevels = subclass.class_levels.filter((classLevel) => classLevel.level <= shownLevel);
        let subclassFeatures = [];
        for (let i = subclassLevels.length - 1; i >= 0; i--) {
            if (subclassLevels[i].features) {
                subclassLevels[i].features.forEach((feature) => {
                    const featureSummary = {
                        name: feature.name,
                        description: feature.description,
                        details: feature.details
                    };
                    if (!subclassFeatures.some((subclassFeature) => subclassFeature.name === feature.name)) {
                        subclassFeatures.push(featureSummary);
                    }
                });
            }
        }
        return subclassFeatures;
    };

    const toggleDetails = () => {
        userOverrodeLevel.current = true;
        setIsExpanded(!isExpanded);
    };

    const showLevel = (level) => {
        userOverrodeLevel.current = true;
        if (level === shownLevel) {
            setShownLevel(0);
        } else {
            setShownLevel(level);
        }
    };

    const showSubclass = (subclassIndex) => {
        if (subclassIndex === shownSubclass) {
            setShownSubclass('');
        } else {
            setShownSubclass(subclassIndex);
        }
    };

    const classFeatures = updateFeatures();
    const subclassFeatures = updateSubclassFeatures();

    return {
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
    };
}
