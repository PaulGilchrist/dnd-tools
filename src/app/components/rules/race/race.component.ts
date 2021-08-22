import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-race',
  styleUrls: ['./race.component.scss'],
  templateUrl: './race.component.html'
})
export class RaceComponent implements OnChanges {

  @Input() expand = false;
  @Input() race: any = null;
  @Output() expanded = new EventEmitter<boolean>();

  constructor(public domSanitizer: DomSanitizer) {}

  ngOnChanges() {
    // console.log(this.race);
  }

  getAbilityBonuses(ability_bonuses: any) {
    let abilityBonuses = '';
    ability_bonuses.forEach((abilityBonus: any) => {
      abilityBonuses += `+${abilityBonus.bonus} ${abilityBonus.ability_score}, `;
    });
    return abilityBonuses.substr(0, abilityBonuses.length-2);
  }

  getAbilityBonusOptions(ability_bonus_options: any) {
    let abilityBonusOptions = '';
    if(ability_bonus_options) {
      abilityBonusOptions += `Choose ${this.race.language_options.choose} - `;
      this.race.ability_bonus_options.from.forEach((abilityBonusOption: any) => {
        abilityBonusOptions += `${abilityBonusOption.ability_score}, `;
      });
    }
    return abilityBonusOptions.substr(0, abilityBonusOptions.length-2);
  }
  
  getNameString(names: string[]) {    
    let nameString = '';
    names.forEach((name: string) => {
      nameString += `${name}, `;
    });
    return nameString.substr(0, nameString.length-2);
  }

  getTraitOptions() {
    let traitOptions = '';
    if(this.race.trait_options) {
      traitOptions += `Choose ${this.race.trait_options.choose} - `;
      this.race.trait_options.from.forEach((traitOption: string) => {
        traitOptions += `${traitOption}, `;
      });
    }
    return traitOptions.substr(0, traitOptions.length-2);
  }

  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

}
