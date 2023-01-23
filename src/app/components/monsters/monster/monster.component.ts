import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-monster',
  styleUrls: ['./monster.component.scss'],
  templateUrl: './monster.component.html'
})
export class MonsterComponent implements OnChanges {

  @Input() cardType = 'outer'; // inner or outer
  @Input() expand = false;
  @Input() monster: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the monster is bookmarked for the current session
  @Output() expanded = new EventEmitter<boolean>();
  imageActive = false;

  constructor(public domSanitizer: DomSanitizer) {}

  ngOnChanges() {
    // console.log(this.monster);
  }

  getAbilityModifier(abilityScore: number) {
    return Math.floor((abilityScore-10)/2);
  }
 
  getNameString(names: string[]) {    
    let nameString = '';
    names.forEach((name: string) => {
      nameString += `${name}, `;
    });
    return nameString.substr(0, nameString.length-2);
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
