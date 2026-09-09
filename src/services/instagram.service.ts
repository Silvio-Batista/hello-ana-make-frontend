import type { InstagramMediaItem } from "@/contracts";
import { instagramRepository } from "@/lib/container";

export const instagramService = {
  getFeed(): Promise<InstagramMediaItem[]> {
    return instagramRepository.getFeed();
  },
};
