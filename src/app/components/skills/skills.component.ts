import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-skills',
  styleUrls: ['./skills.component.scss'],
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit, OnDestroy {
  skills: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getSkills()
    ]).subscribe((data: any) => {
      this.skills = data[0];
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
