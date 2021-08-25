import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
  selector: 'monster-search',
  styleUrls: ['./monster-search.component.scss'],
  templateUrl: './monster-search.component.html'
})
export class MonsterSearchComponent implements OnInit, OnDestroy {
  filter = {
    bookmarked: 'All',
    challengeRatingMin: 0,
    challengeRatingMax: 25,
    environment: 'All',
    name: '',
    size: 'All',
    type: 'All',
    xpMin: 0,
    xpMax: 50000,
  }
  monsters: any[] = [];
  shownCard = '';
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    window.history.forward();
    this.subscriptions.push(combineLatest([
      this.dataService.getMonsters()
    ]).subscribe((data: any) => {
      this.monsters = data[0];
      console.log(`${this.monsters.length} monsters`);
      // console.log('monsters missing images listed below:');
      // console.log(this.monsters.filter(m => m.image!=true));
      // Set search filters
      let filter = localStorage.getItem('monsterFilter');
      if(filter) {
        this.filter = JSON.parse(filter);
      } else {
        localStorage.setItem('monsterFilter', JSON.stringify(this.filter));
      }
      // Set bookmarked monsters
      let monstersBookmarkedJson = localStorage.getItem('monstersBookmarked');
      let monstersBookmarked: string[] = [];
      if(monstersBookmarkedJson != null) {
        monstersBookmarked = JSON.parse(monstersBookmarkedJson);
      }
      this.monsters.forEach(monster => {
        monster.bookmarked = monstersBookmarked.includes(monster.index);
      })
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
  
  filterChanged(): void {
    localStorage.setItem('monsterFilter', JSON.stringify(this.filter));
  }

  saveBookmark() {
    let monstersBookmarked: string[] = [];
    this.monsters.forEach(monster => {
      if(monster.bookmarked == true) {
        monstersBookmarked.push(monster.index);
      }
    })
    localStorage.setItem('monstersBookmarked', JSON.stringify(monstersBookmarked));
  }

  showMonster(monster: any) {
    // Bookmarked filter
    if (this.filter.bookmarked != 'All' && !monster.bookmarked) {
      return false;
    }
    // Challenge Range
    if (monster.challenge_rating < this.filter.challengeRatingMin || monster.challenge_rating > this.filter.challengeRatingMax) {
      return false;
    }
    // Environment filter
    if (this.filter.environment != 'All' &&  (!monster.environments || !monster.environments.includes(this.filter.environment))) {
      return false;
    }
    // Name filter
    if (this.filter.name != '' &&  !monster.name.toLowerCase().includes(this.filter.name.toLowerCase())) {
      return false;
    }
    // Size filter
    if (this.filter.size != 'All' && this.filter.size != monster.size) {
      return false;
    }
    // Type filter
    if (this.filter.type != 'All' && this.filter.type != monster.type) {
      return false;
    }
    // XP
    if (monster.xp < this.filter.xpMin || monster.xp > this.filter.xpMax) {
      return false;
    }
    return true;
  }

}
