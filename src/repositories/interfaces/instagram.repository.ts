import type { InstagramMediaItem } from "@/contracts";

/** Feed público da home (GET /instagram/feed, sem autenticação). */
export interface InstagramRepository {
  getFeed(): Promise<InstagramMediaItem[]>;
}
