export type SHA256AuthHeader =
	`Digest username="${string}", realm="${string}", nonce="${string}", uri="${string}", algorithm=${string}, response="${string}"`;

export enum SpecialTargetValues {
	SELF = '_self',
	BLANK = '_blank',
	PARENT = '_parent',
	TOP = '_top'
}

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
