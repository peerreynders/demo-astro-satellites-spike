// file: src/client/fragments/nav.ts
import type { QsaoSpec as Spec } from 'qsa-observer';
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

	const spec: Spec = {
		connected(element) {
			if (!(element instanceof HTMLElement)) return;

			const searchRef = element.querySelector('input');
			if (!(searchRef instanceof HTMLInputElement)) return;

			const binder = new Binder(element, searchRef, send);
			instances.set(element, binder);
			binder.searchRef.addEventListener('input', binder);
		},

		disconnected(element) {
			const binder = instances.get(element);
			if (!binder) return;

			binder.searchRef.removeEventListener('input', binder);
			instances.delete(element);
		},
	};

	return spec;
}

export { NAME, makeSpec };
