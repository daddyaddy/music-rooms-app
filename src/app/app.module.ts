import { WebSocketService } from './core/websocket/websocket.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './components/page/start/start.component';
import { RoomComponent } from './components/page/room/room.component';
import { TopBarComponent } from './components/entities/top-bar/top-bar.component';
import { RoomSongPreviewComponent } from './components/entities/room-song-preview/room-song-preview.component';
import { RoomSongPreviewsComponent } from './components/entities/room-song-previews/room-song-previews.component';
import { RoomSongPlayerComponent } from './components/entities/room-song-player/room-song-player.component';
import { RoomSongInputComponent } from './components/entities/room-song-input/room-song-input.component';
import { RoomSongHostPilotComponent } from './components/entities/room-song-host-pilot/room-song-host-pilot.component';
import { RoomSongMembersComponent } from './components/entities/room-song-members/room-song-members.component';
import { UserComponent } from './components/shared/user/user.component';
import { RoomsComponent } from './components/page/rooms/rooms.component';
import { RoomsRoomCreatorComponent } from './components/entities/rooms-room-creator/rooms-room-creator.component';
import { RoomsListComponent } from './components/entities/rooms-list/rooms-list.component';
import { RoomPreviewComponent } from './components/entities/room-preview/room-preview.component';
import { WindowComponent } from './components/shared/window/window.component';
import { WindowRoomCreatorComponent } from './components/entities/window-room-creator/window-room-creator.component';
import { WindowRoomSongLibraryComponent } from './components/entities/window-room-song-library/window-room-song-library.component';
import { RoundButtonComponent } from './components/shared/round-button/round-button.component';
import { StoreFacade } from './core/store/store.facade';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    RoomComponent,
    TopBarComponent,
    RoomSongPreviewComponent,
    RoomSongPreviewsComponent,
    RoomSongPlayerComponent,
    RoomSongInputComponent,
    RoomSongHostPilotComponent,
    RoomSongMembersComponent,
    UserComponent,
    RoomsComponent,
    RoomsRoomCreatorComponent,
    RoomsListComponent,
    RoomPreviewComponent,
    WindowComponent,
    WindowRoomCreatorComponent,
    WindowRoomSongLibraryComponent,
    RoundButtonComponent,
  ],
  imports: [BrowserModule, CommonModule, AppRoutingModule, HttpClientModule],
  providers: [WebSocketService, StoreFacade],
  bootstrap: [AppComponent],
})
export class AppModule {}
