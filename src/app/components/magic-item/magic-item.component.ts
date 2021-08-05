import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'magic-item',
  styleUrls: ['./magic-item.component.scss'],
  templateUrl: './magic-item.component.html'
})
export class MagicItemComponent implements OnChanges {

  @Input() magicItem: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the magicItem is bookmarked for the current session
  
  ngOnChanges() {
    // console.log(this.magicItem);
  }
  
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
