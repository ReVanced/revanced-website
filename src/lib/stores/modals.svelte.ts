import { SvelteMap } from 'svelte/reactivity';

class ModalStack {
	private stack = $state<string[]>([]);
	private modals = new SvelteMap<string, () => void>();

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

	open(id: string) {
		const callback = this.modals.get(id);
		if (!this.stack.includes(id)) {
			this.stack.push(id);
			if (!callback) {
				this.modals.set(id, () => this.close(id));
			}
		}
	}

	close(id: string) {
		const callback = this.modals.get(id);
		if (callback) {
			callback();
		}
		this.pop(id);
	}

	closeTop() {
		if (this.stack.length <= 0) return;
		const topId = this.stack[this.stack.length - 1];
		this.close(topId);
	}

	isOpen(id: string): boolean {
		return this.stack.includes(id);
	}

	isTopModal(id: string): boolean {
		return this.stack.length > 0 && this.stack[this.stack.length - 1] === id;
	}

	getStack(): readonly string[] {
		return this.stack;
	}
}

export const modalsStack = new ModalStack();
