export interface MentorAvailabilityItem {
  AvailabilityID?: string;
  UserID?: string;
  DayOfWeek: number; // 1-7
  StartTime: string; // HH:mm
  EndTime: string;   // HH:mm
  IsRecurring?: boolean;
  IsActive?: boolean;
}

export interface MentorAvailabilityResponse {
  success: boolean;
  data: {
    weekly: MentorAvailabilityItem[];
    specific: any[];
  };
}

export interface UpdateMentorAvailabilityRequest {
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}
