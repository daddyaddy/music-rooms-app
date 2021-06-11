export type Communication = {
  [key in ClientMessageDataType]?: ServerMessageDataType;
};

export const communication: Communication = {
  [ClientMessageDataType.AUTH_CLIENT]:
    ServerMessageDataType.AUTH_CLIENT_RESPONSE,
  [ClientMessageDataType.CREATE_ROOM]:
    ServerMessageDataType.CREATE_ROOM_RESPONSE,
  [ClientMessageDataType.BECOME_HOST]:
    ServerMessageDataType.BECOME_HOST_RESPONSE,
  [ClientMessageDataType.JOIN_ROOM]: ServerMessageDataType.JOIN_ROOM_RESPONSE,
  [ClientMessageDataType.LEFT_ROOM]: ServerMessageDataType.LEFT_ROOM_RESPONSE,
  [ClientMessageDataType.ADD_ROOM_SONG]:
    ServerMessageDataType.ADD_ROOM_SONG_RESPONSE,
  [ClientMessageDataType.ADD_ROOM_SONG]:
    ServerMessageDataType.ADD_ROOM_SONG_RESPONSE,
  [ClientMessageDataType.DOWNLOAD_SONG_BUFFER]:
    ServerMessageDataType.DOWNLOAD_SONG_BUFFER_RESPONSE,
  [ClientMessageDataType.PLAY_ROOM_SONG]:
    ServerMessageDataType.PLAY_ROOM_SONG_RESPONSE,
  [ClientMessageDataType.PAUSE_ROOM_SONG]:
    ServerMessageDataType.PAUSE_ROOM_SONG_RESPONSE,
  [ClientMessageDataType.NEXT_ROOM_SONG]:
    ServerMessageDataType.NEXT_ROOM_SONG_RESPONSE,
  [ClientMessageDataType.PREV_ROOM_SONG]:
    ServerMessageDataType.PREV_ROOM_SONG_RESPONSE,
};

export const getResponseMessageType = (
  request: ClientMessageDataType
): ServerMessageDataType => {
  return communication[request];
};

export const getRequestMessageType = (
  response: ServerMessageDataType
): ClientMessageDataType => {
  return (Object.keys(communication) as Array<keyof Communication>).find(
    (request) => communication[request] === response
  );
};
