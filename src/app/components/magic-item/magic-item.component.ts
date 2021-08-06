import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'magic-item',
  styleUrls: ['./magic-item.component.scss'],
  templateUrl: './magic-item.component.html'
})
export class MagicItemComponent {

  @Input() expand = false;
  @Input() magicItem: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the magicItem is bookmarked for the current session
  @Output() expanded = new EventEmitter<boolean>();
  
  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

  toggleBookmark(magicItem: any) {
    magicItem.bookmarked = !magicItem.bookmarked;
    this.bookmarkChanged.emit(magicItem.bookmarked);
  }

}
