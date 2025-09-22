import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { get_announcement_by_id, queries } from '$data/api';

export const prerender = false; // Temporarily disable
export const ssr = true;

// This tells SvelteKit which dynamic routes to prerender
export const entries: EntryGenerator = async ({ fetch }) => {
	try {
		console.log('Generating entries for prerendering...');
		const response = await fetch('/api/announcements');

		if (!response.ok) {
			console.warn('Failed to fetch announcements for prerendering');
			return [];
		}

		const data = await response.json();

		const entries = data.announcements.map((announcement: any) => {
			const slug = announcement.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '');

			console.log(`Generated entry: ${announcement.id}-${slug}`);
			return { slug: `${announcement.id}-${slug}` };
		});

		// Always include the create route
		entries.push({ slug: 'create' });

		return entries;
	} catch (error) {
		console.warn('Error generating entries:', error);
		return [{ slug: 'create' }]; // At least include create route
	}
};

export const load: PageServerLoad = async ({ params, fetch }) => {
	console.log('=== SERVER LOAD CALLED ===', params.slug);

	const announcementId = 14;
	console.log('Parsed announcementId:', announcementId);

	if (!announcementId || announcementId === 'create') {
		console.log('Returning isCreating: true');
		return { isCreating: true };
	}

	try {
		console.log('Fetching announcement...');
		const response = await get_announcement_by_id(announcementId);
		console.log('Successfully loaded announcement:', response.announcement?.title);

		return {
			isCreating: false,
			announcement: response.announcement,
			announcementId: announcementId
		};
	} catch (err) {
		// console.log('Caught error:', err);
		// throw error(404, 'Announcement not found');
	}
};
