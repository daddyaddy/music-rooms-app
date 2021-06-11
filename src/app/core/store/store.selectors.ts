import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { RoomDetail } from 'src/utils';
import { StoreService } from './store.service';

export const getCurrentClientId$ = (
  storeService: StoreService
): Observable<string> => {
  return storeService.currentClientId$;
};

export const getClients$ = (
  storeService: StoreService
): Observable<Client[]> => {
  return storeService.clients$;
};

export const getCurrentClient$ = (
  storeService: StoreService
): Observable<Client | undefined> => {
  const currentClientId$: Observable<string> =
    getCurrentClientId$(storeService);
  const clients$: Observable<Client[]> = getClients$(storeService);

  const currentClient$ = combineLatest([currentClientId$, clients$]).pipe(
    map(([currentClientId, clients]) =>
      clients.find((client: Client) => client.clientId === currentClientId)
    )
  );

  return currentClient$;
};

export const getIsCurrentClientAuth$ = (
  storeService: StoreService
): Observable<boolean> => {
  const currentClient$: Observable<Client | undefined> =
    getCurrentClient$(storeService);

  const isClientAuth$: Observable<boolean> = currentClient$.pipe(
    map((currentClient) => Boolean(currentClient && currentClient.nickname))
  );

  return isClientAuth$;
};

/** */

export const getRooms$ = (storeService: StoreService): Observable<Room[]> => {
  return storeService.rooms$;
};

export const getRoomsDetails$ = (
  storeService: StoreService
): Observable<RoomDetail[]> => {
  const rooms$: Observable<Room[]> = getRooms$(storeService);
  const clients$: Observable<Client[]> = getClients$(storeService);

  const roomDetails$ = combineLatest([rooms$, clients$]).pipe(
    map(([rooms, clients]) =>
      rooms.map((room: Room) => ({
        ...room,
        clients: clients.filter(
          (client) => client.currentRoomId === room.roomId
        ),
        clientHost: clients.find(
          (client) => client.clientId === room.clientHostId
        ),
        currentSong: room.songs[room.currentSongIndex],
      }))
    )
  );

  return roomDetails$;
};

export const getSelectedRoom$ = (
  storeService: StoreService
): Observable<Room | undefined> => {
  const rooms$: Observable<Room[]> = getRooms$(storeService);
  const currentClient$: Observable<Client> = getCurrentClient$(storeService);

  const selectedRoom$ = combineLatest([rooms$, currentClient$]).pipe(
    map(
      ([rooms, currentClient]) =>
        currentClient &&
        rooms.find((room) => room.roomId === currentClient.currentRoomId)
    )
  );

  return selectedRoom$;
};

export const getSelectedRoomSongs$ = (
  storeService: StoreService
): Observable<RoomSong[]> => {
  const selectedRoom$: Observable<Room | undefined> =
    getSelectedRoom$(storeService);

  return selectedRoom$.pipe(map((selectedRoom) => selectedRoom.songs));
};

export const getSelectedRoomDetail$ = (
  storeService: StoreService
): Observable<RoomDetail | undefined> => {
  const roomDetails$ = getRoomsDetails$(storeService);
  const currentClient$ = getCurrentClient$(storeService);

  const selectedRoomDetail$ = combineLatest([
    roomDetails$,
    currentClient$,
  ]).pipe(
    filter(([roomDetails, currentClient]) => currentClient !== undefined),
    map(([roomDetails, currentClient]) =>
      roomDetails.find((room) => room.roomId === currentClient.currentRoomId)
    )
  );

  return selectedRoomDetail$;
};

export const getSelectedRoomCurrentSong$ = (
  storeService: StoreService
): Observable<Song | undefined> => {
  const selectedRoomDetails$ = getSelectedRoomDetail$(storeService);

  const selectedRoomCurrentSong$: Observable<Song | undefined> =
    selectedRoomDetails$.pipe(
      map((selectedRoomDetails) => selectedRoomDetails?.currentSong)
    );
  return selectedRoomCurrentSong$;
};

export const getSelectedRoomHostClient$ = (
  storeService: StoreService
): Observable<Client | undefined> => {
  const selectedRoom$ = getSelectedRoom$(storeService);
  const clients$ = getClients$(storeService);

  const selectedRoomHostClient$ = combineLatest([selectedRoom$, clients$]).pipe(
    map(([selectedRoom, clients]) =>
      clients.find(
        (client) =>
          selectedRoom && client.clientId === selectedRoom.clientHostId
      )
    )
  );

  return selectedRoomHostClient$;
};

export const getIsCurrentClientIsHost$ = (
  storeService: StoreService
): Observable<boolean> => {
  const currentClient$ = getCurrentClient$(storeService);
  const selectedRoom$ = getSelectedRoom$(storeService);

  const isCurrentClientIsHost$: Observable<boolean> = combineLatest([
    currentClient$,
    selectedRoom$,
  ]).pipe(
    map(
      ([currentClient, selectedRoom]) =>
        selectedRoom && currentClient.clientId === selectedRoom.clientHostId
    )
  );

  return isCurrentClientIsHost$;
};

export const getIsSelectedRoomHostUserInsideRoom$ = (
  storeService: StoreService
): Observable<boolean> => {
  const selectedRoom$ = getSelectedRoom$(storeService);
  const selectedRoomHostClient$ = getSelectedRoomHostClient$(storeService);

  const isSelectedRoomHostUserInsideRoom$: Observable<boolean> = combineLatest([
    selectedRoom$,
    selectedRoomHostClient$,
  ]).pipe(
    map(
      ([selectedRoom, selectedRoomHostUser]) =>
        selectedRoom &&
        selectedRoomHostUser &&
        selectedRoomHostUser.currentRoomId === selectedRoom.roomId
    )
  );

  return isSelectedRoomHostUserInsideRoom$;
};
