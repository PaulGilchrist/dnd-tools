import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-spell',
  styleUrls: ['./spell.component.scss'],
  templateUrl: './spell.component.html'
})
export class SpellComponent implements OnInit {

  @Input() spell: any = null;
  @Output() readonly known = new EventEmitter<boolean>(); // Bubble up that the spell is known
  @Output() readonly prepared = new EventEmitter<boolean>(); // Bubble up that the spell is prepared

  // levelText = '';

  ngOnInit(): void {
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   for (const propName in changes) {
  //     if ({}.hasOwnProperty.call(changes, propName)) {
  //       switch (propName) {
  //         case 'spell':
  //           this.levelText = this.spell.level == 0 ? 'cantrip' : 'level ' + this.spell.level;
  //           break;
  //       }
  //     }
  //   }
  // }

  getLevelText(level: number) {
    switch (level) {
      case 0:
        return 'Cantrip';
      case 1:
        return '1st-level';
      case 2:
        return'2nd-level';
      case 3:
        return'3rd-level';
      default:
        return level + 'th-level';
    }
  }


}
