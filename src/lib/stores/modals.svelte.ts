import { SvelteMap } from 'svelte/reactivity';
import { browser } from '$app/environment';

class ModalStack {
	private stack = $state<string[]>([]);
	private modals = new SvelteMap<string, () => void>();
	private keydownHandler: ((e: KeyboardEvent) => void) | null = null;

	constructor() {
		if (browser) {
			this.setupKeyboardHandler();
		}
	}

	private setupKeyboardHandler() {
		this.keydownHandler = (e: KeyboardEvent) => {
			if (e.key === 'Escape' || e.key === 'Esc') {
				if (this.stack.length > 0) {
					e.preventDefault();
					e.stopPropagation();
					this.closeTop();
				}
			}
		};
		
		document.addEventListener('keydown', this.keydownHandler);
	}

	push(id: string, closeCallback: () => void) {
		if (!this.modals.has(id)) {
			this.stack.push(id);
			this.modals.set(id, closeCallback);
		}
	}

	pop(id: string) {
		const index = this.stack.indexOf(id);
		if (index !== -1) {
			this.stack.splice(index, 1);
			this.modals.delete(id);
		}
	}

	closeTop() {
		if (this.stack.length <= 0) return;
		const topId = this.stack[this.stack.length - 1];
		this.modals.get(topId)?.();
	}

	isTopModal(id: string): boolean {
		return this.stack.length > 0 && this.stack[this.stack.length - 1] === id;
	}

	getStack(): readonly string[] {
		return this.stack;
	}

	hasModals(): boolean {
		return this.stack.length > 0;
	}
}

export const modalsStack = new ModalStack();
