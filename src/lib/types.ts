export interface APILogo {
	id: string;
	gdrive_direct_url: string;
}

export interface LogoAPIResponse {
	[key: string]: {
		logos: APILogo[];
	};
}

export interface Logo {
	name: string;
	variants: APILogo[];
}

// export interface Selected {

// }
