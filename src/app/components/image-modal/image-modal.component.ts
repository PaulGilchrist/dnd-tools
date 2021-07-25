import { Component, Input } from '@angular/core';

@Component({
  selector: 'image-modal',
  styleUrls: ['./image-modal.component.scss'],
  templateUrl: './image-modal.component.html'
})
export class ImageModalComponent {

  @Input() image: string = '';

}
