export interface Logo {
	id: string;
	optimized_direct_url: string | null;
	logo_direct_url: string;
}

export type LogoAPIResponse = Logo[][];

// export interface LogoAPIResponse {
// 	[key: string]: {
// 		logos: APILogo[];
// 	};
// }

// export interface Logo {
// 	name: string;
// 	variants: APILogo[];
// }

// export interface Selected {

// }
