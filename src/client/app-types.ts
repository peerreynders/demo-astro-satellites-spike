// file: src/client/app-types.ts
import type { Results } from './search-messages';
import type { PostSearchResult } from '../schemas';

// Interfaces that have to be implemented BY
// the app's dependencies
export type MakeSearch = (cb: (result: Results) => void) => {
	searchPosts(term: string): string;
	terminate(): void;
};

// Interfaces implemented FOR
// dependencies of the app
export type SendPostSearch = (term: string) => void;
export type SinkPostSearchResult = (
	sinkFn: (results: PostSearchResult[]) => void
) => () => void;
