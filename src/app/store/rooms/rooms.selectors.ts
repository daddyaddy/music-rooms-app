import { combineLatest, Observable } from 'rxjs';
import { ClientsState } from './../clients/clients.state';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { RoomsState } from './rooms.state';
import {
  getClients$,
  getCurrentClient$,
  getCurrentUser$,
} from '../clients/clients.selectors';
import { RoomDetail } from 'src/utils';

export const getRooms$ = (roomsState: RoomsState): Observable<Room[]> => {
  return roomsState.rooms$;
};

export const getRoomsDetails$ = (
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<RoomDetail[]> => {
  const rooms$: Observable<Room[]> = getRooms$(roomsState);
  const clients$: Observable<Client[]> = getClients$(clientsState);

  const roomDetails$: Observable<RoomDetail[]> = combineLatest([
    rooms$,
    clients$,
  ]).pipe(
    map(([rooms, clients]) =>
      rooms.map((room: Room) => ({
        ...room,
        clients: clients.filter(
          (client) => client.user && client.user.currentRoomId === room.roomId
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
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<Room | undefined> => {
  const rooms$: Observable<Room[]> = getRooms$(roomsState);
  const currentUser$: Observable<User | undefined> =
    getCurrentUser$(clientsState);

  const selectedRoom$: Observable<Room | undefined> = combineLatest([
    rooms$,
    currentUser$,
  ]).pipe(
    map(([rooms, currentUser]) =>
      rooms.find(
        (room) => currentUser && room.roomId === currentUser.currentRoomId
      )
    )
  );

  return selectedRoom$;
};

export const getSelectedRoomDetail$ = (
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<RoomDetail | undefined> => {
  const selectedRoom$: Observable<Room | undefined> = getSelectedRoom$(
    roomsState,
    clientsState
  );
  const clients$: Observable<Client[]> = getClients$(clientsState);

  const selectedRoomDetail$: Observable<RoomDetail | undefined> = combineLatest(
    [selectedRoom$, clients$]
  ).pipe(
    map(([selectedRoom, clients]) => ({
      ...selectedRoom,
      clients: clients.filter(
        (client) =>
          client.user &&
          selectedRoom &&
          client.user.currentRoomId === selectedRoom.roomId
      ),
      clientHost: clients.find(
        (client) =>
          selectedRoom && client.clientId === selectedRoom.clientHostId
      ),
      currentSong: selectedRoom.songs[selectedRoom.currentSongIndex],
    }))
  );

  return selectedRoomDetail$;
};

export const getSelectedRoomCurrentSong$ = (
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<Song | undefined> => {
  const selectedRoomDetails$: Observable<RoomDetail | undefined> =
    getSelectedRoomDetail$(roomsState, clientsState);

  const selectedRoomCurrentSong$: Observable<Song | undefined> =
    selectedRoomDetails$.pipe(
      map((selectedRoomDetails) => selectedRoomDetails?.currentSong)
    );
  return selectedRoomCurrentSong$;
};

export const getSelectedRoomHostClient$ = (
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<Client | undefined> => {
  const selectedRoom$: Observable<Room> = getSelectedRoom$(
    roomsState,
    clientsState
  );
  const clients$: Observable<Client[]> = getClients$(clientsState);

  const selectedRoomHostClient$: Observable<Client | undefined> = combineLatest(
    [selectedRoom$, clients$]
  ).pipe(
    map(([selectedRoom, clients]) =>
      clients.find(
        (client) =>
          selectedRoom && client.clientId === selectedRoom.clientHostId
      )
    )
  );

  return selectedRoomHostClient$;
};

export const getSelectedRoomHostUser$ = (
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<User | undefined> => {
  const selectedRoomHostClient$: Observable<Client | undefined> =
    getSelectedRoomHostClient$(roomsState, clientsState);

  const selectedRoomHostUser$: Observable<User | undefined> =
    selectedRoomHostClient$.pipe(
      map(
        (selectedRoomHostClient) =>
          selectedRoomHostClient && selectedRoomHostClient.user
      )
    );

  return selectedRoomHostUser$;
};

export const getIsSelectedRoomHostClientIsYou$ = (
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<boolean> => {
  const currentClient$: Observable<Client> = getCurrentClient$(clientsState);
  const selectedRoom$: Observable<Room | undefined> = getSelectedRoom$(
    roomsState,
    clientsState
  );

  const isSelectedRoomHostClientIsYou$: Observable<boolean> = combineLatest([
    currentClient$,
    selectedRoom$,
  ]).pipe(
    map(
      ([currentClient, selectedRoom]) =>
        currentClient.user &&
        selectedRoom &&
        currentClient.clientId === selectedRoom.clientHostId
    )
  );

  return isSelectedRoomHostClientIsYou$;
};

export const getIsSelectedRoomHostUserInsideRoom$ = (
  roomsState: RoomsState,
  clientsState: ClientsState
): Observable<boolean> => {
  const selectedRoom$: Observable<Room | undefined> = getSelectedRoom$(
    roomsState,
    clientsState
  );
  const selectedRoomHostUser$: Observable<User | undefined> =
    getSelectedRoomHostUser$(roomsState, clientsState);

  const isSelectedRoomHostUserInsideRoom$: Observable<boolean> = combineLatest([
    selectedRoom$,
    selectedRoomHostUser$,
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
