import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientsState } from './clients.state';

export const getCurrentClientId$ = (
  clientsState: ClientsState
): Observable<string> => {
  return clientsState.currentClientId$;
};

export const getClients$ = (
  clientsState: ClientsState
): Observable<Client[]> => {
  return clientsState.clients$;
};

export const getCurrentClient$ = (
  clientsState: ClientsState
): Observable<Client | undefined> => {
  const currentClientId$: Observable<string> = getCurrentClientId$(
    clientsState
  );
  const clients$: Observable<Client[]> = getClients$(clientsState);

  const currentClient$: Observable<Client | undefined> = combineLatest([
    currentClientId$,
    clients$,
  ]).pipe(
    map(([currentClientId, clients]) =>
      clients.find((client: Client) => client.clientId === currentClientId)
    )
  );

  return currentClient$;
};

export const getIsCurrentClientAuth$ = (
  clientsState: ClientsState
): Observable<boolean> => {
  const currentClient$: Observable<Client | undefined> = getCurrentClient$(
    clientsState
  );

  const isClientAuth$: Observable<boolean> = currentClient$.pipe(
    map((currentClient) => Boolean(currentClient && currentClient.user))
  );

  return isClientAuth$;
};

export const getUsers$ = (clientsState: ClientsState): Observable<User[]> => {
  const clients$: Observable<Client[]> = getClients$(clientsState);

  const users$: Observable<User[]> = clients$.pipe(
    map((clients: Client[]) =>
      clients.map((client: Client) => client.user).filter((user: User) => user)
    )
  );

  return users$;
};

export const getCurrentUser$ = (
  clientsState: ClientsState
): Observable<User | undefined> => {
  const currentClient$: Observable<Client | undefined> = getCurrentClient$(
    clientsState
  );

  const currentUser$: Observable<User | undefined> = currentClient$.pipe(
    map((currentClient) => currentClient?.user)
  );

  return currentUser$;
};
