import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-traits',
  styleUrls: ['./traits.component.scss'],
  templateUrl: './traits.component.html'
})
export class TraitsComponent implements OnInit, OnDestroy {
  traits: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getTraits()
    ]).subscribe((data: any) => {
      this.traits = data[0];
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
