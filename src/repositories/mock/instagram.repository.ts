import type { InstagramMediaItem } from "@/contracts";
import type { InstagramRepository } from "@/repositories/interfaces";
import { delay } from "@/repositories/utils";

const MOCK_FEED: InstagramMediaItem[] = [
  "ana-ig-1",
  "ana-ig-2",
  "ana-ig-3",
  "ana-ig-4",
  "ana-ig-5",
  "ana-ig-6",
].map((seed) => ({
  id: seed,
  imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
  permalink: "https://instagram.com/helloanamake",
}));

export class MockInstagramRepository implements InstagramRepository {
  async getFeed(): Promise<InstagramMediaItem[]> {
    await delay();
    return MOCK_FEED;
  }
}
