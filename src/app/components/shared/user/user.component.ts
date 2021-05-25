import { ClientsFacade } from './../../../store/clients/clients.facade';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() user: User;
  @Input() isHost?: boolean = false;

  constructor(private clientsFacade: ClientsFacade) {}

  ngOnInit(): void {}
}
