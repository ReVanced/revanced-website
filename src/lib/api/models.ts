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

export type BackendLatestPatchesRelease = {
	created_at: Date;
	description: string;
	download_url: string;
	signature_download_url?: string;
	version: string;
};

export type BackendLatestPatchesVersion = {
	version: string;
};

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

// TODO

export type BackendAssetPublicKey = {
	patches_public_key: string;
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

export type BackendMember = {
	avatar_url: string;
	bio?: string;
	gpg_key?: BackendGpgKey;
	name: string;
	url: string;
};

export type BackendAboutBranding = {
	logo: string;
};

export type BackendAboutContact = {
	email: string;
};

export type BackendAboutLink = {
	name: string;
	preferred?: boolean;
	url: string;
};

export type BackendAboutWallet = {
	address: string;
	currency_code: string;
	network: string;
	preferred?: boolean;
};

export type BackendAboutDonations = {
	links?: BackendAboutLink[];
	wallets?: BackendAboutWallet[];
};

export type BackendAboutSocial = {
	name: string;
	preferred?: boolean;
	url: string;
};

export type BackendAbout = {
	about: string;
	branding?: BackendAboutBranding;
	contact?: BackendAboutContact;
	donations?: BackendAboutDonations;
	keys: string;
	name: string;
	socials?: BackendAboutSocial[];
	status: string;
};

export type BackendRateLimit = {
	limit: number;
	remaining: number;
	reset: Date;
};
