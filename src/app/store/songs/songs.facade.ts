import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  private _songs$: BehaviorSubject<any>;

  constructor() { }

  getSongs(): Observable<any> {
    return this._songs$.asObservable();
  }
}
