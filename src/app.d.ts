// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				FALLBACK_STORAGE?: {
					idFromName(name: string): unknown;
					get(id: unknown): {
						fetch(input: string, init?: RequestInit): Promise<Response>;
					};
				};
			};
		}
	}
}

export {};
