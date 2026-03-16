import { z } from 'zod';

export const SocialSchema = z.object({
	name: z.string(),
	url: z.string(),
	preferred: z.boolean().optional()
});

export const CryptoWalletSchema = z.object({
	network: z.string(),
	currency_code: z.string(),
	address: z.string(),
	preferred: z.boolean().optional()
});

export const DonationLinkSchema = z.object({
	name: z.string(),
	url: z.string(),
	preferred: z.boolean().optional()
});

export const DonationsSchema = z.object({
	wallets: z.array(CryptoWalletSchema),
	links: z.array(DonationLinkSchema)
});

export const ContactSchema = z.object({
	email: z.string()
});

export const BrandingSchema = z.object({
	logo: z.string()
});

export const AboutSchema = z.object({
	name: z.string(),
	about: z.string(),
	keys: z.string(),
	branding: BrandingSchema,
	contact: ContactSchema,
	socials: z.array(SocialSchema),
	donations: DonationsSchema,
	status: z.string()
});

export const GpgKeySchema = z.object({
	id: z.string(),
	url: z.string()
});

export const TeamMemberSchema = z.object({
	name: z.string(),
	avatar_url: z.string(),
	url: z.string(),
	bio: z.string().nullable().optional(),
	gpg_key: GpgKeySchema.nullable().optional()
});

export const ManagerReleaseSchema = z.object({
	version: z.string(),
	created_at: z.string(),
	description: z.string(),
	download_url: z.string()
});

export const ContributorSchema = z.object({
	name: z.string(),
	avatar_url: z.string(),
	url: z.string(),
	contributions: z.number()
});

export const ContributableSchema = z.object({
	name: z.string(),
	url: z.string(),
	contributors: z.array(ContributorSchema)
});

export const AnnouncementSchema = z.object({
	id: z.number(),
	author: z.string().nullable().optional().default(null),
	title: z.string(),
	content: z.string().nullable().optional().default(null),
	tags: z.array(z.string()).optional().default([]),
	created_at: z.string(),
	archived_at: z.string().nullable().optional().default(null),
	level: z.number().optional().default(0)
});

export const LatestAnnouncementIdSchema = z.object({
	tag: z.string().nullable().optional().default(null),
	id: z.number()
});

export const TaggedLatestAnnouncementSchema = z.object({
	tag: z.string().nullable().optional().default(null),
	announcement: AnnouncementSchema
});

export const TeamMembersSchema = z.array(TeamMemberSchema);
export const ContributablesSchema = z.array(ContributableSchema);
export const AnnouncementsSchema = z.array(AnnouncementSchema);
export const LatestAnnouncementIdsSchema = z.array(LatestAnnouncementIdSchema);
export const LatestAnnouncementsSchema = z.array(TaggedLatestAnnouncementSchema);
