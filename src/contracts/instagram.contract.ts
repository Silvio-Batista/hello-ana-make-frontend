/** Item do feed público (GET /instagram/feed) — grid "Comunidade" da home. */
export interface InstagramMediaItem {
  id: string;
  imageUrl: string;
  permalink: string;
  caption?: string;
}
