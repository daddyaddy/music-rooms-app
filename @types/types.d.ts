import * as WebSocket from 'ws';

export {};

declare global {
  interface MessageData<T = MessageDataType, P extends {} = any> {
    type: T;
    payload: P;
  }

  const enum ClientMessageDataType {
    AUTH_CLIENT = 'auth_client',
    CREATE_ROOM = 'create_room',
    BECOME_HOST = 'become_host',
    JOIN_ROOM = 'join_room',
    LEFT_ROOM = 'left_room',
    ADD_ROOM_SONG = 'add_room_song',
    PLAY_ROOM_SONG = 'play_room_song',
    PAUSE_ROOM_SONG = 'pause_room_song',
    NEXT_ROOM_SONG = 'next_room_song',
    PREV_ROOM_SONG = 'prev_room_song',
  }

  const enum ServerMessageDataType {
    AUTH_CLIENT_SUCCESS = 'auth_client_success',
    NEXT_CLIENTS = 'next_clients',
    NEXT_ROOMS = 'next_rooms',
  }

  type MessageDataType = ServerMessageDataType | ClientMessageDataType;

  type AuthClientSuccessPayload = { clientId: string; rooms: Room[] };
  type NextClientsPayload = { clients: Client[] };
  type NextRoomsPayload = { rooms: Room[] };
  type AuthUserPayload = { nickname: string };
  type CreateRoomPayload = { roomName: string };
  type BecomeHostPayload = { roomId: string };
  type JoinRoomPayload = { roomId: string };
  type LeftRoomPayload = {};
  type AddRoomSongPayload = { roomId: string; roomSong: RoomSong };
  type PlayRoomSongPayload = { roomId: string };
  type PauseRoomSongPayload = { roomId: string };
  type NextRoomSongPayload = { roomId: string };
  type PrevRoomSongPayload = { roomId: string };

  /**/

  interface Client {
    clientId: string;
    socket: WebSocket | null;
    nickname?: string;
    avatarColor?: string;
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
    source: string;
    author: string;
    title: string;
    cover: string;
  }

  interface RoomSong extends Song {
    addedByClient: Client;
  }
}
