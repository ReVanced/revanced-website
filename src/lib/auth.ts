export function get_access_token() {
	// Dummy implementation, replace with real logic
	return { token: 'dummy-token' };
}

export function is_logged_in() {
	// Dummy implementation, replace with real logic
	return true;
}

export class UnauthenticatedError extends Error {
	constructor(message = 'User is not authenticated') {
		super(message);
		this.name = 'UnauthenticatedError';
	}
}
