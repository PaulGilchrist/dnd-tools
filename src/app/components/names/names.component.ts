import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'race-names',
  styleUrls: ['./names.component.scss'],
  templateUrl: './names.component.html'
})
export class NamesComponent implements OnInit, OnDestroy {
  names: any[] = [];
  namesUsed: string[] = [];
  shownNames = {
    familyType: null,
    firstNames: [],
    lastNames: []
  };
  filter = {
    race: 'Select',
    sex: 'Select',
    used: 'All'
  }
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getNames()
    ]).subscribe((data: any) => {
      this.names = data[0];
      // Set search filters
      let filterJson = localStorage.getItem('namesFilter');
      if(filterJson) {
        this.filter = JSON.parse(filterJson);
      } else {
        localStorage.setItem('namesFilter', JSON.stringify(this.filter));
      }
      // Set used names
      let namesUsedJson = localStorage.getItem('namesUsed');
      if(namesUsedJson != null) {
        this.namesUsed = JSON.parse(namesUsedJson);
      }
      this.getNames();
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterChanged(): void {
    localStorage.setItem('namesFilter', JSON.stringify(this.filter));
    this.getNames();
  }

  getNames() {
    this.shownNames = {
      familyType: null,
      firstNames: [],
      lastNames: []
    };
    if(this.filter.race != 'Select' && this.filter.sex != 'Select') {
      const raceNames = this.names.find(n => n.index==this.filter.race);
      if(raceNames) {
        const firstNames = this.filter.sex=='female' ? raceNames.lists.females : raceNames.lists.males;
        switch(this.filter.used){
          case 'available':        
            this.shownNames.firstNames = firstNames.filter((n: string) => !this.namesUsed.includes(n));
            break;
          case 'used':
            this.shownNames.firstNames = firstNames.filter((n: string) => this.namesUsed.includes(n));
            break;
          default:
            this.shownNames.firstNames = firstNames;
        }
        if(raceNames.family_type) {
          this.shownNames.familyType = raceNames.family_type;
          switch(this.filter.used){
            case 'available':        
              this.shownNames.lastNames = raceNames.lists.family.filter((n: string) => !this.namesUsed.includes(n));
              break;
            case 'used':
              this.shownNames.lastNames = raceNames.lists.family.filter((n: string) => this.namesUsed.includes(n));
              break;
            default:
              this.shownNames.lastNames = raceNames.lists.family;
          }
        }
      }
    }
  }

  isNameUsed(name: string): boolean {
    return this.namesUsed.includes(name);
  }
  
  toggleUsed(name: string) {
    // If the name is in the list, remove it otherwise add it
    const index = this.namesUsed.indexOf(name);
    if(index == -1) {
      this.namesUsed.push(name);
    } else {
      this.namesUsed.splice(index, 1);
    }
    localStorage.setItem('namesUsed', JSON.stringify(this.namesUsed));
  }

}
