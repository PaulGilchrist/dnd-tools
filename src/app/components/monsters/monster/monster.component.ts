import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-monster',
  styleUrls: ['./monster.component.scss'],
  templateUrl: './monster.component.html'
})
export class MonsterComponent implements OnChanges {

  @Input() expand = false;
  @Input() monster: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the monster is bookmarked for the current session
  @Output() expanded = new EventEmitter<boolean>();
  modalActive = true;
  
  ngOnChanges() {
    // console.log(this.monster);
  }

  getAbilityModifier(abilityScore: number) {
    return Math.floor((abilityScore-10)/2);
  }

  getConditionImmunities() {
    let conditionImmunities = '';
    this.monster.condition_immunities.forEach((conditionImmunity: string) => {
      conditionImmunities += `${conditionImmunity.toLowerCase()}, `;
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

  getEnvironments() {
    let environments = '';
    this.monster.environments.forEach((environment: string) => {
      environments += `${environment}, `;
    });
    return environments.substr(0, environments.length-2);
  }
  
  getRelatedMonsters() {
    let relatedMonsters = '';
    this.monster.related_monsters.forEach((relatedMonster: any) => {
      relatedMonsters += `${relatedMonster.name}, `;
    });
    return relatedMonsters.substr(0, relatedMonsters.length-2);
  }
  
  getSavingThrows() {
    let savingThrows = '';
    this.monster.proficiencies.forEach((proficiency: any) => {
      if(proficiency.name.startsWith('Saving Throw:')) {
        savingThrows += `${proficiency.name.substr(14,3)} +${proficiency.value}, `;
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
    this.monster.proficiencies.forEach((proficiency: any) => {
      if(proficiency.name.startsWith('Skill:')) {
        skills += `${proficiency.name.substr(7,proficiency.name.length-7)} +${proficiency.value}, `;
      }
    });
    return skills.substr(0, skills.length-2);
  }

  hasSavingThrows() {
    let hasSavingThrows = false;
    this.monster.proficiencies.forEach((proficiency: any) => {
      if(proficiency.name.startsWith('Saving Throw:')) {
        hasSavingThrows = true;
      }
    });
    return hasSavingThrows;
  }

  hasSkills() {
    let hasSkills = false;
    this.monster.proficiencies.forEach((proficiency: any) => {
      if(proficiency.name.startsWith('Skill:')) {
        hasSkills = true;
      }
    });
    return hasSkills;
  }

  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

  toggleBookmark(monster: any) {
    monster.bookmarked = !monster.bookmarked;
    this.bookmarkChanged.emit(monster.bookmarked);
  }

}
