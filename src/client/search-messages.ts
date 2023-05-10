// file: src/client/search-messages.ts
import { nanoid } from 'nanoid';
import type { PostSearchResult } from '../schemas';

export type SearchPosts = {
	kind: 'post-search';
	id: string;
	term: string;
};

export type ResultSearchPosts = {
	kind: 'post-search';
	id: string;
	results: PostSearchResult[];
};

// Requests: Main ➔  Worker
export type Requests = SearchPosts;
// Results: Worker ➔  Main
export type Results = ResultSearchPosts;

const request = {
	searchPosts(term: string) {
		const message: SearchPosts = {
			kind: 'post-search',
			id: nanoid(),
			term,
		};
		return message;
	},
};

const result = {
	searchPosts(request: SearchPosts, results: PostSearchResult[]) {
		const message: ResultSearchPosts = {
			kind: 'post-search',
			id: request.id,
			results,
		};
		return message;
	},
};

export { request, result };
