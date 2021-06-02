import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class YoutubeService {
  private readonly apiKey: string = 'AIzaSyDchPkFVlXEtEu9c5D4A5ePyjw0yf4I9z0';

  constructor(public http: HttpClient) {}

  /* public getVideosForChanel(query: string): Observable<Object> {
    const result = from(yts(query));
    return result;
  }*/
}
