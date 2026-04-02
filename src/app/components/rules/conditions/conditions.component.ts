import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
    selector: 'app-conditions',
    styleUrls: ['./conditions.component.css'],
    templateUrl: './conditions.component.html',
    standalone: false
})
export class ConditionsComponent implements OnInit, OnDestroy {
  conditions: any[] = [];
  shownCard = '';
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getConditions()
    ]).subscribe((data: any) => {
      this.conditions = data[0];
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  expandCard(index: string, event: any) {
    const expanded = event.detail?.expanded ?? false;
    if(expanded) {
      this.shownCard=index;
      utils.scrollIntoView(index);
    }
  }

}

