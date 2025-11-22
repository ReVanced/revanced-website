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

		if (loggedIn) {
			this.value = {
				logged_in: true,
				expires: token!.expires,
				logged_in_previously: !!token?.token
			};
		} else {
			this.value = {
				logged_in: false,
				expires: undefined,
				logged_in_previously: !!token?.token
			};
		}
	}
}

export const admin_login = new AdminLoginStore();

class ReadAnnouncementsStore {
	_set = $state<Set<number>>(new Set());

	constructor() {
		if (browser) {
			const key = 'read_announcements';
			const data = localStorage.getItem(key);
			const parsedArray = data ? JSON.parse(data) : [];
			this._set = new Set(parsedArray);

			window.addEventListener('storage', (e) => {
				if (e.key === key) {
					const data = localStorage.getItem(key);
					const parsedArray = data ? JSON.parse(data) : [];
					this._set = new Set(parsedArray);
				}
			});
		}
	}

	get value() {
		return this._set;
	}

	add(id: number) {
		const newSet = new Set(this._set);
		newSet.add(id);
		this._set = newSet;
		this.sync();
	}

	addAll(ids: number[]) {
		const newSet = new Set(this._set);
		ids.forEach((id) => newSet.add(id));
		this._set = newSet;
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
