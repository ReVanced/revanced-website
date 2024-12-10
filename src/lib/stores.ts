import { readable } from 'svelte/store';
import { is_logged_in, get_access_token } from './auth';

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

const admin_login_info = (): AdminLoginInfo => {
	if (is_logged_in())
		return {
			logged_in: true,
			expires: get_access_token()!.expires,
			logged_in_previously: !!get_access_token()?.token
		};
	else
		return {
			logged_in: false,
			expires: undefined,
			logged_in_previously: !!get_access_token()?.token
		};
};

export const admin_login = readable<AdminLoginInfo>(admin_login_info(), (set) => {
	const checkLoginStatus = () => set(admin_login_info());

	checkLoginStatus();

	const interval = setInterval(checkLoginStatus, 100);
	return () => clearInterval(interval);
});

export const read_announcements = readable(
	new Set<number>(),
	() => () => new Set<number>(JSON.parse(localStorage.getItem('read_announcements') ?? '[]'))
);
