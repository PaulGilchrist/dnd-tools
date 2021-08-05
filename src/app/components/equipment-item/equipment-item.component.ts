import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'equipment-item',
  styleUrls: ['./equipment-item.component.scss'],
  templateUrl: './equipment-item.component.html'
})
export class EquipmentItemComponent implements OnChanges {

  @Input() equipmentItem: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the equipment is bookmarked for the current session
  
  ngOnChanges() {
    // console.log(this.equipmentItem);
  }

  getContents() {
    let contents = '';
    this.equipmentItem.contents.forEach((content: any) => {
      contents += `${content.quantity} ${content.item.name}, `;
    });
    return contents.substr(0, contents.length-2);
  }

  getProperties() {
    let properties = '';
    this.equipmentItem.properties.forEach((property: string) => {
      properties += `${property}, `;
    });
    return properties.substr(0, properties.length-2);
  }
  
  toggleDetails(equipmentItem: any) {
    if (equipmentItem.ui) {
      equipmentItem.ui.show = !equipmentItem.ui.show;
    } else {
      equipmentItem.ui = {};
      equipmentItem.ui.show = true;
    }
  }

  toggleBookmark(equipmentItem: any) {
    equipmentItem.bookmarked = !equipmentItem.bookmarked;
    this.bookmarkChanged.emit(equipmentItem.bookmarked);
  }

}
