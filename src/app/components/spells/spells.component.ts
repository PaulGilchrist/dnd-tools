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
  ritual: number = 2; // 0=false, 1=true, 2=either
  spells: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptions.push(combineLatest([
      this.dataService.getSpells()
    ]).subscribe((data: any) => {
      this.spells = data[0];
      console.log(this.spells);
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to avoid memory leak
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
    // Ritual filter
    if (this.ritual != 2 && ((this.ritual == 1 && !spell.ritual) || (this.ritual == 0 && spell.ritual))) {
      return false;
    }
    return showSpell;
  }

}
