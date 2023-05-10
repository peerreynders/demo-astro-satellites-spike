import { slug } from 'github-slugger';

// Force second argument to default
const slugify = (value: string) => slug(value);

const toAuthorHref = (name: string) => `/author/${slugify(name)}`;

const toCategoryHref = (name: string) => `/category/${slugify(name)}`;

export { toAuthorHref, toCategoryHref };
