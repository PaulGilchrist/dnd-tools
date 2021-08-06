import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-condition',
  styleUrls: ['./condition.component.scss'],
  templateUrl: './condition.component.html'
})
export class ConditionComponent {

  @Input() condition: any = null;
  @Input() expand = false;
  @Output() expanded = new EventEmitter<boolean>();

  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

}
