// Accessible modal stack store.
// Provides subscribe plus helpers: open, close, closeTop, isTop, isOpen, top.
// No Svelte runes here – plain store for consumption by components.

import { writable, type Subscriber, type Unsubscriber } from 'svelte/store';

function createModalStack() {
  // Stack of modal ids, top is last element
  const { subscribe, set, update } = writable<string[]>([]);

  // Map of id -> close callback
  const callbacks = new Map<string, () => void>();

  function open(id: string, onClose?: () => void) {
    update((stack) => {
      if (!stack.includes(id)) {
        stack = [...stack, id];
        if (onClose) callbacks.set(id, onClose);
      }
      return stack;
    });
  }

  function close(id: string) {
    update((stack) => {
      const idx = stack.indexOf(id);
      if (idx !== -1) {
        const newStack = [...stack.slice(0, idx), ...stack.slice(idx + 1)];
        callbacks.delete(id);
        return newStack;
      }
      return stack;
    });
  }

  function closeTop() {
    let topId: string | undefined;
    update((stack) => {
      if (stack.length === 0) return stack;
      topId = stack[stack.length - 1];
      const newStack = stack.slice(0, -1);
      return newStack;
    });
    if (topId) {
      const cb = callbacks.get(topId);
      callbacks.delete(topId);
      cb?.();
    }
  }

  function isTop(id: string): boolean {
    let current: string[] = [];
    const unsub = subscribe((s) => (current = s));
    unsub();
    return current.length > 0 && current[current.length - 1] === id;
  }

  function isOpen(id: string): boolean {
    let current: string[] = [];
    const unsub = subscribe((s) => (current = s));
    unsub();
    return current.includes(id);
  }

  function top(): string | undefined {
    let current: string[] = [];
    const unsub = subscribe((s) => (current = s));
    unsub();
    return current[current.length - 1];
  }

  return {
    subscribe,
    open,
    close,
    closeTop,
    isTop,
    isOpen,
    top
  };
}

export const modalStack = createModalStack();

export type ModalStackStore = typeof modalStack;