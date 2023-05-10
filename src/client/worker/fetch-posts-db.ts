// file: src/client/worker/fetch-posts-db.ts
import type { Refresh, RefreshFail } from './types';

async function fetchPostsDb(href: string, lastModified?: string) {
	const headers: Record<string, string> = {
		accept: 'application/json',
	};
	if (lastModified) headers['if-modified-since'] = lastModified;

	const options = {
		method: 'GET',
		headers,
	};

	const response = await fetch(href, options);

	if (response.status === 304) {
		// Not Modified
		return undefined;
	}

	if (!response.ok)
		return {
			kind: 'fail',
			code: response.status,
			message: response.statusText,
		} as RefreshFail;

	const currentLastModified = response.headers.get('last-modified');
	const payload = await response.text();
	return {
		kind: 'refresh',
		lastModified: currentLastModified,
		payload,
	} as Refresh;
}

export { fetchPostsDb };
