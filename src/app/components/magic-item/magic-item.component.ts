import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'magic-item',
  styleUrls: ['./magic-item.component.scss'],
  templateUrl: './magic-item.component.html'
})
export class MagicItemComponent implements OnInit {

  @Input() magicItem: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the magicItem is bookmarked for the current session
  
  ngOnInit(): void {
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
