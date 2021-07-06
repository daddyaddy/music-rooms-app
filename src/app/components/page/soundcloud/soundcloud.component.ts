import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soundcloud',
  templateUrl: './soundcloud.component.html',
  styleUrls: ['./soundcloud.component.scss'],
})
export class SoundcloudComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = (<any>Object).fromEntries((<any>urlSearchParams).entries());

    window.opener.onSoundCloudLogin(params.user_nickname);
  }
}
