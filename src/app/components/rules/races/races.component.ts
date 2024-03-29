﻿import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
  selector: 'app-races',
  styleUrls: ['./races.component.scss'],
  templateUrl: './races.component.html'
})
export class RacesComponent implements OnInit, OnDestroy {
  races: any[] = [];
  shownCard = '';
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getRaces()
    ]).subscribe((data: any) => {
      this.races = data[0];
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  expandCard(index: string, expanded: boolean) {
    if(expanded) {
      this.shownCard=index;
      utils.scrollIntoView(index);
    }
  }

}
