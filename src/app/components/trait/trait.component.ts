import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trait',
  styleUrls: ['./trait.component.scss'],
  templateUrl: './trait.component.html'
})
export class TraitComponent {

  @Input() trait: any = null;

  getProficiencies() {
    let proficiencies = '';
    this.trait.proficiencies.forEach((proficiency: any) => {
      proficiencies += `${proficiency.name}, `;
    });
    return proficiencies.substr(0, proficiencies.length-2);
  }

  getRaces() {
    let races = '';
    this.trait.races.forEach((race: any) => {
      races += `${race.name}, `;
    });
    return races.substr(0, races.length-2);
  }

  toggleDetails(trait: any) {
    if (trait.ui) {
      trait.ui.show = !trait.ui.show;
    } else {
      trait.ui = {};
      trait.ui.show = true;
    }
  }

}
