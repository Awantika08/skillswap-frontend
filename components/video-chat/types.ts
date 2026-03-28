export type ChatMessage = {
  id: string;
  roomId: string;
  senderPeerId: string;
  senderName: string;
  text: string;
  createdAt: number;
};

