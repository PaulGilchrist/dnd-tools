import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-condition',
  styleUrls: ['./condition.component.scss'],
  templateUrl: './condition.component.html'
})
export class ConditionComponent {

  @Input() condition: any = null;

  toggleDetails(condition: any) {
    if (condition.ui) {
      condition.ui.show = !condition.ui.show;
    } else {
      condition.ui = {};
      condition.ui.show = true;
    }
  }

}
