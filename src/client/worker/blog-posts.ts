// file: src/client/worker/blog-posts
import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase, OpenDBCallbacks } from 'idb';
import type { PostPersisted } from '../../schemas';
import type { FetchRefresh, RefreshReturn } from './types';

const DB_NAME = 'BLOG_STORE';
const STATS_STORE_NAME = 'STATS';
const POSTS_STORE_NAME = 'POSTS';
const DB_VERSION = 1;

interface BlogDB extends DBSchema {
	STATS: {
		key: string;
		value: {
			lastModified: string;
		};
	};
	POSTS: {
		key: string;
		value: {
			posts: PostPersisted[];
		};
	};
}

function reviver(key: string, value: unknown) {
	if (key === 'date' && typeof value === 'string' && value.length > 0) {
		return new Date(value);
	}
	return value;
}

async function refreshPosts(
	db: IDBPDatabase<BlogDB>,
	refresh: RefreshReturn | undefined
) {
	if (refresh && refresh.kind === 'refresh') {
		// Update stores
		const holder = JSON.parse(refresh.payload, reviver) as {
			posts: PostPersisted[];
		};
		await db.put(POSTS_STORE_NAME, holder, POSTS_STORE_NAME);
		if (refresh.lastModified) {
			await db.put(
				STATS_STORE_NAME,
				{ lastModified: refresh.lastModified },
				POSTS_STORE_NAME
			);
		}
		return holder.posts;
	}

	// Get stored Posts
	const holder = await db.get(POSTS_STORE_NAME, POSTS_STORE_NAME);
	return holder ? holder.posts : ([] as PostPersisted[]);
}

type Upgrade = OpenDBCallbacks<BlogDB>['upgrade'];

const upgrade: Upgrade = (db: IDBPDatabase<BlogDB>) => {
	db.createObjectStore(STATS_STORE_NAME);
	db.createObjectStore(POSTS_STORE_NAME);
};

async function blogPosts(fetchRefresh: FetchRefresh) {
	let db: IDBPDatabase<BlogDB> | undefined;
	let posts: PostPersisted[] = [];
	try {
		db = await openDB<BlogDB>(DB_NAME, DB_VERSION, {
			upgrade,
		});

		const stats = await db.get(STATS_STORE_NAME, POSTS_STORE_NAME);
		const refresh = await fetchRefresh(stats ? stats.lastModified : undefined);
		posts = await refreshPosts(db, refresh);
	} finally {
		if (db) db.close();
	}

	return posts;
}

export { blogPosts };
