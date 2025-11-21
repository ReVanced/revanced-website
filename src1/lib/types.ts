export type Patch = {
	id: number;
	name: string;
	compatiblePackages?: Record<string, string[]> | { name: string; versions: string[] }[];
};

export type Contributable = {
	id: number;
	name: string;
};

export type Release = {
	id: number;
	version: string;
};

export type TeamMember = {
	id: number;
	name: string;
};

export type DonationPlatform = {
	id: number;
	name: string;
};

export type CryptoWallet = {
	id: number;
	address: string;
};

export type Social = {
	id: number;
	platform: string;
	url: string;
};

export type About = {
	status: string;
	contact: { email: string };
};

export type ResponseAnnouncement = {
	id: number;
	message: string;
};

export type Announcement = {
	id?: number;
	message: string;
};

export type Tags = string[];
import type { Snippet } from 'svelte';

export type WithChildren = { children: Snippet };
export type WithOptionalChildren = Partial<WithChildren>;
