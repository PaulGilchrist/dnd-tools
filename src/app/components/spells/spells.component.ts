import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-spells',
  styleUrls: ['./spells.component.scss'],
  templateUrl: './spells.component.html'
})
export class SpellsComponent implements OnInit, OnDestroy {
  filter = {
    castingTime: 'All',
    class: 'All',
    levelMin: 0,
    levelMax: 9,
    name: '',
    status: 'All'
  }
  spells: any[] = [];

  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getSpells()
    ]).subscribe((data: any) => {
      this.spells = data[0];
      // Set search filters
      let filter = localStorage.getItem('spellFilter');
      if(filter) {
        this.filter = JSON.parse(filter);
      } else {
        localStorage.setItem('spellFilter', JSON.stringify(this.filter));
      }
      // Set known and prepared spells
      let knownSpellsJson = localStorage.getItem('spellsKnown');
      let knownSpells: string[] = [];
      if(knownSpellsJson != null) {
        knownSpells = JSON.parse(knownSpellsJson);
      }
      let preparedSpellsJson = localStorage.getItem('spellsPrepared');
      let preparedSpells: string[] = [];
      if(preparedSpellsJson != null) {
        preparedSpells = JSON.parse(preparedSpellsJson);
      }
      this.spells.forEach(spell => {
        spell.known = knownSpells.includes(spell.index);
        spell.prepared = preparedSpells.includes(spell.index);
      })
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterChanged(): void {
    localStorage.setItem('spellFilter', JSON.stringify(this.filter));
  }

  showSpell(spell: any) {
    // Casting Time filter
    if (this.filter.castingTime != 'All'
        && (
              (this.filter.castingTime == 'Action' && !(spell.casting_time == '1 action'))
              || (this.filter.castingTime == 'Bonus Action' && !(spell.casting_time == '1 bonus action'))
              || (this.filter.castingTime == 'Non-Ritual, Long Cast Time' && (spell.ritual || spell.casting_time == '1 action' || spell.casting_time == '1 bonus action' || spell.casting_time == '1 reaction' ))      
              || (this.filter.castingTime == 'Reaction' && !(spell.casting_time == '1 reaction'))
              || (this.filter.castingTime == 'Ritual' && !spell.ritual)
          )
    ) {
      return false;
    }
    // Class filter
    // @ts-ignore
    if (this.filter.class != 'All' && !spell.classes.some(c => c.name == this.filter.class)) {
      return false;
    }
    // Level filter
    if (spell.level < this.filter.levelMin || spell.level > this.filter.levelMax) {
      return false;
    }
    // Name filter
    if (this.filter.name != '' && !spell.name.toLowerCase().includes(this.filter.name.toLowerCase())) {
      return false;
    }    
    // Status filter
    if (this.filter.status != 'All'
        && (
              (this.filter.status == 'Known' && !spell.known)
              || (this.filter.status == 'Prepared or Known Ritual' && (!spell.known || (!spell.prepared && !spell.ritual)))
          )
    ) {
      return false;
    }
    return true;
  }

  saveKnown() {
    let spellsKnown: string[] = [];
    this.spells.forEach(spell => {
      if(spell.known == true) {
        spellsKnown.push(spell.index);
      }
    })
    localStorage.setItem('spellsKnown', JSON.stringify(spellsKnown));
  }

  savePrepared() {
    let spellsPrepared: string[] = [];
    this.spells.forEach(spell => {
      if(spell.prepared == true) {
        spellsPrepared.push(spell.index);
      }
    })
    localStorage.setItem('spellsPrepared', JSON.stringify(spellsPrepared));
  }
}
