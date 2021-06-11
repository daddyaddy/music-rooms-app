import * as WebSocket from 'ws';

export {};

declare global {
  interface MessageData<T = MessageDataType, P extends {} = any> {
    type: T;
    payload: P;
  }

  const enum ClientMessageDataType {
    PING = 'ping',
    AUTH_CLIENT = 'auth_client',
    CREATE_ROOM = 'create_room',
    BECOME_HOST = 'become_host',
    JOIN_ROOM = 'join_room',
    LEFT_ROOM = 'left_room',
    ADD_ROOM_SONG = 'add_room_song',
    DOWNLOAD_SONG_BUFFER = 'download_song_buffer',
    PLAY_ROOM_SONG = 'play_room_song',
    PAUSE_ROOM_SONG = 'pause_room_song',
    SELECT_ROOM_SONG = 'select_room_song',
    NEXT_ROOM_SONG = 'next_room_song',
    PREV_ROOM_SONG = 'prev_room_song',
  }

  const enum ServerMessageDataType {
    PONG = 'pong',
    AUTH_CLIENT_RESPONSE = 'auth_client_response',
    CREATE_ROOM_RESPONSE = 'create_room_response',
    BECOME_HOST_RESPONSE = 'become_host_response',
    JOIN_ROOM_RESPONSE = 'join_room_response',
    LEFT_ROOM_RESPONSE = 'left_room_response',
    UPLOAD_SONG_PROGRESS = 'upload_song_progress',
    ADD_ROOM_SONG_RESPONSE = 'add_room_song_response',
    DOWNLOAD_SONG_BUFFER_RESPONSE = 'download_song_buffer_response',
    PLAY_ROOM_SONG_RESPONSE = 'play_room_song_response',
    PAUSE_ROOM_SONG_RESPONSE = 'pause_room_song_response',
    SELECT_ROOM_SONG_RESPONSE = 'select_room_song_response',
    NEXT_ROOM_SONG_RESPONSE = 'next_room_song_response',
    PREV_ROOM_SONG_RESPONSE = 'prev_room_song_response',
    AUTH_CLIENT_SUCCESS = 'auth_client_success',
    NEXT_CLIENTS = 'next_clients',
    NEXT_ROOMS = 'next_rooms',
  }

  type MessageDataType = ServerMessageDataType | ClientMessageDataType;

  type AuthClientSuccessPayload = { clientId: string; rooms: Room[] };
  type NextClientsPayload = { clients: Client[] };
  type NextRoomsPayload = { rooms: Room[] };
  type AuthUserPayload = { nickname: string; avatarColor?: [string, string] };
  type CreateRoomPayload = { roomName: string };
  type BecomeHostPayload = { roomId: string };
  type JoinRoomPayload = { roomId: string };
  type LeftRoomPayload = {};
  type AddRoomSongPayload = { roomId: string; roomSong: RoomSong };
  type DownloadSongBufferPayload = { songYtId: string };
  type SelectRoomSongPayload = { roomId: string; songId: string };
  type PlayRoomSongPayload = { roomId: string };
  type PauseRoomSongPayload = { roomId: string };
  type NextRoomSongPayload = { roomId: string };
  type PrevRoomSongPayload = { roomId: string };

  type AuthClientSuccessResponsePayload = {};
  type NextClientsResponsePayload = {};
  type NextRoomsResponsePayload = {};
  type AuthUserResponsePayload = {};
  type CreateRoomResponsePayload = {};
  type BecomeHostResponsePayload = {};
  type JoinRoomReseponsePayload = {};
  type LeftRoomResponsePayload = {};
  type AddRoomSongResponsePayload = {};
  type DownloadSongBufferResponsePayload = { songBuffer: SongBuffer };
  type SelectRoomSongResponsePayload = {};
  type PlayRoomSongResponsePayload = {};
  type PauseRoomSongResponsePayload = {};
  type NextRoomSongResponsePayload = {};
  type PrevRoomSongResponsePayload = {};

  type UploadSongProgressPayload = { songProgress: SongProgress };
  /**/

  interface Client {
    clientId: string;
    socket: WebSocket | null;
    nickname?: string;
    avatarColor?: [string, string];
    currentRoomId?: string | undefined;
  }

  interface Room {
    roomId: string;
    name: string;
    songs: Array<RoomSong>;
    currentSongIndex: number;
    isCurrentSongPlay: boolean;
    clientHostId: string | undefined;
  }

  interface Song {
    songId: string;
    ytId?: string;
    author: string;
    title: string;
    cover: string;
  }

  interface RoomSong extends Song {
    addedByClient: Client;
  }

  interface YtItem {
    etag: string;
    id: { kind: string; videoId: string };
    kind: string;
    snippet: {
      channelId: string;
      channelTitle: string;
      description: string;
      liveBroadcastContent: string;
      publishTime: string;
      publishedAt: string;
      thumbnails: {
        default: YtItemThumbnail;
        high: YtItemThumbnail;
        medium: YtItemThumbnail;
      };
      title: string;
    };
  }
  type YtItemThumbnail = {
    url: string;
    width: number;
    height: number;
  };

  type Req<P extends {} = {}> = {
    payload: P;
    sender: Sender;
  };

  type Sender = {
    clientId: string;
    socket: WebSocket | null;
  };

  type SongProgress = {
    ytId: string;
    progress: number;
  };

  type SongBuffer = {
    ytId: string;
    buffer: { type: string; data: any };
  };

  type SongBlob = {
    ytId: string;
    blob: Blob;
  };
}
