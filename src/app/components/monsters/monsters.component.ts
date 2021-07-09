import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-monsters',
  styleUrls: ['./monsters.component.scss'],
  templateUrl: './monsters.component.html'
})
export class MonstersComponent implements OnInit, OnDestroy {
  monsters: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getMonsters()
    ]).subscribe((data: any) => {
      this.monsters = data[0];
      // Set search filters
      // Set bookmarked monsters
      let bookmarkedJson = localStorage.getItem('bookmarkedMonsters');
      let bookmarkedMonsters: string[] = [];
      if(bookmarkedJson != null) {
        bookmarkedMonsters = JSON.parse(bookmarkedJson);
      }
      this.monsters.forEach(monster => {
        monster.bookmarked = bookmarkedMonsters.includes(monster.index);
      })
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterChanged(): void {
  }

  saveBookmark() {
    let bookmarkedMonsters: string[] = [];
    this.monsters.forEach(monster => {
      if(monster.bookmarked == true) {
        bookmarkedMonsters.push(monster.index);
      }
    })
    localStorage.setItem('bookmarkedMonsters', JSON.stringify(bookmarkedMonsters));
  }

  showMonster(monster: any) {
    let showMonster = true;
    // First filter
    if (false) {
      return false;
    }
    return showMonster;
  }

}
