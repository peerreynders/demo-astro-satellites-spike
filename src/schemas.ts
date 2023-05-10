import { z } from 'astro/zod';

const title = z.string().default('new blog post');
const category = z.string().default('codes');
const description = z.string().default('new blog post');
const author = z.string().default('Brother Nifty');
const date = z.date().default(() => new Date());
const draft = z.boolean().default(false);

const blog = z.object({
	title,
	category,
	description,
	author,
	date,
	draft,
	image: z
		.object({
			src: z.string(),
			alt: z.string(),
		})
		.optional(),
});

export type Post = {
	slug: string;
	title: z.infer<typeof title>;
	category: z.infer<typeof category>;
	description: z.infer<typeof description>;
	author: z.infer<typeof author>;
	date: z.infer<typeof date>;
	draft: z.infer<typeof draft>;
	content: string;
};

export type PostPersisted = Omit<Post, 'category' | 'author'> & {
	category: [string, z.infer<typeof category>];
	author: [string, z.infer<typeof author>];
};

export type PostSearchResult = Pick<
	PostPersisted,
	'slug' | 'title' | 'category' | 'description' | 'author' | 'date'
>;

export { blog };
