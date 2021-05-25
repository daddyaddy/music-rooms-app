import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  getClients$,
  getCurrentClient$,
  getCurrentClientId$,
  getCurrentUser$,
  getIsCurrentClientAuth$,
  getUsers$,
} from './clients.selectors';
import { ClientsState } from './clients.state';

@Injectable({
  providedIn: 'root',
})
export class ClientsFacade {
  public currentClientId$: Observable<string>;
  public clients$: Observable<Client[]>;
  public currentClient$: Observable<Client | undefined>;
  public isCurrentClientAuth$: Observable<boolean>;
  public users$: Observable<User[]>;
  public isExistHost$: Observable<boolean>;
  public currentUser$: Observable<User | undefined>;
  public isCurrentUserIsHost$: Observable<boolean>;

  constructor(private clientsState: ClientsState) {
    this.currentClientId$ = getCurrentClientId$(clientsState);
    this.clients$ = getClients$(clientsState);
    this.currentClient$ = getCurrentClient$(clientsState);
    this.isCurrentClientAuth$ = getIsCurrentClientAuth$(clientsState);
    this.users$ = getUsers$(clientsState);
    this.currentUser$ = getCurrentUser$(clientsState);
  }

  public authClient(nickname: string) {
    this.clientsState.authClient({ nickname });
  }

  public joinRoom(roomId: string): void {
    this.clientsState.joinRoom({ roomId });
  }

  public leftRoom(): void {
    this.clientsState.leftRoom({});
  }
}
