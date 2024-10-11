import * as settings from './settings';

// API Endpoints
import type {
	Patch,
	Contributable,
	Release,
	TeamMember,
	DonationPlatform,
	CryptoWallet,
	Social,
	About,
	CompatiblePackage,
	Announcement
} from '$lib/types';
import { get_access_token, is_logged_in, UnauthenticatedError } from '$lib/auth';

export type ContributorsData = { contributables: Contributable[] };
export type PatchesData = { patches: Patch[]; packages: string[] };
export type ReleaseData = { release: Release };
export type TeamData = { members: TeamMember[] };
export type AboutData = { about: About };
export type DonationData = { wallets: CryptoWallet[]; platforms: DonationPlatform[] };
export type SocialsData = { socials: Social[] };
export type AnnouncementsData = { announcements: Map<number, Announcement> };

type ApiAnnouncementCreate = {
	archivedAt?: string;
	attachmentUrls?: string[];
	author?: string;
	channel?: string;
	content?: string;
	level?: number;
	title: string;
};

export function build_url(endpoint: string) {
	return `${settings.api_base_url()}/${endpoint}`;
}

function build_headers() {
	const access_token_data = get_access_token();
	return {
		'Content-Type': 'application/json',
		Authorization: access_token_data ? `Bearer ${access_token_data.token}` : ''
	};
}

async function get_json(endpoint: string) {
	return await fetch(build_url(endpoint)).then((r) => r.json());
}

async function post_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'POST',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => r.json());
}

async function patch_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'PATCH',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => r.json());
}

async function delete_json(endpoint: string, body?: any) {
	if (!is_logged_in()) throw new UnauthenticatedError();
	const headers = build_headers();
	return await fetch(build_url(endpoint), {
		method: 'DELETE',
		headers,
		body: body ? JSON.stringify(body) : ''
	}).then((r) => r.json());
}

async function contributors(): Promise<ContributorsData> {
	const json = await get_json('v3/contributors');
	return { contributables: json };
}

async function manager(): Promise<ReleaseData> {
	const json = await get_json('v3/manager/latest');
	return { release: json };
}

async function patches(): Promise<PatchesData> {
	const json = await get_json('v3/patches/latest/list');
	const packagesWithCount: { [key: string]: number } = {};

	// gets packages and patch count
	for (let i = 0; i < json.length; i++) {
		json[i].compatiblePackages?.forEach((pkg: CompatiblePackage) => {
			packagesWithCount[pkg.name] = (packagesWithCount[pkg.name] || 0) + 1;
		});
	}

	// sort packages by patch count to get most relevant apps on top
	const packages = Object.keys(packagesWithCount);
	packages.sort((a, b) => packagesWithCount[b] - packagesWithCount[a]);

	return { patches: json, packages };
}

async function team(): Promise<TeamData> {
	const json = await get_json('v3/team');
	return { members: json };
}

async function about(): Promise<AboutData> {
	const json = await get_json('v3/about');
	return { about: json };
}

