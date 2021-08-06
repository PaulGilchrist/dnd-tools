import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'equipment-item',
  styleUrls: ['./equipment-item.component.scss'],
  templateUrl: './equipment-item.component.html'
})
export class EquipmentItemComponent {

  @Input() equipmentItem: any = null;
  @Input() expand = false;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the equipment is bookmarked for the current session
  @Output() expanded = new EventEmitter<boolean>();

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
  
  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

  toggleBookmark(equipmentItem: any) {
    equipmentItem.bookmarked = !equipmentItem.bookmarked;
    this.bookmarkChanged.emit(equipmentItem.bookmarked);
  }

}
