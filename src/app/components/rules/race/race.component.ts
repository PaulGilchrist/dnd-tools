import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-race',
  styleUrls: ['./race.component.scss'],
  templateUrl: './race.component.html'
})
export class RaceComponent implements OnChanges {

  @Input() race: any = null;

  ngOnChanges() {
    // console.log(this.race);
  }

  getAbilityBonuses() {
    let abilityBonuses = '';
    this.race.ability_bonuses.forEach((abilityBonus: any) => {
      abilityBonuses += `+${abilityBonus.bonus} ${abilityBonus.ability_score}, `;
    });
    return abilityBonuses.substr(0, abilityBonuses.length-2);
  }

  getAbilityBonusOptions() {
    let abilityBonusOptions = '';
    if(this.race.ability_bonus_options) {
      abilityBonusOptions += `Choose ${this.race.language_options.choose} - `;
      this.race.ability_bonus_options.from.forEach((abilityBonusOption: any) => {
        abilityBonusOptions += `${abilityBonusOption.ability_score.name}, `;
      });
    }
    return abilityBonusOptions.substr(0, abilityBonusOptions.length-2);
  }
  
  getLanguages() {
    let languages = '';
    this.race.languages.forEach((language: string) => {
      languages += `${language}, `;
    });
    return languages.substr(0, languages.length-2);
  }
  
  getLanguageOptions() {
    let languageOptions = '';
    if(this.race.language_options) {
      languageOptions += `Choose ${this.race.language_options.choose} - `;
      this.race.language_options.from.forEach((languageOption: any) => {
        languageOptions += `${languageOption.name}, `;
      });
    }
    return languageOptions.substr(0, languageOptions.length-2);
  }
  
  getStartingProficiencies() {
    let startingProficiencies = '';
    this.race.starting_proficiencies.forEach((startingProficiency: string) => {
      startingProficiencies += `${startingProficiency}, `;
    });
    return startingProficiencies.substr(0, startingProficiencies.length-2);
  }

  getStartingProficiencyOptions() {
    let startingProficiencyOptions = '';
    if(this.race.starting_proficiency_options) {
      startingProficiencyOptions += `Choose ${this.race.starting_proficiency_options.choose} - `;
      this.race.starting_proficiency_options.from.forEach((startingProficiencyOption: string) => {
        startingProficiencyOptions += `${startingProficiencyOption}, `;
      });
    }
    return startingProficiencyOptions.substr(0, startingProficiencyOptions.length-2);
  }

  getTraits() {
    let traits = '';
    this.race.traits.forEach((trait: string) => {
      traits += `${trait}, `;
    });
    return traits.substr(0, traits.length-2);
  }

  getTraitOptions() {
    let traitOptions = '';
    if(this.race.trait_options) {
      traitOptions += `Choose ${this.race.language_options.choose} - `;
      this.race.trait_options.from.forEach((traitOption: string) => {
        traitOptions += `${traitOption}, `;
      });
    }
    return traitOptions.substr(0, traitOptions.length-2);
  }

  toggleDetails(race: any) {
    if (race.ui) {
      race.ui.show = !race.ui.show;
    } else {
      race.ui = {};
      race.ui.show = true;
    }
  }

}
