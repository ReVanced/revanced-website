import * as settings from './settings';

// API Endpoints
import type {
	Patch,
	Repository,
	Metadata,
	Asset,
	TeamMember,
	DonationPlatform,
	CryptoWallet,
	Social,
	Info,
	CompatiblePackage,
	Announcement,
	NoAnnouncements,
	PostAnnouncement,
	Login as LoginRequest,
	Login,
	LoginResponse
} from '$lib/types';

export type ReposData = { repositories: Repository[] };
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { metadata: Metadata; assets: Asset[] };
export type TeamData = { members: TeamMember[] };
export type InfoData = { info: Info };
export type DonationData = { wallets: CryptoWallet[]; platforms: DonationPlatform[] };
export type SocialsData = { socials: Social[] };
export type AnnouncementsData = { announcements: Announcement[] | NoAnnouncements };

function build_url(endpoint: string) {
	return `${settings.api_base_url()}/${endpoint}`;
}

async function get_json(endpoint: string) {
	const url = build_url(endpoint);
	return await fetch(url).then((r) => r.json());
}

async function post_json(endpoint: string, body: any) {
	const url = build_url(endpoint);
	const token = settings.get_access_token();
	return await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token ? `Bearer ${token}` : ''
		},
		body: JSON.stringify(body)
	}).then((r) => r.json());
}

async function delete_json(endpoint: string) {
	const url = build_url(endpoint);
	return await fetch(url, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${settings.get_access_token()}`
		}
	}).then((r) => r.json());
}

async function repositories(): Promise<ReposData> {
	const json = await get_json('contributors');
	return { repositories: json.repositories };
}

async function manager(): Promise<ReleaseData> {
	const json = await get_json('v2/revanced-manager/releases/latest');
	// console.log(json.release.metadata.tag_name);
	console.log(json.release.assets[0].browser_download_url);
	return { metadata: json.release.metadata, assets: json.release.assets };
}

async function patches(): Promise<PatchesData> {
	const json = await get_json('v2/patches/latest');
	const packagesWithCount: { [key: string]: number } = {};

	// gets packages and patch count
	for (let i = 0; i < json.patches.length; i++) {
		json.patches[i].compatiblePackages?.forEach((pkg: CompatiblePackage) => {
			packagesWithCount[pkg.name] = (packagesWithCount[pkg.name] || 0) + 1;
		});
	}

	// sort packages by patch count to get most relevant apps on top
	const packages = Object.keys(packagesWithCount);
	packages.sort((a, b) => packagesWithCount[b] - packagesWithCount[a]);

	return { patches: json.patches, packages };
}

async function team(): Promise<TeamData> {
	const json = await get_json('v2/team/members');
	return { members: json.members };
}

async function info(): Promise<InfoData> {
	const json = await get_json('v2/info');
	return { info: json.info };
}

async function donate(): Promise<DonationData> {
	const json = await get_json('v2/donations');
	return { wallets: json.donations.wallets, platforms: json.donations.links };
}

async function socials(): Promise<SocialsData> {
	const json = await get_json('v2/socials');
	return { socials: json.socials };
}

async function announcements(channel?: string): Promise<AnnouncementsData> {
	const json = await get_json(channel ? `v2/announcements/${channel}` : 'v2/announcements');
	return { announcements: json.reverse() };
}

async function postAnnouncement(channel: string, announcement: PostAnnouncement) {
	await post_json(`v2/announcements/${channel}`, announcement);
}

async function deleteAnnouncement(announcementId: number) {
	await delete_json(`v2/announcements/${announcementId}`);
}

async function login(login: Login): Promise<LoginResponse> {
	return await post_json('v2/login', login);
}

export const staleTime = 5 * 60 * 1000;
export const queries = {
	manager: () => ({
		queryKey: ['manager'],
		queryFn: manager,
		staleTime
	}),
	patches: () => ({
		queryKey: ['patches'],
		queryFn: patches,
		staleTime
	}),
	repositories: () => ({
		queryKey: ['repositories'],
		queryFn: repositories,
		staleTime
	}),
	team: () => ({
		queryKey: ['team'],
		queryFn: team,
		staleTime
	}),
	info: () => ({
		queryKey: ['info'],
		queryFn: info,
		staleTime
	}),
	donate: () => ({
		queryKey: ['donate'],
		queryFn: donate,
		staleTime
	}),
	socials: () => ({
		queryKey: ['socials'],
		queryFn: socials,
		staleTime
	}),
	announcements: (channel?: string) => ({
		queryKey: ['announcements'],
		queryFn: () => announcements(channel)
	}),
	postAnnouncement: (channel: string, announcement: PostAnnouncement) => ({
		mutationKey: ['postAnnouncement'],
		mutationFn: () => postAnnouncement(channel, announcement)
	}),
	deleteAnnouncement: (announcementId: number) => ({
		mutationKey: ['deleteAnnouncement'],
		mutationFn: () => deleteAnnouncement(announcementId)
	}),
	login: (loginRequest: LoginRequest) => ({
		mutationKey: ['login'],
		mutationFn: () => login(loginRequest)
	})
};
