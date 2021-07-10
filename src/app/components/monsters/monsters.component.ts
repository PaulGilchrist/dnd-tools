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
  filter = {
    bookmarked: 'All',
    challengeRatingMin: 0,
    challengeRatingMax: 25,
    name: '',
    size: 'All',
    type: 'All'
  }

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getMonsters()
    ]).subscribe((data: any) => {
      this.monsters = data[0];
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
    return true;
  }

}
