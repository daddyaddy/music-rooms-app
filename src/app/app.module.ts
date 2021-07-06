import { LocalstorageService } from './core/localstorage/localstorage';
import { AuthenticationGuard } from './guards/authentication.guard';
import { WebSocketService } from './core/websocket/websocket.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StartComponent } from './components/page/start/start.component';
import { RoomComponent } from './components/page/room/room.component';
import { TopBarComponent } from './components/shared/top-bar/top-bar.component';
import { RoomSongPreviewComponent } from './components/entities/room-song-preview/room-song-preview.component';
import { RoomSongPlayerComponent } from './components/entities/room-song-player/room-song-player.component';
import { RoomMembersComponent } from './components/entities/room-members/room-members.component';
import { UserComponent } from './components/shared/user/user.component';
import { RoomsComponent } from './components/page/rooms/rooms.component';
import { RoomPreviewComponent } from './components/entities/room-preview/room-preview.component';
import { WindowComponent } from './components/shared/window/window.component';
import { WindowRoomCreatorComponent } from './components/entities/window-room-creator/window-room-creator.component';
import { WindowSongLibraryComponent } from './components/entities/window-song-library/window-song-library.component';
import { RoundButtonComponent } from './components/shared/round-button/round-button.component';
import { StoreFacade } from './core/store/store.facade';
import { SongSearchComponent } from './components/entities/song-search/song-search.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SongLibraryComponent } from './components/entities/song-library/song-library.component';
import { SpotifyComponent } from './components/page/spotify/spotify.component';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/page/main/main.component';
import { YoutubeComponent } from './components/page/youtube/youtube.component';
import { SoundcloudComponent } from './components/page/soundcloud/soundcloud.component';
import { SoundcloudAuthComponent } from './components/page/soundcloud-auth/soundcloud-auth.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MainComponent },
  { path: 'soundcloud-auth', component: SoundcloudAuthComponent },
  { path: 'spotify-callback', component: SpotifyComponent },
  { path: 'youtube-callback', component: YoutubeComponent },
  { path: 'soundcloud-callback', component: SoundcloudComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    StartComponent,
    RoomComponent,
    TopBarComponent,
    RoomSongPreviewComponent,
    RoomSongPlayerComponent,
    RoomMembersComponent,
    UserComponent,
    RoomsComponent,
    RoomPreviewComponent,
    WindowComponent,
    WindowRoomCreatorComponent,
    WindowSongLibraryComponent,
    RoundButtonComponent,
    SongSearchComponent,
    SongLibraryComponent,
    SpotifyComponent,
    YoutubeComponent,
    SoundcloudComponent,
    SoundcloudAuthComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [WebSocketService, LocalstorageService, StoreFacade],
  bootstrap: [AppComponent],
})
export class AppModule {}
