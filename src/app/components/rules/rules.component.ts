import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-rules',
  styleUrls: ['./rules.component.scss'],
  templateUrl: './rules.component.html'
})
export class RulesComponent implements OnInit, OnDestroy {
  rules: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getRules()
    ]).subscribe((data: any) => {
      this.rules = data[0];
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
