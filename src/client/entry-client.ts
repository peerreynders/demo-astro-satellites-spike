// file: src/client/entry-client.ts
import { define } from 'regular-elements';
import { makeSearchClient } from './search-client';
import { makeApp } from './app';
import * as nav from './fragments/nav';
import * as footer from './fragments/footer';
import * as postSearchResult from './fragments/post-search-result';

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
	define('.' + nav.NAME, navSpec);
	define('.' + postSearchResult.NAME, postSearchResultSpec);
	define('.' + footer.NAME, footer.spec);
}

export { rendezvous };
