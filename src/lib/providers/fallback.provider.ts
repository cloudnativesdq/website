import type { CommunityData } from "../types";
import type { CommunityDataSource } from "./community-data-source";

const FALLBACK_DATA: CommunityData = {
  organizers: [
    {
      name: "Enmanuel Marcial Medina Martinez",
      role: "Co-organizer",
      company: "Freelance Python Developer",
      image: "/images/organizers/enmanuel.jpg",
      profileUrl: "https://ocgroups.dev/cncf/group/cqecyjw",
    },
    {
      name: "Ayesha Diane Yege Peña",
      role: "Digital Transformation",
      company: "IT Manager",
      image: "/images/organizers/ayesha.jpg",
      profileUrl: "https://ocgroups.dev/cncf/group/cqecyjw",
    },
    {
      name: "Miguel Los",
      role: "Co-Organizer",
      company: "Upwind",
      image: "/images/organizers/miguel.jpeg",
      profileUrl: "https://ocgroups.dev/cncf/group/cqecyjw",
    },
    {
      name: "Lester Diaz",
      role: "DevOps Engineer",
      company: "CEVALDOM",
      image: "/images/organizers/lester.jpg",
      profileUrl: "https://ocgroups.dev/cncf/group/cqecyjw",
    },
  ],
  upcoming: [],
  past: [],
  pastCount: 25,
  membersCount: 530,
};

export class FallbackProvider implements CommunityDataSource {
  readonly name = "fallback";

  async fetchData(): Promise<CommunityData> {
    return FALLBACK_DATA;
  }
}
