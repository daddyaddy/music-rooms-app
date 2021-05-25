import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

export function ofType(messageDataType: MessageDataType) {
  return function (source: Observable<MessageData>): Observable<MessageData> {
    return source.pipe(
      filter((messageData: MessageData) => messageData.type === messageDataType)
    );
  };
}
