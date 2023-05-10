// file: src/pages/postsdb.ts
import type { APIContext } from 'astro';
import { stat, readFile } from 'node:fs/promises';

// CAUTION: `dev` file only. To create:
// `$ npm run save:posts` while `$ npm run dev`

const PATH = './dev-posts.json';

const toLastModifiedValue = (mtimeMs: number) =>
	new Date(Math.trunc(mtimeMs)).toUTCString();

export async function get({ request }: APIContext) {
	const dataStat = await stat(PATH);
	const lastModifiedValue = toLastModifiedValue(dataStat.mtimeMs);

	const clientLastModified = (request.headers as Headers).get(
		'if-modified-since'
	);
	if (clientLastModified === lastModifiedValue) {
		return new Response(null, {
			status: 304,
			statusText: 'Not Modified',
		});
	}

	const headers = {
		'last-modified': lastModifiedValue,
		'content-type': 'application/json;charset=utf-8',
	};

	const body = await readFile(PATH);

	return new Response(body, {
		status: 200,
		statusText: 'OK',
		headers,
	});
}
