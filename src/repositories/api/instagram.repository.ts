import type { InstagramMediaItem } from "@/contracts";
import type { InstagramRepository } from "@/repositories/interfaces";
import { apiGet } from "@/lib/http-client";

interface InstagramFeedResponse {
  items: InstagramMediaItem[];
}

export class ApiInstagramRepository implements InstagramRepository {
  async getFeed(): Promise<InstagramMediaItem[]> {
    const response = await apiGet<InstagramFeedResponse>("/instagram/feed", undefined, {
      auth: false,
    });
    return response.items;
  }
}
