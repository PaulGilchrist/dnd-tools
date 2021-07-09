import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-spells',
  styleUrls: ['./spells.component.scss'],
  templateUrl: './spells.component.html'
})
export class SpellsComponent implements OnInit, OnDestroy {
  castingTime: string = 'Any';
  class: string = 'All Spells';
  levels: number[] = [0, 1];
  spells: any[] = [];
  status: string = 'Prepared or Known Ritual'
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getSpells()
    ]).subscribe((data: any) => {
      this.spells = data[0];
      // Set search filters
      let castingTime = localStorage.getItem('castingTime');
      if(castingTime != null) {
        this.castingTime = castingTime;
      } else {
        localStorage.setItem('castingTime', this.castingTime);
      }
      let className = localStorage.getItem('class');
      if(className != null) {
        this.class = className;
      } else {
        localStorage.setItem('class', this.class);
      }
      let levelsJson = localStorage.getItem('levels');
      if(levelsJson != null) {
        this.levels = JSON.parse(levelsJson);
      } else {
        localStorage.setItem('levels', JSON.stringify(this.levels));
      }
      let status = localStorage.getItem('status');
      if(status != null) {
        this.status = status;
      } else {
        localStorage.setItem('status', this.status);
      }
      // Set known and prepared spells
      let knownJson = localStorage.getItem('knownSpells');
      let known: string[] = [];
      if(knownJson != null) {
        known = JSON.parse(knownJson);
      }
      let preparedJson = localStorage.getItem('preparedSpells');
      let prepared: string[] = [];
      if(preparedJson != null) {
        prepared = JSON.parse(preparedJson);
      }
      this.spells.forEach(spell => {
        spell.known = known.includes(spell.index);
        spell.prepared = prepared.includes(spell.index);
      })
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterChanged(): void {
    localStorage.setItem('castingTime', this.castingTime);
    localStorage.setItem('class', this.class);
    localStorage.setItem('levels', JSON.stringify(this.levels));
    localStorage.setItem('status', this.status);
  }

  showSpell(spell: any) {
    let showSpell = true;
    // Casting Time filter
    if (this.castingTime != 'Any'
        && (
              (this.castingTime == 'Action' && !(spell.casting_time == '1 action'))
              || (this.castingTime == 'Bonus Action' && !(spell.casting_time == '1 bonus action'))
              || (this.castingTime == 'Non-Ritual, Long Cast Time' && (spell.ritual || spell.casting_time == '1 action' || spell.casting_time == '1 bonus action' || spell.casting_time == '1 reaction' ))      
              || (this.castingTime == 'Reaction' && !(spell.casting_time == '1 reaction'))
              || (this.castingTime == 'Ritual' && !spell.ritual)
          )
    ) {
      return false;
    }
    // Class filter
    // @ts-ignore
    if (this.class != 'All Spells' && !spell.classes.some(c => c.name == this.class)) {
      return false;
    }
    // Level filter
    if (!this.levels.includes(spell.level)) {
      return false;
    }
    // Status filter
    if (this.status != 'Any'
        && (
              (this.status == 'Known' && !spell.known)
              || (this.status == 'Prepared or Known Ritual' && (!spell.known || (!spell.prepared && !spell.ritual)))
          )
    ) {
      return false;
    }
    return showSpell;
  }

  saveKnown() {
    let known: string[] = [];
    this.spells.forEach(spell => {
      if(spell.known == true) {
        known.push(spell.index);
      }
    })
    localStorage.setItem('knownSpells', JSON.stringify(known));
  }

  savePrepared() {
    let prepared: string[] = [];
    this.spells.forEach(spell => {
      if(spell.prepared == true) {
        prepared.push(spell.index);
      }
    })
    localStorage.setItem('preparedSpells', JSON.stringify(prepared));
  }
}
