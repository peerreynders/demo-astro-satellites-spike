// file: ./save-posts.mjs
import { stat, writeFile } from 'node:fs/promises';

const RESOURCE_HREF = 'http://localhost:3000/posts.json';
const TARGET_PATH = './dev-posts.json';

const toLastModifiedValue = (mtimeMs) =>
	new Date(Math.trunc(mtimeMs)).toUTCString();

function exitWithError(error) {
	const message =
		error instanceof Error
			? error.message
			: typeof error === 'string'
			? error
			: undefined;
	if (message) console.error(message);

	console.log(
		'Usage example: $ node save-posts.mjs\nwhile `$ npm run dev` in another terminal'
	);
	process.exit(1);
}

try {
	const response = await fetch(RESOURCE_HREF);
	if (!response.ok) {
		throw new Error(
			`HTTP error status (${response.status}): ${response.statusText}`
		);
	}
	const data = await response.text();
	await writeFile(TARGET_PATH, data);

	console.log(`“${RESOURCE_HREF}” saved to “${TARGET_PATH}”`);

	const dataStat = await stat(TARGET_PATH);
	const lastModified = toLastModifiedValue(dataStat.mtimeMs);

	console.log(`Current 'last-modified' value: «${lastModified}»`);
} catch (e) {
	exitWithError(e);
}
