import type * as models from './models';

export interface AnnouncementsApi {
	getAnnouncements(
		cursor?: number,
		count?: number,
		tag?: string
	): Promise<models.BackendResponseAnnouncement[]>;
	getLatestAnnouncement(tag?: string): Promise<models.BackendResponseAnnouncement[]>;
	getLatestAnnouncementIds(tag?: string): Promise<models.BackendResponseAnnouncement[]>;
	getAnnouncement(id: number): Promise<models.BackendResponseAnnouncement>;
	createAnnouncement(
		announcement: models.BackendAnnouncement,
		username: string,
		password: string
	): Promise<void>;
	updateAnnouncement(
		id: number,
		announcement: models.BackendAnnouncement,
		username: string,
		password: string
	): Promise<void>;
	deleteAnnouncement(id: number, username: string, password: string): Promise<void>;
	getAnnouncementTags(): Promise<string[]>;
}

export interface PatchesApi {
	getCurrentRelease(prerelease?: boolean): Promise<models.BackendLatestPatchesRelease>;
	getCurrentReleaseVersion(prerelease?: boolean): Promise<models.BackendAssetVersion>;
	getPatchesList(prerelease?: boolean): Promise<models.BackendPatch[]>;
}

export interface ManagerApi {
	getCurrentRelease(prerelease?: boolean): Promise<models.BackendLatestManagerRelease>;
	getCurrentReleaseVersion(prerelease?: boolean): Promise<models.BackendAssetVersion>;
}

export interface GeneralApi {
	getToken(username: string, password: string): Promise<models.BackendToken>;
	getContributors(): Promise<models.BackendContributable[]>;
	getTeamMembers(): Promise<models.BackendTeamMember[]>;
	getAbout(): Promise<models.BackendAbout>;
	ping(): Promise<boolean>;
	getRateLimit(): Promise<models.BackendRateLimit>;
}

// unified API interface
export interface RevancedApi {
	announcements: AnnouncementsApi;
	patches: PatchesApi;
	manager: ManagerApi;
	general: GeneralApi;
}
