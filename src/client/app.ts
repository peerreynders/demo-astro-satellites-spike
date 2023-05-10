// file: src/client/app.ts
import type { Results } from './search-messages';
import type {
	MakeSearch,
	SendPostSearch,
	SinkPostSearchResult,
} from './app-types';
import type { PostSearchResult } from '../schemas';

class Sinks<V> {
	sinks = new Set<(value: V) => void>();

	add = (sink: (value: V) => void) => {
		const remove = () => void this.sinks.delete(sink);
		this.sinks.add(sink);
		return remove;
	};

	send = (value: V) => {
		for (const sink of this.sinks) sink(value);
	};
}

function makeApp(makeSearch: MakeSearch) {
	// Wire up for "post search"
	let lastSearch = '';
	const resultSinks = new Sinks<PostSearchResult[]>();
	const sinkPostSearchResult: SinkPostSearchResult = resultSinks.add;
	const receiveSearchResult = (result: Results) => {
		switch (result.kind) {
			case 'post-search': {
				// Only foward if this is result from the most recent search
				if (result.id !== lastSearch) return;

				resultSinks.send(result.results);
			}
		}
	};

	const search = makeSearch(receiveSearchResult);
	const sendPostSearch: SendPostSearch = (term: string) => {
		// Remember most recent search
		lastSearch = search.searchPosts(term);
	};

	return {
		sendPostSearch,
		sinkPostSearchResult,
	};
}

export { makeApp };
