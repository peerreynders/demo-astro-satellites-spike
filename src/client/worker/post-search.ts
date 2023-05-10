// file: src/client/worker/post-search.ts
import Fuse from 'fuse.js';
import type { PostPersisted, PostSearchResult } from '../../schemas';

function toPostSearchResult({
	item: { slug, title, category, description, author, date },
}: Fuse.FuseResult<PostPersisted>) {
	const result: PostSearchResult = {
		slug,
		title,
		category,
		description,
		author,
		date,
	};

	return result;
}

function makePostSearch(posts: PostPersisted[]) {
	const fuse = new Fuse(posts, {
		keys: ['title', 'author', 'category', 'description', 'content'],
		shouldSort: true,
		minMatchCharLength: 1,
		threshold: 0.3,
	});

	return function search(term: string) {
		const results = fuse.search(term);
		return results.map(toPostSearchResult);
	};
}

export { makePostSearch };
