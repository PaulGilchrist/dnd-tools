import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-monster',
  styleUrls: ['./monster.component.scss'],
  templateUrl: './monster.component.html'
})
export class MonsterComponent implements OnInit {

  @Input() monster: any = null;
  @Output() readonly bookmarkChanged = new EventEmitter<boolean>(); // Bubble up that the monster is bookmarked for the current session
  
  ngOnInit(): void {
  }
  
  getAbilityModifier(abilityScore: number) {
    return Math.floor((abilityScore-10)/2);
  }

  toggleDetails(monster: any) {
    if (monster.ui) {
      monster.ui.show = !monster.ui.show;
    } else {
      monster.ui = {};
      monster.ui.show = true;
    }
  }

  toggleBookmark(monster: any) {
    monster.bookmarked = !monster.bookmarked;
    this.bookmarkChanged.emit(monster.bookmarked);
  }

}
