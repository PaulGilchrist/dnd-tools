import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from '../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
  selector: 'locations-lore',
  styleUrls: ['./locations.component.scss'],
  templateUrl: './locations.component.html'
})
export class LocationsComponent implements OnInit, OnDestroy {
  image = '';
  locations: any[] = [];
  subscriptions: Subscription[] = [];
  shownLocation = '';

  constructor(private router: Router, public domSanitizer: DomSanitizer, public dataService: DataService) { }

  ngOnInit(): void {
    window.history.forward();
    this.subscriptions.push(combineLatest([
      this.dataService.getLocations()
    ]).subscribe((data: any) => {
      this.locations = data[0];
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  showLocation(location: string) {
    if(this.shownLocation == location) {
      this.shownLocation = '';
    } else {
      this.shownLocation = location;
      utils.scrollIntoView(location);
    }
  }
  
}
