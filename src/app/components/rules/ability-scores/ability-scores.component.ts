import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../../services/data.service';
declare const utils: any // Javascript utilities

@Component({
  selector: 'ability-scores',
  styleUrls: ['./ability-scores.component.scss'],
  templateUrl: './ability-scores.component.html'
})
export class AbilityScoresComponent implements OnInit, OnDestroy {
  abilityScores: any[] = [];
  shownCard = '';
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getAbilityScores()
    ]).subscribe((data: any) => {
      this.abilityScores = data[0];
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
