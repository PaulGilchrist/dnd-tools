import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { cloneDeep, merge, uniqBy } from 'lodash';
declare const utils: any // Javascript utilities

@Component({
    selector: 'player-class',
    styleUrls: ['./player-class.component.scss'],
    templateUrl: './player-class.component.html'
})
export class PlayerClassComponent implements OnChanges {

    @Input() expand = false;
    @Input() playerClass: any = null;
    @Output() expanded = new EventEmitter<boolean>();
    classFeatures: any = null;
    subclassFeatures: any = null;
    shownLevel = 0;
    shownSubclass = '';

    constructor(public domSanitizer: DomSanitizer) { }

    ngOnChanges(changes: SimpleChanges): void {
    }

    getNameString(names: string[]) {
        let nameString = '';
        names.forEach((name: string) => {
            nameString += `${name}, `;
        });
        return nameString.substr(0, nameString.length - 2);
    }

    getPrerequisites(feature: any) {
        let prerequisitesText = '';
        feature.prerequisites.forEach((prerequisite: any) => {
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
            }
        });
        return prerequisitesText.substr(0, prerequisitesText.length - 2);
    }

    getSpells(spells: any) {
        let spellNames = '';
        let lastFeature = '';
        let lastLevel = '';
        spells.forEach((spell: any) => {
            let level = spell.prerequisites[0].index;
            const levelIndex = level.indexOf('-');
            level = level.substr(levelIndex + 1, 2);
            let feature = '';
            if (spell.prerequisites[1]) {
                feature = spell.prerequisites[1].name;
                if (feature != lastFeature) {
                    if (lastFeature != '') {
                        spellNames += `<br/><br/>`;
                    }
                    spellNames += `<b>${feature}</b>:<br/>`;
                }
            }
            if (level != lastLevel) {
                if (lastLevel != '' && feature == lastFeature) {
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
    }

    toggleDetails() {
        this.expand = !this.expand;
        this.expanded.emit(this.expand);
    }
    updateFeatures() {
        const classLevels = this.playerClass.class_levels.filter((classLevel: any) => classLevel.level <= this.shownLevel);
        // Go through levels highest to lowest so is an ability increases at higher levels, that is the one retained in the array
        this.classFeatures = [];
        for (let i = classLevels.length - 1; i >= 0; i--) {
            classLevels[i].features.forEach((feature: any) => {
                const featureSummary = {
                    name: feature.name,
                    description: feature.desc,
                    details: feature.details
                };
                if (!this.classFeatures.some((classFeature: any) => classFeature.name == feature.name)) {
                    this.classFeatures.push(featureSummary);
                }
            });
        }
        if (this.shownSubclass != '') {
            const subclassLevels = this.playerClass.subclasses.find((clonedSubclass: any) => clonedSubclass.index === this.shownSubclass).class_levels.filter((classLevel: any) => classLevel.level <= this.shownLevel);;
            this.subclassFeatures = [];
            for (let i = subclassLevels.length - 1; i >= 0; i--) {
                subclassLevels[i].features.forEach((feature: any) => {
                    const featureSummary = {
                        name: feature.name,
                        description: feature.desc,
                        details: feature.details
                    };
                    if (!this.subclassFeatures.some((subclassFeature: any) => subclassFeature.name == feature.name)) {
                        this.subclassFeatures.push(featureSummary);
                    }
                });
            }
        }
    }
    showLevel(level: any) {
        if (level == this.shownLevel) {
            this.shownLevel = 0;
        } else {
            this.shownLevel = level;
            this.updateFeatures();
            utils.scrollIntoView(level, 120);
        }
    }
    showSubclass(subclass: string) {
        if (subclass == this.shownSubclass) {
            this.shownSubclass = '';
        } else {
            this.shownSubclass = subclass;
            this.updateFeatures();
            utils.scrollIntoView(subclass, 120);
        }
    }

}
