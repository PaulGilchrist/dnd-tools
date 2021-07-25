import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-monster',
  styleUrls: ['./monster.component.scss'],
  templateUrl: './monster.component.html'
})
export class MonsterComponent {

  @Input() monster: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the monster is bookmarked for the current session

  modalActive = true;
  
  getAbilityModifier(abilityScore: number) {
    return Math.floor((abilityScore-10)/2);
  }

  getConditionImmunities() {
    let conditionImmunities = '';
    this.monster.condition_immunities.forEach((conditionImmunity: any) => {
      conditionImmunities += `${conditionImmunity.name.toLowerCase()}, `;
    });
    return conditionImmunities.substr(0, conditionImmunities.length-2);
  }

  getDamageImmunities() {
    let damageImmunities = '';
    this.monster.damage_immunities.forEach((damageImmunity: string) => {
      damageImmunities += `${damageImmunity}, `;
    });
    return damageImmunities.substr(0, damageImmunities.length-2);
  }

  getDamageResistances() {
    let damageResistances = '';
    this.monster.damage_resistances.forEach((damageResistance: string) => {
      damageResistances += `${damageResistance}, `;
    });
    return damageResistances.substr(0, damageResistances.length-2);
  }

  getDamageVulnerabilities() {
    let damageVulnerabilities = '';
    this.monster.damage_vulnerabilities.forEach((damageVulnerability: string) => {
      damageVulnerabilities += `${damageVulnerability}, `;
    });
    return damageVulnerabilities.substr(0, damageVulnerabilities.length-2);
  }

  getSavingThrows() {
    let savingThrows = '';
    this.monster.proficiencies.forEach((o: any) => {
      if(o.proficiency.index.startsWith('saving-throw')) {
        savingThrows += `${o.proficiency.name.substr(14,3)} +${o.value}, `;
      }
    });
    return savingThrows.substr(0, savingThrows.length-2);
  }

  getSenses() {
    let senses = '';    
    if(this.monster.senses.blindsight) {
      senses += `blindsight ${this.monster.senses.blindsight}, `;
    }
    if(this.monster.senses.darkvision) {
      senses += `darkvision ${this.monster.senses.darkvision}, `;
    }
    if(this.monster.senses.passive_perception) {
      senses += `passive perception ${this.monster.senses.passive_perception}, `;
    }
    if(this.monster.senses.tremorsense) {
      senses += `tremorsense ${this.monster.senses.tremorsense}, `;
    }
    if(this.monster.senses.truesight) {
      senses += `truesight ${this.monster.senses.truesight}, `;
    }
    return senses.substr(0, senses.length-2);
  }

  getSkills() {
    let skills = '';
    this.monster.proficiencies.forEach((o: any) => {
      if(o.proficiency.index.startsWith('skill')) {
        skills += `${o.proficiency.name.substr(7,o.proficiency.name.length-7)} +${o.value}, `;
      }
    });
    return skills.substr(0, skills.length-2);
  }

  hasSavingThrows() {
    let hasSavingThrows = false;
    this.monster.proficiencies.forEach((o: any) => {
      if(o.proficiency.index.startsWith('saving-throw')) {
        hasSavingThrows = true;
      }
    });
    return hasSavingThrows;
  }

  hasSkills() {
    let hasSkills = false;
    this.monster.proficiencies.forEach((o: any) => {
      if(o.proficiency.index.startsWith('skill')) {
        hasSkills = true;
      }
    });
    return hasSkills;
  }

  toggleDetails(monster: any) {
    if (monster.ui) {
      monster.ui.show = !monster.ui.show;
    } else {
      monster.ui = {};
      monster.ui.show = true;
    }
  }

  toggleBookmark(monster: any) {
    monster.bookmarked = !monster.bookmarked;
    this.bookmarkChanged.emit(monster.bookmarked);
  }

}
