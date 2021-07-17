import { Component, Input } from '@angular/core';

@Component({
  selector: 'player-class',
  styleUrls: ['./player-class.component.scss'],
  templateUrl: './player-class.component.html'
})
export class PlayerClassComponent {

  @Input() playerClass: any = null;

  getProficiencies() {
    let proficiencies = '';
    this.playerClass.proficiencies.forEach((proficiency: any) => {
      proficiencies += `${proficiency.name}, `;
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
    proficiencyChoice.from.forEach((from: any) => {
      proficiencyChoiceText += `${from.name}, `;
    });
    return proficiencyChoiceText.substr(0, proficiencyChoiceText.length - 2);
  }

  getSavingThrows() {
    let savingThrows = '';
    this.playerClass.saving_throws.forEach((savingThrow: any) => {
      savingThrows += `${savingThrow.name}, `;
    });
    return savingThrows.substr(0, savingThrows.length - 2);
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
