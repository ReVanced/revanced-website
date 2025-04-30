import type * as Interfaces from '$api/interfaces';
import type * as Models from '$api/models';

const mockAnnouncements: Models.BackendResponseAnnouncement[] = [
	{
		id: 1,
		title: 'ReVanced 2.0 Released',
		content: 'We are excited to announce the release of ReVanced 2.0 with many new features!',
		created_at: new Date('2023-10-01'),
		author: 'ReVanced Team',
		tags: ['release', 'major']
	},
	{
		id: 2,
		title: 'Patch Updates Available',
		content: 'Several patches have been updated to support the latest app versions.',
		created_at: new Date('2023-10-15'),
		author: 'Patch Team',
		tags: ['patches', 'update']
	},
	{
		id: 3,
		title: 'Community Guidelines Update',
		content: 'Please review our updated community guidelines.',
		created_at: new Date('2023-09-20'),
		author: 'Moderator',
		tags: ['community', 'rules']
	}
].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

const mockPatches: Models.BackendPatch[] = [
	{
		name: 'Remove Ads',
		description: 'Removes advertisements from the application',
		compatiblePackages: {
			'com.example.app': ['1.0.0', '1.1.0', '1.2.0']
		},
		options: [
			{
				title: 'Remove all ads',
				description: 'Removes all advertisements completely',
				required: true
			}
		]
	},
	{
		name: 'Background Play',
		description: 'Allows playing media in the background',
		compatiblePackages: {
			'com.example.app': ['1.0.0', '1.1.0'],
			'com.media.app': ['2.0.0', '2.1.0']
		},
		options: [
			{
				title: 'Notification Style',
				description: 'Choose the style of the notification',
				required: false,
				values: [
					{
						name: 'compact',
						value: 'Compact view'
					},
					{
						name: 'expanded',
						value: 'Expanded view'
					}
				]
			}
		]
	}
];

const mockContributors: Models.BackendContributable[] = [
	{
		name: 'ReVanced Core',
		url: 'https://github.com/revanced/revanced-core',
		contributors: [
			{
				name: 'Contributor1',
				avatar_url: 'https://github.com/avatar1.png',
				contributions: 45,
				url: 'https://github.com/contributor1'
			},
			{
				name: 'Contributor2',
				avatar_url: 'https://github.com/avatar2.png',
				contributions: 32,
				url: 'https://github.com/contributor2'
			}
		]
	}
];

const mockTeamMembers: Models.BackendTeamMember[] = [
	{
		name: 'Team Member 1',
		avatar_url: 'https://github.com/team1.png',
		url: 'https://github.com/teammember1',
		bio: 'Core developer and project lead'
	},
	{
		name: 'Team Member 2',
		avatar_url: 'https://github.com/team2.png',
		url: 'https://github.com/teammember2',
		bio: 'UI/UX designer',
		gpg_key: {
			id: 'ABC123',
			url: 'https://keys.openpgp.org/key/ABC123'
		}
	}
];

const mockAbout: Models.BackendAbout = {
	about:
		"ReVanced was born out of Vanced's discontinuation and it is our goal to continue the legacy of what Vanced left behind. Thanks to ReVanced Patcher, it's possible to create long-lasting patches for nearly any Android app. ReVanced's patching system is designed to allow patches to work on new versions of the apps automatically with bare minimum maintenance.",
	contact: {
		email: 'contact@revanced.app'
	},
	donations: {
		links: [
			{
				name: 'GitHub Sponsors',
				preferred: true,
				url: 'https://github.com/sponsors/revanced'
			},
			{
				name: 'Open Collective',
				preferred: false,
				url: 'https://opencollective.com/revanced'
			}
		],
		wallets: [
			{
				address: '0x123456789abcdef',
				currency_code: 'ETH',
				network: 'Ethereum',
				preferred: true
			}
		]
	},
	socials: [
		{
			name: 'GitHub',
			preferred: true,
			url: 'https://github.com/revanced'
		},
		{
			name: 'Twitter',
			preferred: false,
			url: 'https://twitter.com/revancedapp'
		}
	],
	status: 'https://status.revanced.app'
};

class MockAnnouncementsApi implements Interfaces.AnnouncementsApi {
	async getAnnouncements(
		cursor?: number,
		count?: number,
		tag?: string
	): Promise<Models.BackendResponseAnnouncement[]> {
		let result = [...mockAnnouncements];

		if (tag) result = result.filter((announcement) => announcement.tags?.includes(tag));
		if (cursor !== undefined) result = result.slice(cursor);
		if (count !== undefined) result = result.slice(0, count);

		return result;
	}

