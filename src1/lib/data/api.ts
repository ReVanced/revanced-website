// Example API surface. Expand as real endpoints are known.
import { get } from '$lib/data/http';

// Example types – adjust to real API contracts later
export type Announcement = { id: number; title: string; body: string; createdAt: string };
export type Contributor = { name: string; avatarUrl: string; url: string };

export const Api = {
  listAnnouncements(): Promise<Announcement[]> {
    return get<Announcement[]>('/announcements');
  },
  listContributors(): Promise<Contributor[]> {
    return get<Contributor[]>('/contributors');
  }
};
