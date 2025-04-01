// API service interfaces

export interface AnnouncementsApi {
	getAnnouncements(
		cursor?: number,
		count?: number,
		tag?: string
	): Promise<ApiResponseAnnouncement[]>;
	getLatestAnnouncement(tag?: string): Promise<ApiResponseAnnouncement[]>;
	getLatestAnnouncementIds(tag?: string): Promise<ApiResponseAnnouncement[]>;
	getAnnouncement(id: number): Promise<ApiResponseAnnouncement>;
	createAnnouncement(announcement: ApiAnnouncement, token: string): Promise<void>;
	updateAnnouncement(id: number, announcement: ApiAnnouncement, token: string): Promise<void>;
	deleteAnnouncement(id: number, token: string): Promise<void>;
	getAnnouncementTags(): Promise<string[]>;
}

export interface PatchesApi {
	getCurrentRelease(prerelease?: boolean): Promise<ApiRelease>;
	getCurrentReleaseVersion(prerelease?: boolean): Promise<ApiReleaseVersion>;
	getPatchesList(prerelease?: boolean): Promise<string>;
	getPublicKeys(): Promise<ApiAssetPublicKey>;
}

export interface ManagerApi {
	getCurrentRelease(prerelease?: boolean): Promise<ApiRelease>;
	getCurrentReleaseVersion(prerelease?: boolean): Promise<ApiReleaseVersion>;
}

export interface GeneralApi {
	getToken(authDigest: string): Promise<ApiToken>;
	getContributors(): Promise<APIContributable[]>;
	getTeamMembers(): Promise<ApiMember[]>;
	getAbout(): Promise<APIAbout>;
	ping(): Promise<boolean>;
	getRateLimit(): Promise<ApiRateLimit>;
}

// unified API interface
export interface RevancedApi {
	announcements: AnnouncementsApi;
	patches: PatchesApi;
	manager: ManagerApi;
	general: GeneralApi;
}
