import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

export type SoundCloudUser = {
  avatar_url: string | null;
  city: string | null;
  comments_count: number;
  country: string | null;
  created_at: Date;
  description: string | null;
  discogs_name: string | null;
  first_name: string | null;
  followers_count: number;
  followings_count: number;
  full_name: string | null;
  id: number;
  kind: string;
  last_modified: Date;
  last_name: string;
  likes_count: number;
  myspace_name: string | null;
  online: boolean;
  permalink: string;
  permalink_url: string;
  plan: string;
  playlist_count: number;
  public_favorites_count: number;
  reposts_count: number;
  subscriptions: Array<unknown>;
  track_count: number;
  uri: string;
  username: string;
  website: string | null;
  website_title: string | null;
};

@Component({
  selector: 'app-soundcloud-auth',
  templateUrl: './soundcloud-auth.component.html',
  styleUrls: ['./soundcloud-auth.component.scss'],
})
export class SoundcloudAuthComponent implements OnInit {
  @ViewChild('nicknameInputRef') nicknameInputRef;
  @ViewChild('continueButtonRef') continueButtonRef;
  public readonly clientID = 'wpfE1K2Teq4ZQ0QxdOuzIPTQUrcPO9P6';

  public nicknameInputKeyup$: Observable<KeyboardEvent>;
  public nicknameInputEnter$: Observable<KeyboardEvent>;
  public nicknameInputValue$: Observable<string>;
  public continueButtonClick$: Observable<MouseEvent>;
  public formSubmit$: Observable<string>;

  public users: SoundCloudUser[];

  constructor(public http: HttpClient) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.nicknameInputKeyup$ = fromEvent(
      this.nicknameInputRef.nativeElement,
      'keyup'
    );

    this.nicknameInputEnter$ = this.nicknameInputKeyup$.pipe(
      filter((event) => event.key === 'Enter')
    );

    this.nicknameInputValue$ = this.nicknameInputKeyup$.pipe(
      map((event) => event.target),
      map((input: HTMLInputElement) => input.value)
    );

    this.continueButtonClick$ = fromEvent(
      this.continueButtonRef.nativeElement,
      'click'
    );

    this.formSubmit$ = merge(
      this.nicknameInputEnter$,
      this.continueButtonClick$
    ).pipe(
      withLatestFrom(this.nicknameInputValue$),
      map(([, value]) => value)
    );

    this.formSubmit$
      .pipe(switchMap((nickname) => this.fetchUsersBy$({ nickname })))
      .subscribe((data) => (this.users = data));
  }

  public fetchUsersBy$ = (payload: {
    nickname: string;
  }): Observable<SoundCloudUser[]> => {
    const { nickname } = payload;
    const { clientID } = this;
    return this.http.get<SoundCloudUser[]>(
      `${environment.soundCloudApiUrl}/users?q=${nickname}&limit=5&client_id=${clientID}`,
      {}
    );
  };

  public handleUserButtonClick = (user: SoundCloudUser) => {
    user && user.id && window.opener.onSoundCloudLogin(user.id);
  };
}
