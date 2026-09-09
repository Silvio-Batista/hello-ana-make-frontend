"use client";

import { useQuery } from "@tanstack/react-query";
import { instagramService } from "@/services/instagram.service";

export const instagramKeys = {
  all: ["instagram"] as const,
  feed: () => [...instagramKeys.all, "feed"] as const,
};

export function useInstagramFeed() {
  return useQuery({
    queryKey: instagramKeys.feed(),
    queryFn: () => instagramService.getFeed(),
    staleTime: 10 * 60 * 1000,
  });
}
