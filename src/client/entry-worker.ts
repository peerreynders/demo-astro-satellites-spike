/// <reference lib="webworker" />
// file: src/client/entry-worker.ts
import { fetchPostsDb } from './worker/fetch-posts-db';
import { blogPosts } from './worker/blog-posts';
import { makePostSearch } from './worker/post-search';
import { result, type Requests } from './search-messages';
import type { PostPersisted } from '../schemas';

type Search = ReturnType<typeof makePostSearch>;

let serve: ((request: Requests) => void) | undefined;
const requests: Requests[] = [];

function isWorker(value: unknown): asserts value is DedicatedWorkerGlobalScope {
	let record =
		value && typeof value === 'object'
			? (value as Record<string, unknown>)
			: undefined;

	if (!(record && typeof record['close'] === 'function'))
		throw new Error('Not a Worker');
}

function handleRequest(search: Search, request: Requests) {
	switch (request.kind) {
		case 'post-search': {
			const posts = search(request.term);
			const response = result.searchPosts(request, posts);
			self.postMessage(response);
		}
	}
}

function handleMessage(event: MessageEvent<Requests>) {
	if (serve) {
		serve(event.data);
		return;
	}

	requests.push(event.data);
}

const keepPublished = (before: number) => (post: PostPersisted) =>
	!post.draft && post.date.getTime() <= before;

(async function start() {
	isWorker(self);

	if (typeof self['indexedDB'] !== 'object') {
		console.log("This worker doesn't support IndexedDB");
		self.close();
	}

	// Try not to miss any requests
	self.addEventListener('message', handleMessage);

	const refreshHref = self.location.origin + '/postsdb';
	const posts = await blogPosts((lastModified?: string) =>
		fetchPostsDb(refreshHref, lastModified)
	);

	const publishedPosts = posts.filter(keepPublished(Date.now()));
	const search = makePostSearch(publishedPosts);
	const requestHandler = (request: Requests) => handleRequest(search, request);

	// Process any accumulated request(s) (to preserve processing sequence)
	if (requests.length > 0) {
		const current = requests.slice();
		requests.length = 0;
		current.forEach(requestHandler);
	}

	// Now handle each request as it arrives
	serve = requestHandler;
})();
