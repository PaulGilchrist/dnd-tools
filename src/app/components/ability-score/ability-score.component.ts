import { Component, Input } from '@angular/core';

@Component({
  selector: 'ability-score',
  styleUrls: ['./ability-score.component.scss'],
  templateUrl: './ability-score.component.html'
})
export class AbilityScoreComponent {

  @Input() abilityScore: any = null;

  getSkills() {
    let skills = '';
    this.abilityScore.skills.forEach((skill: any) => {
      skills += `${skill.name}, `;
    });
    return skills.substr(0, skills.length-2);
  }

  toggleDetails(abilityScore: any) {
    if (abilityScore.ui) {
      abilityScore.ui.show = !abilityScore.ui.show;
    } else {
      abilityScore.ui = {};
      abilityScore.ui.show = true;
    }
  }

}
