export interface RoomDetail extends Room {
  clients: Client[];
  clientHost: Client | undefined;
  currentSong: Song | undefined;
}

export interface RoomMember extends User {
  isHost: boolean;
}
