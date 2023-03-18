export interface Logo {
	id: string;
	optimized_direct_url: string | null;
	logo_direct_url: string;
}

export type LogoAPIResponse = Logo[][];
