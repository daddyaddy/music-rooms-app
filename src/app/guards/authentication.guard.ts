import { delay } from 'rxjs/operators';
import { StoreFacade } from 'src/app/core/store/store.facade';
import { WebSocketService } from 'src/app/core/websocket/websocket.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {
  constructor(
    private webSocketService: WebSocketService,
    private storeFacade: StoreFacade
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.storeFacade.isCurrentClientAuth$;
  }
}
