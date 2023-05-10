import { defineCollection } from 'astro:content';
import { blog } from '../schemas';

export const collections = {
	blog: defineCollection({ schema: blog }),
};
