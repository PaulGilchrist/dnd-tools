import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-spell',
  styleUrls: ['./spell.component.scss'],
  templateUrl: './spell.component.html'
})
export class SpellComponent implements OnChanges {

  @Input() expand = false;
  @Input() spell: any = null;
  @Output() expanded = new EventEmitter<boolean>();
  @Output() readonly knownChanged = new EventEmitter<boolean>(); // Bubble up that the spell is known
  @Output() readonly preparedChanged = new EventEmitter<boolean>(); // Bubble up that the spell is prepared
  
  ngOnChanges() {
    // console.log(this.spell);
  }

  getClasses() {
    let classes = '';
    this.spell.classes.forEach((spellClass: string) => {
      classes += `${spellClass}, `;
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

  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
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
