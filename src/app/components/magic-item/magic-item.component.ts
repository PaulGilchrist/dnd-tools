import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'magic-item',
  styleUrls: ['./magic-item.component.scss'],
  templateUrl: './magic-item.component.html'
})
export class MagicItemComponent {

  @Input() magicItem: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the magicItem is bookmarked for the current session
  
  toggleDetails(magicItem: any) {
    if (magicItem.ui) {
      magicItem.ui.show = !magicItem.ui.show;
    } else {
      magicItem.ui = {};
      magicItem.ui.show = true;
    }
  }

  toggleBookmark(magicItem: any) {
    magicItem.bookmarked = !magicItem.bookmarked;
    this.bookmarkChanged.emit(magicItem.bookmarked);
  }

}
