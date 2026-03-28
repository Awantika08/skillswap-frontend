export function getRoomSignalChannelName(roomId: string) {
  return `skillswap-video-room:${roomId}:signal`;
}

export function getRoomChatChannelName(roomId: string) {
  return `skillswap-video-room:${roomId}:chat`;
}

