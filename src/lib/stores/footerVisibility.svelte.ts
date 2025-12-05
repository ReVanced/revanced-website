let visible = $state(false);

export const footerVisibility = {
	get isFooterSocialsVisible() {
		return visible;
	},
	set(val: boolean) {
		visible = val;
	}
};
