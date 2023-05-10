// file: src/pages/posts.json.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugToBlogHref, toAuthorHref, toCategoryHref } from '../route-path';
import type { PostPersisted } from '../schemas';

export const prerender = true;

const toPost = ({
	data: { title, category, description, author, date, draft },
	body,
	slug,
}: CollectionEntry<'blog'>) => {
	const post: PostPersisted = {
		title,
		category: [toCategoryHref(category), category],
		description,
		author: [toAuthorHref(author), author],
		date,
		draft,
		content: body,
		slug: slugToBlogHref(slug),
	};
	return post;
};

export async function get() {
	const entries = await getCollection('blog');
	const body = JSON.stringify({
		posts: entries.map(toPost),
	});
	return { body };
}
