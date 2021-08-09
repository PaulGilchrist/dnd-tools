import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'player-class',
  styleUrls: ['./player-class.component.scss'],
  templateUrl: './player-class.component.html'
})
export class PlayerClassComponent implements OnChanges {

  @Input() expand = false;
  @Input() playerClass: any = null;
  @Output() expanded = new EventEmitter<boolean>();
  shownLevel  = 0;
  shownSubclass  = '';

  ngOnChanges() {
    // console.log(this.playerClass);
  }

  getNameString(names: string[]) {    
    let nameString = '';
    names.forEach((name: string) => {
      nameString += `${name}, `;
    });
    return nameString.substr(0, nameString.length-2);
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
      level = level.substr(levelIndex+1, 2);
      let feature = '';
      if(spell.prerequisites[1]) {
        feature = spell.prerequisites[1].name;
        if(feature != lastFeature) {
          if(lastFeature != '') {
            spellNames += `<br/><br/>`;
          }
          spellNames += `<b>${feature}</b>:<br/>`;
        }
      }
      if(level != lastLevel) {
        if(lastLevel != '' && feature == lastFeature) {
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

  showLevel(level: number) {
    if(level == this.shownLevel) {
      this.shownLevel = 0;
    } else {
      this.shownLevel = level;
    }
  }
  showSubclass(subclass: string) {
    if(subclass == this.shownSubclass) {
      this.shownSubclass = '';
    } else {
      this.shownSubclass = subclass;
    }
  }

}
