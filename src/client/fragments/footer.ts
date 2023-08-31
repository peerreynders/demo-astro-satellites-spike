// file: src/client/fragments/footer.ts
import type { QsaoSpec as Spec } from 'qsa-observer';

const NAME = 'js\\:f-footer';

const spec: Spec = {
	connected(element: Element) {
		console.log(this);
		const span = element.querySelector('#copyright');
		if (span) span.textContent = new Date().getFullYear().toString();
	},
};

export { NAME, spec };
