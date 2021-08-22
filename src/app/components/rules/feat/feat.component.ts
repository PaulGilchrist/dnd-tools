import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-feat',
  styleUrls: ['./feat.component.scss'],
  templateUrl: './feat.component.html'
})
export class FeatComponent {

  @Input() feat: any = null;
  @Input() expand = false;
  @Output() expanded = new EventEmitter<boolean>();

  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

}
