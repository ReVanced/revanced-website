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
	version: string;
	excluded: boolean;
	dependencies: string[];
	options: PatchOption[];
	compatiblePackages: CompatiblePackage[];
}

export interface CompatiblePackage {
	name: string;
	versions: string[];
}

export interface PatchOption {
	key: string;
	title: string;
	description: string;
	required: boolean;
	choices: string[];
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
	bio: string;
}

export interface CryptoWallet {
	network: string;
	currency_code: string;
	address: string;
}

export interface DonationPlatform {
	name: string;
	url: string;
}
