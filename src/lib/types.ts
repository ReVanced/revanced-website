export interface Contributor {
	login: string;
	avatar_url: string;
	html_url: string;
}

export interface Repository {
	name: string;
	contributors: Contributor[];
}

export interface Patch {
	name: string;
	description: string;
	compatiblePackages: CompatiblePackage[];
	use: boolean;
	requiresIntegrations: boolean;
	options: PatchOption[];
}

export interface CompatiblePackage {
	name: string;
	versions: string[];
}

export interface PatchOption {
	key: string;
	default: any;
	title: string;
	description: string;
	required: boolean;
}

export interface Asset {
	name: string;
	content_type: string;
	browser_download_url: string;
}

export interface Metadata {
	tag_name: string;
	name: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	body: string;
}

export interface TeamMember {
	login: string;
	avatar_url: string;
	html_url: string;
	bio?: string;
}

export interface CryptoWallet {
	network: string;
	currency_code: string;
	address: string;
	preferred: boolean;
}

export interface DonationPlatform {
	name: string;
	url: string;
	preferred: boolean;
}

export interface Social {
	name: string;
	url: string;
}

interface Donations {
	wallets: CryptoWallet[];
	links: DonationPlatform[];
}

interface Contact {
	email: string;
}

export interface Info {
	name: string;
	about: string;
	contact: Contact;
	socials: Social[];
	donations: Donations;
}

interface Content {
	message: string | null;
	attachment_urls: string[] | null;
}

export interface Announcement {
	id: number;
	author: string | null;
	title: string;
	content: Content | null;
	channel: string;
	created_at: string;
	level: number | null;
}

export interface NoAnnouncements {
	message: string;
}

export interface PostAnnouncement {
	author: string | null;
	title: string;
	content: PostContent;
	channel: string;
	level: number | null;
}

interface PostContent {
	message: string;
	attachment_urls: string[];
}

export interface Login {
	username: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
}
