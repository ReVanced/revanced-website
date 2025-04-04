import type * as Models from './models';

export interface AnnouncementsApi {
	getAnnouncements(
		cursor?: number,
		count?: number,
		tag?: string
	): Promise<Models.BackendResponseAnnouncement[]>;
	getLatestAnnouncement(tag?: string): Promise<Models.BackendResponseAnnouncement[]>;
	getLatestAnnouncementIds(tag?: string): Promise<Models.BackendResponseAnnouncement[]>;
	getAnnouncement(id: number): Promise<Models.BackendResponseAnnouncement>;
	createAnnouncement(announcement: Models.BackendAnnouncement, authToken: string): Promise<void>;
	updateAnnouncement(
		id: number,
		announcement: Models.BackendAnnouncement,
		authToken: string
	): Promise<void>;
	deleteAnnouncement(id: number, authToken: string): Promise<void>;
	getAnnouncementTags(): Promise<string[]>;
}

export interface PatchesApi {
	getCurrentRelease(prerelease?: boolean): Promise<Models.BackendLatestPatchesRelease>;
	getCurrentReleaseVersion(prerelease?: boolean): Promise<Models.BackendAssetVersion>;
	getPatchesList(prerelease?: boolean): Promise<Models.BackendPatch[]>;
}

export interface ManagerApi {
	getCurrentRelease(prerelease?: boolean): Promise<Models.BackendLatestManagerRelease>;
	getCurrentReleaseVersion(prerelease?: boolean): Promise<Models.BackendAssetVersion>;
}

export interface GeneralApi {
	getToken(username: string, password: string): Promise<Models.BackendToken>;
	getContributors(): Promise<Models.BackendContributable[]>;
	getTeamMembers(): Promise<Models.BackendTeamMember[]>;
	getAbout(): Promise<Models.BackendAbout>;
	ping(): Promise<boolean>;
	getRateLimit(): Promise<Models.BackendRateLimit>;
}

// unified API interface
export interface ReVancedApi {
	announcements: AnnouncementsApi;
	patches: PatchesApi;
	manager: ManagerApi;
	general: GeneralApi;
}
