import { CommunityData } from "../types";

export interface CommunityDataSource {
  readonly name: string;
  fetchData(): Promise<CommunityData>;
}
