export type BackendResponseAnnouncement = {
	archived_at?: Date;
	attachments?: string[];
	author?: string;
	content?: string;
	created_at: Date;
	id: number;
	tags?: string[];
	title: string;
};

export type BackendAnnouncement = {
	archived_at?: Date;
	attachments?: string[];
	author?: string;
	content?: string;
	created_at?: Date;
	level?: number;
	tags?: string[];
	title: string;
};

type BackendAssetRelease = {
	created_at: Date;
	description: string;
	download_url: string;
	version: string;
};
export type BackendLatestPatchesRelease = BackendAssetRelease & { signature_download_url?: string };
export type BackendLatestManagerRelease = BackendAssetRelease;

type BackendAssetVersion = {
	version: string;
};
export type BackendLatestPatchesVersion = BackendAssetVersion;
export type BackendLatestManagerVersion = BackendAssetVersion;

export type BackendCompatiblePackage = Record<string, string[]>;
export type BackendPatchOptionValue = Record<string, string | number>;
export type BackendPatchOption = {
	title: string;
	description: string;
	required: boolean;
	values?: BackendPatchOptionValue[];
};
export type BackendPatch = {
	name: string;
	description: string;
	compatiblePackages: BackendCompatiblePackage;
	options: BackendPatchOption[];
};

export type BackendToken = {
	token: string;
};

export type BackendContributor = {
	avatar_url: string;
	contributions: number;
	name: string;
	url: string;
};
export type BackendContributable = {
	contributors: BackendContributor[];
	name: string;
	url: string;
};

export type BackendGpgKey = {
	id: string;
	url: string;
};
export type BackendTeamMember = {
	avatar_url: string;
	bio?: string;
	gpg_key?: BackendGpgKey;
	name: string;
	url: string;
};

type BackendAboutContact = {
	email: string;
};
type BackendAboutUrl = {
	name: string;
	preferred: boolean;
	url: string;
};
type BackendAboutWallet = {
	address: string;
	currency_code: string;
	network: string;
	preferred: boolean;
};
type BackendAboutDonations = {
	links: BackendAboutUrl[];
	wallets: BackendAboutWallet[];
};
export type BackendAbout = {
	contact: BackendAboutContact;
	donations: BackendAboutDonations;
	socials: BackendAboutUrl[];
	status: string;
};

export type BackendRateLimit = {
	limit: number;
	remaining: number;
	reset: Date;
};
