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
