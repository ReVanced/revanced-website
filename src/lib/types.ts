export interface Contributor {
	name: string;
	avatar_url: string;
	url: string;
	contributions: number;
}

export interface Contributable {
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
	download_url: string;
}

export interface Release {
	version: string;
	created_at: string;
	description: string;
	assets: Asset[];
}

export interface TeamMember {
	name: string;
	avatar_url: string;
	url: string;
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
