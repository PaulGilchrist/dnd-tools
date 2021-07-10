import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'equipment-items',
  styleUrls: ['./equipment-items.component.scss'],
  templateUrl: './equipment-items.component.html'
})
export class EquipmentItemsComponent implements OnInit, OnDestroy {
  equipmentItems: any[] = [];
  subscriptions: Subscription[] = [];
  filter = {
    category: 'All',
    bookmarked: 'All',
    name: '',
    property: 'All',
    range: 'All'
  }

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getEquipment()
    ]).subscribe((data: any) => {
      this.equipmentItems = data[0];
      // Set search filters
      let filter = localStorage.getItem('equipmentItemsFilter');
      if(filter) {
        this.filter = JSON.parse(filter);
      } else {
        localStorage.setItem('equipmentItemsFilter', JSON.stringify(this.filter));
      }
      // Set bookmarked monsters
      let equipmentItemsBookmarkedJson = localStorage.getItem('equipmentItemsBookmarked');
      let equipmentItemsBookmarked: string[] = [];
      if(equipmentItemsBookmarkedJson != null) {
        equipmentItemsBookmarked = JSON.parse(equipmentItemsBookmarkedJson);
      }
      this.equipmentItems.forEach(equipmentItems => {
        equipmentItems.bookmarked = equipmentItemsBookmarked.includes(equipmentItems.index);
      })
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterChanged(): void {
    localStorage.setItem('equipmentItemsFilter', JSON.stringify(this.filter));
  }

  saveBookmark() {
    let equipmentItemsBookmarked: string[] = [];
    this.equipmentItems.forEach(equipmentItem => {
      if(equipmentItem.bookmarked == true) {
        equipmentItemsBookmarked.push(equipmentItem.index);
      }
    })
    localStorage.setItem('equipmentItemsBookmarked', JSON.stringify(equipmentItemsBookmarked));
  }

  showEquipmentItem(equipmentItem: any) {
    // Bookmarked filter
    if (this.filter.bookmarked != 'All' && !equipmentItem.bookmarked) {
      return false;
    }
    // Category filter
    if (this.filter.category != 'All' && equipmentItem.equipment_category.name != this.filter.category) {
      return false;
    }
    // Property filter
    // @ts-ignore
    if (this.filter.category == 'Weapon' && this.filter.property != 'All' && !equipmentItem.properties.some(p => p.name == this.filter.property)) {
      return false;
    }
    // Name filter
    if (this.filter.name != '' && !equipmentItem.name.toLowerCase().includes(this.filter.name.toLowerCase())) {
      return false;
    }
    // Range filter
    if (this.filter.category == 'Weapon' && this.filter.range != 'All' && equipmentItem.weapon_range != this.filter.range) {
      return false;
    }
    return true;
  }

}
