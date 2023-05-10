import { slug } from 'github-slugger';

// Force second argument to default
const slugify = (value: string) => slug(value);

const slugToBlogHref = (blogSlug: string) => '/blog/' + blogSlug;

const toAuthorHref = (name: string) => `/author/${slugify(name)}`;

const toCategoryHref = (name: string) => `/category/${slugify(name)}`;

export { slugToBlogHref, toAuthorHref, toCategoryHref };
