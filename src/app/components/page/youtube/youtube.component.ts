import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
})
export class YoutubeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = (<any>Object).fromEntries((<any>urlSearchParams).entries());

    window.opener.onYouTubeLogin(params.code);
  }
}
