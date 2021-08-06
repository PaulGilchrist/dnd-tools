import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'ability-score',
  styleUrls: ['./ability-score.component.scss'],
  templateUrl: './ability-score.component.html'
})
export class AbilityScoreComponent {

  @Input() abilityScore: any = null;
  @Input() expand = false;
  @Output() expanded = new EventEmitter<boolean>();

  getSkills() {
    let skills = '';
    this.abilityScore.skills.forEach((skill: string) => {
      skills += `${skill}, `;
    });
    return skills.substr(0, skills.length - 2);
  }

  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

}
