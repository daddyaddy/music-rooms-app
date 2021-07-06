import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss'],
})
export class SpotifyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = (<any>Object).fromEntries((<any>urlSearchParams).entries());

    window.opener.onSpotifyLogin(params.code);
  }
}