	async getLatestAnnouncement(tag?: string): Promise<Models.BackendResponseAnnouncement[]> {
		const announcements = await this.getAnnouncements(undefined, 1, tag);
		return announcements;
	}

	async getLatestAnnouncementIds(tag?: string): Promise<Models.BackendResponseAnnouncement[]> {
		const announcements = await this.getAnnouncements(undefined, undefined, tag);
		return announcements.map((a) => ({ id: a.id, title: a.title, created_at: a.created_at }));
	}

	async getAnnouncement(id: number): Promise<Models.BackendResponseAnnouncement> {
		const announcement = mockAnnouncements.find((a) => a.id === id);
		if (!announcement) throw new Error(`Announcement with ID ${id} not found`);

		return announcement;
	}

	async createAnnouncement(
		announcement: Models.BackendAnnouncement,
		authToken: string
	): Promise<void> {
		console.log('Created announcement with token:', authToken);
		return Promise.resolve();
	}

	async updateAnnouncement(
		id: number,
		announcement: Models.BackendAnnouncement,
		authToken: string
	): Promise<void> {
		console.log(`Updated announcement ${id} with token:`, authToken);
		return Promise.resolve();
	}

	async deleteAnnouncement(id: number, authToken: string): Promise<void> {
		console.log(`Deleted announcement ${id} with token:`, authToken);
		return Promise.resolve();
	}

	async getAnnouncementTags(): Promise<Models.BackendAnnouncementTag[]> {
		const tags = new Set<string>();
		mockAnnouncements.forEach((a) => {
			a.tags?.forEach((tag) => tags.add(tag));
		});
		return Array.from(tags).map((tag) => ({ name: tag }));
	}
}

class MockPatchesApi implements Interfaces.PatchesApi {
	async getCurrentRelease(prerelease?: boolean): Promise<Models.BackendLatestPatchesRelease> {
		return {
			created_at: new Date('2023-10-01'),
			description: 'Latest patches release with bug fixes',
			download_url:
				'https://github.com/ReVanced/revanced-patches/releases/download/v5.21.0/patches-5.21.0.rvp',
			version: 'v5.21.0',
			signature_download_url:
				'https://github.com/ReVanced/revanced-patches/releases/download/v5.21.0/patches-5.21.0.rvp.asc'
		};
	}

	async getCurrentReleaseVersion(prerelease?: boolean): Promise<Models.BackendAssetVersion> {
		return {
			version: 'v5.21.0'
		};
	}

	async getPatchesList(prerelease?: boolean): Promise<Models.BackendPatch[]> {
		return mockPatches;
	}
}

class MockManagerApi implements Interfaces.ManagerApi {
	async getCurrentRelease(prerelease?: boolean): Promise<Models.BackendLatestManagerRelease> {
		return {
			created_at: new Date('2023-10-05'),
			description: 'Latest manager release',
			download_url:
				'https://github.com/ReVanced/revanced-manager/releases/download/v1.24.0/revanced-manager-1.24.0.apk',
			version: 'v1.24.0'
		};
	}

	async getCurrentReleaseVersion(prerelease?: boolean): Promise<Models.BackendAssetVersion> {
		return {
			version: 'v1.24.0'
		};
	}
}

class MockGeneralApi implements Interfaces.GeneralApi {
	async getToken(username: string, password: string): Promise<Models.BackendToken> {
		if (username === 'admin' && password === 'password') {
			return { token: 'mock-auth-token-12345' };
		}
		throw new Error('Invalid credentials');
	}

	async getContributors(): Promise<Models.BackendContributable[]> {
		return mockContributors;
	}

	async getTeamMembers(): Promise<Models.BackendTeamMember[]> {
		return mockTeamMembers;
	}

	async getAbout(): Promise<Models.BackendAbout> {
		return mockAbout;
	}

	async ping(): Promise<boolean> {
		return Math.random() >= 0.5;
	}

	async getRateLimit(): Promise<Models.BackendRateLimit> {
		return {
			limit: 60,
			remaining: 59,
			reset: new Date(Date.now() + 3600000)
		};
	}
}

const api: Interfaces.ReVancedApi = {
	announcements: new MockAnnouncementsApi(),
	patches: new MockPatchesApi(),
	manager: new MockManagerApi(),
	general: new MockGeneralApi()
};

export default api;
