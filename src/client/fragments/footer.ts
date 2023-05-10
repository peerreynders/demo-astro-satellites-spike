// file: src/client/fragments/footer.ts
import type { RegularElementsOptions as Spec } from 'regular-elements';

const NAME = 'js\\:f-footer';

const spec: Spec = {
	connectedCallback(this: Element) {
		const span = this.querySelector('#copyright');
		if (span) span.textContent = new Date().getFullYear().toString();
	},
};

export { NAME, spec };
