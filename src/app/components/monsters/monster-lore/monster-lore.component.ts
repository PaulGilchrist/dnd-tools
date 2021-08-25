import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'monster-lore',
  styleUrls: ['./monster-lore.component.scss'],
  templateUrl: './monster-lore.component.html'
})
export class MonsterLoreComponent implements OnInit, OnDestroy {
  monsters: any[] = [];
  monsterSubtypes: any[] = [];
  subscriptions: Subscription[] = [];
  shownCard = '';
  shownSubtype = '';

  constructor(private router: Router, public domSanitizer: DomSanitizer, public dataService: DataService) { }

  ngOnInit(): void {
    window.history.forward();
    this.subscriptions.push(combineLatest([
      this.dataService.getMonsters(),
      this.dataService.getMonsterSubtypes()
    ]).subscribe((data: any) => {
      this.monsters = data[0];
      this.monsterSubtypes = data[1];
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

  showSubtype(subtype: string) {
    if(this.shownSubtype == subtype) {
      this.shownSubtype = '';
    } else {
      this.shownSubtype = subtype;
      setTimeout(() => {
          // We have to wait until after the card has expanded before scrolling
          // We don't need to wait any set amount of time, just want to place in queue so Angular goes first
          const card = document.getElementById(subtype);
          if(card) {        
            card.scrollIntoView(true);
            // Scroll down just enough to clear the header
            window.scrollBy(0, -60);
          }
      }, 0);
    }
  }
  
}
