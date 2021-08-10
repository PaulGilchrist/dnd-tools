import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'general-rule',
  styleUrls: ['./general-rule.component.scss'],
  templateUrl: './general-rule.component.html'
})
export class GeneralRuleComponent implements OnChanges {

  @Input() expand = false;
  @Input() rule: any = null;
  @Output() expanded = new EventEmitter<boolean>();

  shownSubsection: string = '';

  constructor(public domSanitizer: DomSanitizer) {}

  ngOnChanges() {
    console.log(this.rule);
  }

  showSubsection(subsection: string) {
    if(this.shownSubsection == subsection) {
      this.shownSubsection = '';
    } else {
      this.shownSubsection = subsection;
    }
  }

  toggleDetails() {
    this.expand = !this.expand;
    this.expanded.emit(this.expand);
  }

}
