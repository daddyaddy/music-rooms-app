import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-round-button',
  templateUrl: './round-button.component.html',
  styleUrls: ['./round-button.component.scss'],
})
export class RoundButtonComponent implements OnInit {
  @Input() isBig?: boolean;
  @Input() isDisabled?: boolean;
  @Output() onClick?: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handleButtonClick = () => {
    this.onClick.emit();
  };
}
