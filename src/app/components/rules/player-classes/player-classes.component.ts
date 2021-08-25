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
  shownCard = '';
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

  expandCard(index: string, expanded: boolean) {
    if(expanded) {
      this.shownCard=index;
      setTimeout(() => {
        // We have to wait until after the card has expanded before scrolling
        // We don't need to wait any set amount of time, just want to place in queue so Angular goes first
        const card = document.getElementById(index);
        if(card) {        
          card.scrollIntoView(true);
          // Scroll down just enough to clear the header
          window.scrollBy(0, -60);
        }
    }, 0);
    }
  }

}
