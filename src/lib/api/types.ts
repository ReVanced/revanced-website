export type Social = {
	name: string;
	url: string;
	preferred: boolean;
};

export type CryptoWallet = {
	network: string;
	currency_code: string;
	address: string;
	preferred: boolean;
};

export type DonationLink = {
	name: string;
	url: string;
	preferred: boolean;
};

export type Donations = {
	wallets: CryptoWallet[];
	links: DonationLink[];
};

export type Contact = {
	email: string;
};

export type Branding = {
	logo: string;
};

export type About = {
	name: string;
	about: string;
	keys: string;
	branding: Branding;
	contact: Contact;
	socials: Social[];
	donations: Donations;
	status: string;
};


export type GpgKey = {
	id: string;
	url: string;
};

export type TeamMember = {
	name: string;
	avatar_url: string;
	url: string;
	bio?: string;
	gpg_key?: GpgKey;
};


export type ManagerRelease = {
	version: string;
	created_at: string;
	description: string;
	download_url: string;
};


export type Contributor = {
	name: string;
	avatar_url: string;
	url: string;
	contributions: number;
};

export type Contributable = {
	name: string;
	url: string;
	contributors: Contributor[];
};


export type CompatiblePackage = {
	name: string;
	versions: string[] | null;
};

export type PatchOption = {
	key: string;
	title: string;
	description: string;
	required: boolean;
	type: string;
	default: unknown;
	values: Record<string, unknown> | null;
};

export type Patch = {
	name: string;
	description: string | null;
	use: boolean;
	dependencies: string[];
	compatiblePackages: Record<string, string[] | null> | null;
	options: PatchOption[];
};

export type Announcement = {
	id: number;
	author: string | null;
	title: string;
	content: string | null;
	attachments: string[];
	tags: string[];
	created_at: string;
	archived_at: string | null;
	level: number;
};