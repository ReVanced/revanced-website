import type {
	AnnouncementsApi,
	PatchesApi,
	ManagerApi,
	GeneralApi,
	RevancedApi,
	ApiResponseAnnouncement,
	ApiAnnouncement,
	ApiRelease,
	ApiReleaseVersion,
	ApiAssetPublicKey,
	ApiToken,
	APIContributable,
	ApiMember,
	APIAbout,
	ApiRateLimit
} from '../interfaces';

// Base URL for the API
const API_BASE_URL = 'https://api.revanced.app';

// Helper function to build URLs with query parameters
function buildUrl(
	path: string,
	params?: Record<string, string | number | boolean | undefined>
): string {
	const url = new URL(`${API_BASE_URL}${path}`);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(key, String(value));
			}
		});
	}

	return url.toString();
}

// Implementation of AnnouncementsApi
class RevancedAnnouncementsApi implements AnnouncementsApi {
	async getAnnouncements(
		cursor?: number,
		count?: number,
		tag?: string
	): Promise<ApiResponseAnnouncement[]> {
		const url = buildUrl('/v4/announcements', { cursor, count, tag });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch announcements: ${response.statusText}`);
		}

		return await response.json();
	}

	async getLatestAnnouncement(tag?: string): Promise<ApiResponseAnnouncement[]> {
		const url = buildUrl('/v4/announcements/latest', { tag });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch latest announcement: ${response.statusText}`);
		}

		return await response.json();
	}

	async getLatestAnnouncementIds(tag?: string): Promise<ApiResponseAnnouncement[]> {
		const url = buildUrl('/v4/announcements/latest/id', { tag });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch latest announcement ids: ${response.statusText}`);
		}

		return await response.json();
	}

	async getAnnouncement(id: number): Promise<ApiResponseAnnouncement> {
		const url = buildUrl(`/v4/announcements/${id}`);
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch announcement: ${response.statusText}`);
		}

		return await response.json();
	}

	async createAnnouncement(announcement: ApiAnnouncement, token: string): Promise<void> {
		const url = buildUrl('/v4/announcements');
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(announcement)
		});

		if (!response.ok) {
			throw new Error(`Failed to create announcement: ${response.statusText}`);
		}
	}

	async updateAnnouncement(
		id: number,
		announcement: ApiAnnouncement,
		token: string
	): Promise<void> {
		const url = buildUrl(`/v4/announcements/${id}`);
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(announcement)
		});

		if (!response.ok) {
			throw new Error(`Failed to update announcement: ${response.statusText}`);
		}
	}

	async deleteAnnouncement(id: number, token: string): Promise<void> {
		const url = buildUrl(`/v4/announcements/${id}`);
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to delete announcement: ${response.statusText}`);
		}
	}

	async getAnnouncementTags(): Promise<string[]> {
		const url = buildUrl('/v4/announcements/tags');
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch announcement tags: ${response.statusText}`);
		}

		return await response.json();
	}
}

// Implementation of PatchesApi
class RevancedPatchesApi implements PatchesApi {
	async getCurrentRelease(prerelease?: boolean): Promise<ApiRelease> {
		const url = buildUrl('/v4/patches', { prerelease });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch current patches release: ${response.statusText}`);
		}

		return await response.json();
	}

	async getCurrentReleaseVersion(prerelease?: boolean): Promise<ApiReleaseVersion> {
		const url = buildUrl('/v4/patches/version', { prerelease });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch current patches version: ${response.statusText}`);
		}

		return await response.json();
	}

	async getPatchesList(prerelease?: boolean): Promise<string> {
		const url = buildUrl('/v4/patches/list', { prerelease });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch patches list: ${response.statusText}`);
		}

		return await response.json();
	}

	async getPublicKeys(): Promise<ApiAssetPublicKey> {
		const url = buildUrl('/v4/patches/keys');
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch patches public keys: ${response.statusText}`);
		}

		return await response.json();
	}
}

// Implementation of ManagerApi
class RevancedManagerApi implements ManagerApi {
	async getCurrentRelease(prerelease?: boolean): Promise<ApiRelease> {
		const url = buildUrl('/v4/manager', { prerelease });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch current manager release: ${response.statusText}`);
		}

		return await response.json();
	}

	async getCurrentReleaseVersion(prerelease?: boolean): Promise<ApiReleaseVersion> {
		const url = buildUrl('/v4/manager/version', { prerelease });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch current manager version: ${response.statusText}`);
		}

		return await response.json();
	}
}

// Implementation of GeneralApi
class RevancedGeneralApi implements GeneralApi {
	async getToken(authDigest: string): Promise<ApiToken> {
		const url = buildUrl('/v4/token');
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: authDigest
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to get token: ${response.statusText}`);
		}

		return await response.json();
	}

	async getContributors(): Promise<APIContributable[]> {
		const url = buildUrl('/v4/contributors');
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch contributors: ${response.statusText}`);
		}

		return await response.json();
	}

	async getTeamMembers(): Promise<ApiMember[]> {
		const url = buildUrl('/v4/team');
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch team members: ${response.statusText}`);
		}

		return await response.json();
	}

	async getAbout(): Promise<APIAbout> {
		const url = buildUrl('/v4/about');
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch about: ${response.statusText}`);
		}

		return await response.json();
	}

	async ping(): Promise<boolean> {
		const url = buildUrl('/v4/ping');
		const response = await fetch(url, { method: 'HEAD' });
		return response.ok;
	}

	async getRateLimit(): Promise<ApiRateLimit> {
		const url = buildUrl('/v4/backend/rate_limit');
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch rate limit: ${response.statusText}`);
		}

		return await response.json();
	}
}

// Main implementation of the RevancedApi interface
export class RevancedApiClient implements RevancedApi {
	public announcements: AnnouncementsApi;
	public patches: PatchesApi;
	public manager: ManagerApi;
	public general: GeneralApi;

	constructor() {
		this.announcements = new RevancedAnnouncementsApi();
		this.patches = new RevancedPatchesApi();
		this.manager = new RevancedManagerApi();
		this.general = new RevancedGeneralApi();
	}
}

// Create a singleton instance for easy importing
export const revancedApi = new RevancedApiClient();

// Example of how to use the API with dependency injection
export async function fetchTeamMembers(api: RevancedApi): Promise<ApiMember[]> {
	return await api.general.getTeamMembers();
}

// Example usage:
// const teamMembers = await fetchTeamMembers(revancedApi);
// or for testing:
// const mockApi = new MockRevancedApi();
// const teamMembers = await fetchTeamMembers(mockApi);
