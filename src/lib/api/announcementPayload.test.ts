import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildAnnouncementPayload, type AnnouncementDraft } from './announcementPayload.ts';

const draft = (over: Partial<AnnouncementDraft> = {}): AnnouncementDraft => ({
	title: 'Title',
	content: 'Body',
	author: 'ReVanced',
	tags: ['Important'],
	createdAt: '2026-01-02T03:04Z',
	archivedAt: null,
	...over
});

describe('buildAnnouncementPayload', () => {
	describe('tags', () => {
		it('sends an empty array when no tags are selected', () => {
			const payload = buildAnnouncementPayload(draft({ tags: [] }));
			assert.deepEqual(payload.tags, []);
			assert.ok('tags' in payload);
			assert.ok(JSON.stringify(payload).includes('"tags":[]'));
		});

		it('sends a single tag', () => {
			assert.deepEqual(buildAnnouncementPayload(draft({ tags: ['Alpha'] })).tags, ['Alpha']);
		});

		it('sends multiple tags', () => {
			assert.deepEqual(buildAnnouncementPayload(draft({ tags: ['Alpha', 'Beta'] })).tags, [
				'Alpha',
				'Beta'
			]);
		});

		it('copies the array so later edits cannot mutate a sent payload', () => {
			const tags = ['Alpha'];
			const payload = buildAnnouncementPayload(draft({ tags }));
			tags.push('Beta');
			assert.deepEqual(payload.tags, ['Alpha']);
		});
	});

	describe('author', () => {
		it('sends an empty string when the author box is cleared', () => {
			const payload = buildAnnouncementPayload(draft({ author: '' }));
			assert.equal(payload.author, '');
			assert.ok(JSON.stringify(payload).includes('"author":""'));
		});

		it('sends an empty string when the author box holds only whitespace', () => {
			assert.equal(buildAnnouncementPayload(draft({ author: '   ' })).author, '');
		});

		it('trims a normal author', () => {
			assert.equal(buildAnnouncementPayload(draft({ author: '  ReVanced  ' })).author, 'ReVanced');
		});
	});

	describe('archived_at', () => {
		it('sends null when the announcement is not archived', () => {
			const payload = buildAnnouncementPayload(draft({ archivedAt: null }));
			assert.equal(payload.archived_at, null);
			assert.ok(JSON.stringify(payload).includes('"archived_at":null'));
		});

		it('sends the timestamp when archived', () => {
			assert.equal(
				buildAnnouncementPayload(draft({ archivedAt: '2026-03-04T05:06Z' })).archived_at,
				'2026-03-04T05:06Z'
			);
		});
	});

	describe('content', () => {
		it('trims normal content', () => {
			assert.equal(buildAnnouncementPayload(draft({ content: '  <b>x</b>  ' })).content, '<b>x</b>');
		});
	});

	it('omits created_at when there is no value', () => {
		const payload = buildAnnouncementPayload(draft({ createdAt: undefined }));
		assert.equal(payload.created_at, undefined);
		assert.ok(!JSON.stringify(payload).includes('created_at'));
	});
});
