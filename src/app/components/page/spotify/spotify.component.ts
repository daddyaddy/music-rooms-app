import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss'],
})
export class SpotifyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const accessToken = window.location.hash
      .substr(1)
      .split('&')[0]
      .split('=')[1];

    if (!accessToken) return;

    window.opener.onSpotifyLogin(accessToken);
  }
}
