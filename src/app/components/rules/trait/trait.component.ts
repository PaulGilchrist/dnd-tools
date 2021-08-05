import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-trait',
  styleUrls: ['./trait.component.scss'],
  templateUrl: './trait.component.html'
})
export class TraitComponent implements OnChanges {

  @Input() trait: any = null;

  ngOnChanges() {
    // console.log(this.trait);
  }


  getProficiencies() {
    let proficiencies = '';
    this.trait.proficiencies.forEach((proficiency: string) => {
      proficiencies += `${proficiency}, `;
    });
    return proficiencies.substr(0, proficiencies.length-2);
  }

  getRaces() {
    let races = '';
    this.trait.races.forEach((race: string) => {
      races += `${race}, `;
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
