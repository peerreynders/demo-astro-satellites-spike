// file: src/client/fragments/nav.ts
import type { RegularElementsOptions as Spec } from 'regular-elements';
import type { SendPostSearch } from '../app-types';

const NAME = 'js\\:f-nav';

class Binder {
	constructor(
		public readonly root: HTMLElement,
		public readonly searchRef: HTMLInputElement,
		public readonly send: SendPostSearch
	) {}

	handleEvent(event: Event) {
		switch (event.type) {
			case 'input': {
				if (event.target !== this.searchRef) return;

				this.send(this.searchRef.value.trim());
				event.preventDefault();
				event.stopPropagation();
			}
		}
	}
}

function makeSpec(send: SendPostSearch) {
	const instances = new WeakMap<Element, Binder>();

	function connectedCallback(this: Element) {
		if (!(this instanceof HTMLElement)) return;

		const searchRef = this.querySelector('input');
		if (!(searchRef instanceof HTMLInputElement)) return;

		const binder = new Binder(this, searchRef, send);
		instances.set(this, binder);
		binder.searchRef.addEventListener('input', binder);
	}

	function disconnectedCallback(this: Element) {
		const binder = instances.get(this);
		if (!binder) return;

		binder.searchRef.removeEventListener('input', binder);
		instances.delete(this);
	}

	const spec: Spec = {
		connectedCallback,
		disconnectedCallback,
	};

	return spec;
}

export { NAME, makeSpec };
