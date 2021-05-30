import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface RoomDetail extends Room {
  clients: Client[];
  clientHost: Client | undefined;
  currentSong: Song | undefined;
}

export interface RoomMember extends Client {
  isHost: boolean;
}

export function ofType(
  msgDataType: MessageDataType
): MonoTypeOperatorFunction<MessageData> {
  return (source: Observable<MessageData>): Observable<MessageData> =>
    source.pipe(filter((msgData: MessageData) => msgData.type === msgDataType));
}
