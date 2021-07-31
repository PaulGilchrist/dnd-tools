import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'player-classes',
  styleUrls: ['./player-classes.component.scss'],
  templateUrl: './player-classes.component.html'
})
export class PlayerClassesComponent implements OnInit, OnDestroy {
  playerClasses: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getPlayerClasses()
    ]).subscribe((data: any) => {
      this.playerClasses = data[0];
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
