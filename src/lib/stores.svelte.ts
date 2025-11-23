import { browser } from '$app/environment';
import { is_logged_in, get_access_token, AUTH_CHANGE_EVENT } from './auth';

type AdminLoginInfo =
	| {
			logged_in: true;
			expires: number;
			logged_in_previously: boolean;
	  }
	| {
			logged_in: false;
			expires: undefined;
			logged_in_previously: boolean;
	  };

class AdminLoginStore {
	value = $state<AdminLoginInfo>({
		logged_in: false,
		expires: undefined,
		logged_in_previously: false
	});

	constructor() {
		this.update();
		if (browser) {
			window.addEventListener(AUTH_CHANGE_EVENT, () => this.update());
			window.addEventListener('storage', (e) => {
				if (e.key === 'revanced_api_access_token') this.update();
			});
		}
	}

	update() {
		const token = get_access_token();
		const loggedIn = is_logged_in();

		this.value = loggedIn
			? {
					logged_in: true,
					expires: token!.expires,
					logged_in_previously: !!token?.token
				}
			: {
					logged_in: false,
					expires: undefined,
					logged_in_previously: !!token?.token
				};
	}
}

export const admin_login = new AdminLoginStore();

class ReadAnnouncementsStore {
	_set = $state<Set<number>>(new Set());

	constructor() {
		if (browser) {
			const key = 'read_announcements';
			this.load(key);

			window.addEventListener('storage', (e) => {
				if (e.key === key) {
					this.load(key);
				}
			});
		}
	}

	private load(key: string) {
		const data = localStorage.getItem(key);
		try {
			const parsedArray = data ? JSON.parse(data) : [];
			if (Array.isArray(parsedArray)) {
				this._set = new Set(parsedArray);
			}
		} catch (e) {
			console.error('Failed to parse read_announcements', e);
		}
	}

	get value() {
		return this._set;
	}

	add(id: number) {
		this._set.add(id);
		this.sync();
	}

	addAll(ids: number[]) {
		ids.forEach((id) => this._set.add(id));
		this.sync();
	}

	sync() {
		if (browser) {
			localStorage.setItem('read_announcements', JSON.stringify(Array.from(this._set)));
		}
	}
}

export const read_announcements = new ReadAnnouncementsStore();

export const passed_login_with_creds = $state({ value: false });
export const allowAnalytics = $state({ value: false });
