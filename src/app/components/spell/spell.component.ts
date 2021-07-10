import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-spell',
  styleUrls: ['./spell.component.scss'],
  templateUrl: './spell.component.html'
})
export class SpellComponent implements OnInit {

  @Input() spell: any = null;
  @Output() readonly knownChanged = new EventEmitter<boolean>(); // Bubble up that the spell is known
  @Output() readonly preparedChanged = new EventEmitter<boolean>(); // Bubble up that the spell is prepared

  ngOnInit(): void {
  }

  getClasses() {
    let classes = '';
    this.spell.classes.forEach((spellClass: any) => {
      classes += `${spellClass.name}, `;
    });
    return classes.substr(0, classes.length-2);
  }

  getLevelText(level: number) {
    switch (level) {
      case 0:
        return 'Cantrip';
      case 1:
        return '1st-level';
      case 2:
        return '2nd-level';
      case 3:
        return '3rd-level';
      default:
        return level + 'th-level';
    }
  }

  toggleDetails(spell: any) {
    if (spell.ui) {
      spell.ui.show = !spell.ui.show;
    } else {
      spell.ui = {};
      spell.ui.show = true;
    }
  }

  toggleKnown(spell: any) {
    spell.known = !spell.known;
    // A spell must be known to be prepared
    if(spell.known == false && spell.prepared == true) {
      spell.prepared = false;
      this.preparedChanged.emit(spell.prepared);
    }
    this.knownChanged.emit(spell.known);
  }

  togglePrepared(spell: any) {
    spell.prepared = !spell.prepared;
    this.preparedChanged.emit(spell.prepared);
  }

}
