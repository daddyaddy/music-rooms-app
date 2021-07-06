import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WebSocketService } from '../websocket/websocket.service';
import { ExpiringToken } from 'src/app/components/entities/song-library/spotify-library.service';

interface Localstorage {
  nickname?: string | undefined;
  avatarColor?: [string, string] | undefined;
  currentRoomId?: string;
  spotifyRefreshToken?: string;
  spotifyAccessToken?: ExpiringToken;
  youTubeRefreshToken?: string;
  youTubeAccessToken?: ExpiringToken;
  soundCloudUserId?: number;
}

@Injectable({ providedIn: 'root' })
export class LocalstorageService {
  private readonly _localstorage: BehaviorSubject<Localstorage>;
  public readonly localstorage$: Observable<Localstorage>;
  public readonly version: 'v1';

  constructor(private webSocketService: WebSocketService) {
    const storage: Localstorage = this.getStorage();
    this._localstorage = new BehaviorSubject(storage);
    this.localstorage$ = this._localstorage.asObservable();
  }

  private getStorage = (): Localstorage | undefined => {
    const { version } = this;
    try {
      const persistedState = localStorage.getItem(`${version}`);
      if (persistedState === null) throw new Error();
      const storage: Localstorage = JSON.parse(persistedState);
      return storage;
    } catch (error) {
      return undefined;
    }
  };

  public setStorage = (partialStorage: Partial<Localstorage>): void => {
    const currentStorage: Localstorage | undefined = this.getStorage();
    const nextStorage: Localstorage | undefined = {
      ...currentStorage,
      ...partialStorage,
    };
    localStorage.setItem(`${this.version}`, JSON.stringify(nextStorage));
    this._localstorage.next(nextStorage);
  };
}
