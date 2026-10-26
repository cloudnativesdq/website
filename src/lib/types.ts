export interface Organizer {
  name: string;
  role: string;
  company: string;
  image: string;
  profileUrl: string;
}

export interface CommunityEvent {
  title: string;
  type: string;
  image: string;
  url: string;
  date: string;
  location?: string;
  soldOut?: boolean;
  spotsRemaining?: number;
  portraitImage?: string;
  /** ISO 8601 start with offset, when the source provides one (Luma). */
  startDate?: string;
  /** ISO 8601 end with offset, when the source provides one (Luma). */
  endDate?: string;
}

export interface CommunityStats {
  membersCount: number;
  pastEventsCount: number;
}

export interface CommunityData {
  organizers: Organizer[];
  upcoming: CommunityEvent[];
  past: CommunityEvent[];
  pastCount: number;
  membersCount: number;
}
