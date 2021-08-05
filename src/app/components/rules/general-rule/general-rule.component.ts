import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'general-rule',
  styleUrls: ['./general-rule.component.scss'],
  templateUrl: './general-rule.component.html'
})
export class GeneralRuleComponent implements OnChanges {

  @Input() rule: any = null;

  shownSubsection: string = '';

  constructor(public domSanitizer: DomSanitizer, public sanitizer: DomSanitizer) {}

  ngOnChanges() {
    // console.log(this.rule);
  }

  showSubsection(subsection: string) {
    if(this.shownSubsection == subsection) {
      this.shownSubsection = '';
    } else {
      this.shownSubsection = subsection;
    }
  }

  toggleDetails(rule: any) {
    if (rule.ui) {
      rule.ui.show = !rule.ui.show;
    } else {
      rule.ui = {};
      rule.ui.show = true;
    }
  }

}
