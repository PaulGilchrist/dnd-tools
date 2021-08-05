import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'player-class',
  styleUrls: ['./player-class.component.scss'],
  templateUrl: './player-class.component.html'
})
export class PlayerClassComponent implements OnChanges{

  @Input() playerClass: any = null;

  shownLevel: string = '';

  ngOnChanges() {
    // console.log(this.playerClass);
  }

  getProficiencies() {
    let proficiencies = '';
    this.playerClass.proficiencies.forEach((proficiency: string) => {
      proficiencies += `${proficiency}, `;
    });
    return proficiencies.substr(0, proficiencies.length - 2);
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

  getProficiencyChoiceText(proficiencyChoice: any) {
    let proficiencyChoiceText = `Choose ${proficiencyChoice.choose} - `;
    proficiencyChoice.from.forEach((from: string) => {
      proficiencyChoiceText += `${from}, `;
    });
    return proficiencyChoiceText.substr(0, proficiencyChoiceText.length - 2);
  }

  getSavingThrows() {
    let savingThrows = '';
    this.playerClass.saving_throws.forEach((savingThrow: string) => {
      savingThrows += `${savingThrow}, `;
    });
    return savingThrows.substr(0, savingThrows.length - 2);
  }

  showLevel(level: string) {
    if(this.shownLevel == level) {
      this.shownLevel = '';
    } else {
      this.shownLevel = level;
    }
  }

  toggleDetails(playerClass: any) {
    if (playerClass.ui) {
      playerClass.ui.show = !playerClass.ui.show;
    } else {
      playerClass.ui = {};
      playerClass.ui.show = true;
    }
  }

}
