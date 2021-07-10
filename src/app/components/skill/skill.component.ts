import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill',
  styleUrls: ['./skill.component.scss'],
  templateUrl: './skill.component.html'
})
export class SkillComponent {

  @Input() skill: any = null;

  toggleDetails(skill: any) {
    if (skill.ui) {
      skill.ui.show = !skill.ui.show;
    } else {
      skill.ui = {};
      skill.ui.show = true;
    }
  }

}
