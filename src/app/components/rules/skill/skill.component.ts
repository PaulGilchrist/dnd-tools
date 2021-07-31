import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill',
  styleUrls: ['./skill.component.scss'],
  templateUrl: './skill.component.html'
})
export class SkillComponent {

  @Input() skill: any = null;

  getAbilityFullName(name: string) {
    switch (name) {
      case 'STR':
        return 'Strength';
      case 'DEX':
        return 'Dexterity';
      case 'CON':
        return 'Constitution';
      case 'WIS':
        return 'Wisdon';
      case 'INT':
        return 'Intelligence';
      case 'CHA':
        return 'Charisma';
      default:
        return '';
    }
  }

  toggleDetails(skill: any) {
    if (skill.ui) {
      skill.ui.show = !skill.ui.show;
    } else {
      skill.ui = {};
      skill.ui.show = true;
    }
  }

}
