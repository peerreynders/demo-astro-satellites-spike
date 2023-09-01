// file: src/client/entry-client.ts
import Qsao from 'qsa-observer';
import { makeSearchClient } from './search-client';
import { makeApp } from './app';
import * as nav from './fragments/nav';
import * as footer from './fragments/footer';
import * as postSearchResult from './fragments/post-search-result';

// QuerySelectorAll Observer based
// (dis)connected callback
import type { QsaoSpec } from 'qsa-observer';

const query: string[] = [];
const registry = new Map<string, QsaoSpec>();
const root = self.document;

const qsao = Qsao({
	query,
	root,
	handle(element, connected, selector) {
		const spec = registry.get(selector);
		if (!spec) return;

		(connected ? spec.connected : spec.disconnected)?.(element);
	},
});

function define(name: string, spec: QsaoSpec) {
	const selector = '.' + name;
	if (query.includes(selector)) return;

	query.push(selector);
	registry.set(selector, spec);
	qsao.parse(root.querySelectorAll(selector));
}

// --- bootstrap client
function rendezvous() {
	// 1. Create app (injecting dependencies)
	const app = makeApp(makeSearchClient);

	// 2. Wire up the fragment (aka satellite) modules
	// (injecting ONLY relevant dependencies
	// de-coupled via `app-types.ts`)
	//
	const navSpec = nav.makeSpec(app.sendPostSearch);
	const postSearchResultSpec = postSearchResult.makeSpec(
		app.sinkPostSearchResult
	);

	// 3. Wire up the DOM (with regular-elements)
	define(nav.NAME, navSpec);
	define(postSearchResult.NAME, postSearchResultSpec);
	define(footer.NAME, footer.spec);
}

export { rendezvous };
