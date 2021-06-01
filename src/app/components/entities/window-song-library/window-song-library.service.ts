import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowSongLibraryService {
  private _isWindowOpened: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public isWindowOpened$: Observable<boolean>;

  constructor() {
    this.isWindowOpened$ = this._isWindowOpened.asObservable();
  }

  openWindow() {
    this._isWindowOpened.next(true);
  }

  closeWindow() {
    this._isWindowOpened.next(false);
  }
}
