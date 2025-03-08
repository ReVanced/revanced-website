export type ResponseAnnouncement = {
	archived_at?: string;
	attachments?: string[];
	author?: string;
	tags?: string[];
	content?: string;
	created_at: string;
	id: number;
	level?: number;
	title: string;
};

export type Announcement = Omit<ResponseAnnouncement, 'id'>;

export type Tags = { name: string }[];

export interface Contributor {
	name: string;
	avatar_url: string;
	url: string;
	contributions: number;
}

export interface Contributable {
	name: string;
	url: string;
	contributors: Contributor[];
}

export interface Patch {
	name: string;
	description: string;
	use: boolean;
	compatiblePackages: CompatiblePackage[] | null;
	options: PatchOption[];
}

export interface CompatiblePackage {
	name: string;
	versions: string[] | null;
}

export interface PatchOption {
	key: string;
	title: string | null;
	description: string;
	required: boolean;
	type: string;
	default: any | null;
	values: any[] | null;
}

export interface Release {
	version: string;
	created_at: string;
	description: string;
	download_url: string;
}

export interface TeamMember {
	name: string;
	avatar_url: string;
	url: string;
	bio?: string;
	gpg_key: GpgKey;
}

export interface GpgKey {
	id: string;
	url: string;
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
	preferred: boolean;
}

interface Donations {
	wallets: CryptoWallet[];
	links: DonationPlatform[];
}

interface Contact {
	email: string;
}

export interface About {
	name: string;
	about: string;
	contact: Contact;
	socials: Social[];
	donations: Donations;
}