async function announcements(): Promise<AnnouncementsData> {
	// const json = await get_json(channel ? `v3/announcements/${channel}` : 'v3/announcements');
	// return { announcements: json.reverse() };

	const announcements = [
		{
			id: 1,
			author: 'ReVanced',
			title: 'ReVanced Manager',
			content: `<p>Recently we noticed that many users have unknowingly been using counterfeit versions of ReVanced. As an open-source project, occasional instances like this can unfortunately occur.</p> <p>While we strongly encourage freedom with what you do with ReVanced as an open-source project, it's important to note that we cannot guarantee the safety of counterfeits. Ultimately, it\'s a personal choice whom to trust.</p> <h3>How do I know if I am using counterfeit?</h3> <ul> <li>ReVanced is officially only available on <a href="https://revanced.app">revanced.app</a>, and any links you can find on <a href="https://revanced.app">revanced.app</a></li> <li>You downloaded any pre-patched app claiming to be ReVanced from a site other than <a href="https://revanced.app">revanced.app</a></li> </ul> <h3>Known counterfeits</h3> <p>A list of known counterfeit sites are:</p> <ul> <li>revanced.net</li> <li>revanced.to</li> <li>revancedextended.com</li> <li>revancedextended.io</li> <li>revancedapp.download</li> <li>revancedapps.com</li> <li>revancedapk.org</li> <li>revancedapp.io</li> <li>revancedapk.net</li> </ul> <h3>I downloaded counterfeit, what now?</h3> <p>Suppose you downloaded a counterfeit from a domain other than <a href="https://revanced.app">revanced.app</a>, then we strongly advise you to uninstall it and obtain the official version from <a href="https://revanced.app">revanced.app</a>.</p> <p>Unfortunately, gauging the security and safety impact of downloading counterfeits is hard. Therefore, you should update your passwords for any accounts you think may have been targeted and run a security and safety check on them.</p> <h3>Official links</h3> <ul> <li>Website: <a href="https://revanced.app">https://revanced.app</a></li> <li>GitHub: <a href="https://github.com/revanced">https://github.com/revanced</a></li> <li>Discord: <a href="https://revanced.app/discord">https://revanced.app/discord</a></li> <li>Reddit: <a href="https://reddit.com/r/revancedapp">https://reddit.com/r/revancedapp</a></li> <li>Twitter: <a href="https://twitter.com/@revancedapp">https://twitter.com/@revancedapp</a></li> <li>Telegram: <a href="https://t.me/@app_revanced">https://t.me/@app_revanced</a></li> <li>YouTube: <a href="https://youtube.com/@ReVanced">https://youtube.com/@ReVanced</a></li> <li>Donate: <a href="https://revanced.app/donate">https://revanced.app/donate</a></li> </ul> <h3>How to get ReVanced officially?</h3> <p>You can use <a href="https://github.com/ReVanced/revanced-cli">ReVanced CLI</a> or <a href="https://revanced.app/download">ReVanced Manager</a> from <a href="https://revanced.app">revanced.app</a> to get ReVanced. Refer to the documentation in ⁠&lt;#953993848374325269&gt; .</p>`,
			attachmentUrls: [],
			channel: 'youtube',
			createdAt: { value: '2029-10-23 19:07:31.154969' },
			level: 0
		},
		{
			id: 2,
			author: 'ReVanced',
			title: 'Return YouTube Dislike down',
			content: 'This is a test message',
			attachmentUrls: [],
			channel: 'revanced',
			createdAt: { value: '2023-10-26 22:05:28.508306' },
			level: 0
		},
		{
			id: 3,
			author: 'ReVanced',
			title: 'Return YouTube Dislike down',
			content: 'This is a test message',
			attachmentUrls: [],
			channel: 'revanced',
			createdAt: { value: '2023-10-26 22:05:52.443376' },
			level: 0
		},
		{
			id: 4,
			author: 'ReVanced',
			title: 'Test title',
			content: 'This is a test message',
			attachmentUrls: [],
			channel: 'revanced',
			createdAt: { value: '2023-10-26 22:24:02.621462' },
			level: 0
		},
		{
			id: 5,
			author: 'ReVanced',
			title: 'Test title',
			content: 'This is a test message',
			attachmentUrls: [
				'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65'
			],
			channel: 'revanced',
			createdAt: { value: '2023-10-26 22:27:23.246805' },
			level: 0
		},
		{
			id: 6,
			author: 'ReVanced',
			title: 'Test title',
			content: 'This is a test message',
			attachmentUrls: [
				'https://p3-ofp.static.pub/fes/cms/2022/12/07/m0521vlcnt1r2d29a50yjx8dagm5ve573937.png',
				'https://media.discordapp.net/attachments/1095487869923119144/1115436493050224660/revanced-logo.png?width=905&height=905'
			],
			channel: 'revanced',
			createdAt: { value: '2023-10-26 22:36:33.695140' },
			level: 2
		},
		{
			id: 7,
			author: 'ReVanced',
			title: 'Test title',
			content: 'This is a test message',
			attachmentUrls: [
				'https://p3-ofp.static.pub/fes/cms/2022/12/07/m0521vlcnt1r2d29a50yjx8dagm5ve573937.png',
				'https://media.discordapp.net/attachments/1095487869923119144/1115436493050224660/revanced-logo.png?width=905&height=905'
			],
			channel: 'revanced',
			createdAt: { value: '2023-10-26 22:47:05.331425' },
			level: 1
		},
		{
			id: 8,
			author: 'ReVanced',
			title: 'Test title',
			content: 'This is a test message',
			attachmentUrls: [
				'https://p3-ofp.static.pub/fes/cms/2022/12/07/m0521vlcnt1r2d29a50yjx8dagm5ve573937.png',
				'https://media.discordapp.net/attachments/1095487869923119144/1115436493050224660/revanced-logo.png?width=905&height=905'
			],
			channel: 'revanced',
			createdAt: { value: '2023-11-23 02:36:04.138995' },
			level: 2
		},
		{
			id: 9,
			author: 'ReVanced',
			title: 'YouTube history fixed',
			content:
				'\u003Cp\u003EOn 28 Feb 2024, YouTube has changed how videos are tracked. This change broke tracking history if you used the \u003Cb\u003EClient spoof\u003C/b\u003E patch for YouTube. A fix for it has been released with the latest version of ReVanced Patches. If you experience this issue, re-patch YouTube with the latest patches to apply the fix, otherwise ignore this.\u003C/p\u003E\u003Cbr\u003E\u003Cp\u003EFor more information visit one of our links below.\u003C/p\u003E\u003Cbr\u003E\u003Ch2\u003EOfficial links\u003C/h2\u003E\u003Cbr\u003E\u003Cp\u003EReVanced is always available at \u003Ca href="https://revanced.app"\u003Erevanced.app\u003C/a\u003E.\u003C/p\u003E\u003Cbr\u003E\u003Cul\u003E\u003Cli\u003E\u003Ca href="https://revanced.app"\u003EWebsite\u003C/a\u003E\u003C/li\u003E\u003Cli\u003E\u003Ca href="https://revanced.app/discord"\u003EDiscord\u003C/a\u003E\u003C/li\u003E\u003Cli\u003E\u003Ca href="https://www.reddit.com/r/revancedapp"\u003EReddit\u003C/a\u003E\u003C/li\u003E\u003Cli\u003E\u003Ca href="https://twitter.com/revancedapp"\u003ETwitter\u003C/a\u003E\u003C/li\u003E\u003Cli\u003E\u003Ca href="https://t.me/app_revanced"\u003ETelegram\u003C/a\u003E\u003C/li\u003E\u003Cli\u003E\u003Ca href="https://www.youtube.com/@ReVanced"\u003EYouTube\u003C/a\u003E\u003C/li\u003E\u003C/ul\u003E',
			attachmentUrls: [],
			channel: 'youtube',
			createdAt: { value: '2024-03-02 22:03:48.194543' },
			level: 0
		},
		{
			id: 13,
			author: 'ReVanced',
			title: 'YouTube playback speed menu fixed',
			content:
				'\u003Cp\u003EIf you patched the YouTube app with the \u003Cb\u003EClient spoof\u003C/b\u003E patch, the video playback speed menu may have been missing.\u003Cbr\u003EThis issues has been fixed now. Patch YouTube using the latest version of \u003Ca href=https://github.com/ReVanced/revanced-patches\u003EReVanced Patches\u003C/a\u003E. Make sure to use the \u003Cb\u003EClient spoof\u003C/b\u003E patch when patching YouTube.\u003C/p\u003E\u003Cbr\u003E\u003Cp\u003EFor more information visit one of our links below.\u003C/p\u003E\u003Cbr\u003E\u003Ch2\u003EOfficial links\u003C/h2\u003E\u003Cbr\u003E\u003Cp\u003EReVanced is always available at \u003Ca href=https://revanced.app\u003Erevanced.app\u003C/a\u003E.\u003C/p\u003E\u003Cbr\u003E\u003Cul\u003E\u003Cli\u003E\u003Ca href=https://revanced.app\u003EWebsite\u003C/a\u003E\u003Cli\u003E\u003Ca href=https://revanced.app/discord\u003EDiscord\u003C/a\u003E\u003Cli\u003E\u003Ca href=https://www.reddit.com/r/revancedapp\u003EReddit\u003C/a\u003E\u003Cli\u003E\u003Ca href=https://twitter.com/revancedapp\u003ETwitter\u003C/a\u003E\u003Cli\u003E\u003Ca href=https://t.me/app_revanced\u003ETelegram\u003C/a\u003E\u003Cli\u003E\u003Ca href=https://www.youtube.com/@ReVanced\u003EYouTube\u003C/a\u003E\u003C/ul\u003E',
			attachmentUrls: [],
			channel: 'youtube',
			createdAt: { value: '2024-06-02 23:28:57.028295' },
			level: 0
		}
	].sort((a, b) => a.id - b.id);

	const announcementsMap = new Map(
		announcements.map((announcement) => [announcement.id, announcement])
	);

	return { announcements: announcementsMap };
}

async function create_announcement(announcement: ApiAnnouncementCreate) {
	await post_json('v3/announcements', announcement);
}

async function update_announcement(announcement: ApiAnnouncementCreate) {
	await patch_json('v3/announcements', announcement);
}

async function delete_announcement(id: number) {
	await delete_json(`v3/announcements/${id}`);
}

async function archive_announcement(id: number) {
	await post_json(`v3/announcements/${id}/archive`);
}

async function unarchive_announcement(id: number) {
	await post_json(`v3/announcements/${id}/unarchive`);
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
	contributors: () => ({
		queryKey: ['contributors'],
		queryFn: contributors,
		staleTime
	}),
	team: () => ({
		queryKey: ['team'],
		queryFn: team,
		staleTime
	}),
	about: () => ({
		queryKey: ['info'],
		queryFn: about,
		staleTime
	}),
	announcements: () => ({
		queryKey: ['announcements'],
		queryFn: () => announcements(),
		staleTime
	})
};
