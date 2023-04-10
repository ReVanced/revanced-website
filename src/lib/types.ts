export interface Logo {
	id: string;
	optimized_direct_url: string | null;
	logo_direct_url: string;
}

export interface LogoResult {
	votes: number;
	optimized_direct_url: string | null;
	logo_direct_url: string;
}

export type LogosResponse = Logo[][];
export type LogoResultResponse = LogoResult[][];
