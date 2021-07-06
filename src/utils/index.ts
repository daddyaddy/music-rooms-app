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

export function sleep(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getFormBody = (object: { [key: string]: string }): string => {
  const formBody = [];
  for (const property in object) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(object[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  return formBody.join('&');
};
