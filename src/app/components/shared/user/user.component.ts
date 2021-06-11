import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() user: Client;
  @Input() isHost?: boolean = false;
  @Input() isMini?: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public getBackground = (user: Client) => {
    const { avatarColor } = user;
    if (!avatarColor) return;
    return `linear-gradient(45deg, ${avatarColor[0]}, ${avatarColor[1]})`;
  };

  public getInitials = (user: Client) => {
    const { nickname } = user;
    if (!nickname) return;
    return nickname.slice(0, 3);
  };
}
