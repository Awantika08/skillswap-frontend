import api from "@/lib/api";
import { SessionMeetingInfo } from "@/zod/video-session.schema";

export const videoSessionService = {
  /**
   * Get meeting info for a WebRTC session
   */
  getSessionMeetingInfo: async (sessionId: string) => {
    const response = await api.get(`/webrtc/session/${sessionId}`);
    return response.data;
  },

  /**
   * Start a session (Mentor only)
   */
  startSession: async (sessionId: string) => {
    const response = await api.post(`/sessions/${sessionId}/start`);
    return response.data;
  },

  /**
   * End a session (Mentor only)
   */
  endSession: async (sessionId: string) => {
    const response = await api.post(`/sessions/${sessionId}/end`);
    return response.data;
  },
};
