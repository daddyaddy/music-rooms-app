import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
})
export class WindowComponent implements OnInit {
  @Input() isOpened: boolean;
  @Input() header?: string;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  public handleCloseButtonClick = (): void => {
    this.onClose.emit();
  };
}
