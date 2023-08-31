// file: src/client/fragments/post-search-result.ts
import { formatDateForPost } from '../shame';

import type { QsaoSpec as Spec } from 'qsa-observer';
import type { SinkPostSearchResult } from '../app-types';
import type { PostSearchResult } from '../../schemas';

const NAME = 'js\\:f-post-search-result';
const TEMPLATE_ITEM_ID = 'post-result-item';

function getItemTemplate() {
	const template = document.getElementById(TEMPLATE_ITEM_ID);
	if (!(template instanceof HTMLTemplateElement))
		throw Error('post-result-item template not found');

	return template;
}

type Bind = {
	readonly root: HTMLUListElement;
	readonly itemTemplate: HTMLTemplateElement;
	readonly items: Map<string, HTMLLIElement>;
};

function fillPostResultItem(root: HTMLLIElement, post: PostSearchResult) {
	const category = root.querySelector('.js-category');
	if (category instanceof HTMLAnchorElement) {
		category.href = post.category[0];
		category.textContent = post.category[1];
	}

	const title = root.querySelector('.js-title');
	if (title instanceof HTMLAnchorElement) {
		title.textContent = post.title;
		title.href = post.slug;
	}

	const author = root.querySelector('.js-author');
	if (author instanceof HTMLAnchorElement) {
		author.href = post.author[0];
		author.textContent = post.author[1];

		const parent = author.parentNode;
		if (parent) {
			// "insertAfter()"
			parent.insertBefore(
				document.createTextNode(` ${formatDateForPost(post.date)}`),
				author.nextSibling
			);
		}
	}

	const description = root.querySelector('.js-description');
	if (description instanceof HTMLParagraphElement)
		description.textContent = post.description;

	const link = root.querySelector('.js-link');
	if (link instanceof HTMLAnchorElement) link.href = post.slug;

	return root;
}

function clonePostResultItem(
	template: HTMLTemplateElement,
	post: PostSearchResult
) {
	const root = template.content.firstElementChild;
	if (!(root instanceof HTMLLIElement))
		throw new Error('Unexpected post-result-item template root');

	return fillPostResultItem(root.cloneNode(true) as HTMLLIElement, post);
}

function renderResults(
	{ root, itemTemplate, items }: Bind,
	results: PostSearchResult[]
) {
	const unusedKeys = new Set(items.keys());
	const nextChildren = [];

	for (const post of results) {
		// Find the previously rendered one if present
		const previous = items.get(post.slug);
		const element = previous
			? previous
			: clonePostResultItem(itemTemplate, post);

		if (previous) unusedKeys.delete(post.slug);
		else items.set(post.slug, element);

		nextChildren.push(element);
	}

	// discard unused items
	for (const key of unusedKeys) items.delete(key);

	// toggle whether list needs to be part of the
	// rendered DOM
	if (items.size > 0) root.classList.remove('js-remove');
	else root.classList.add('js-remove');

	// place the next set of items
	root.replaceChildren.apply(root, nextChildren);
}

class Binder implements Bind {
	readonly root: HTMLUListElement;
	readonly itemTemplate: HTMLTemplateElement;
	readonly items: Map<string, HTMLLIElement>;
	readonly unsubscribe: () => void;

	constructor(
		sink: SinkPostSearchResult,
		itemTemplate: HTMLTemplateElement,
		root: HTMLUListElement
	) {
		this.root = root;
		this.itemTemplate = itemTemplate;
		this.unsubscribe = sink(this.receive);
		this.items = new Map();
	}

	receive = (results: PostSearchResult[]) => {
		renderResults(this, results);
	};
}

function makeSpec(sink: SinkPostSearchResult) {
	const instances = new WeakMap<Element, Binder>();
	const itemTemplate = getItemTemplate();

	const spec: Spec = {
		connected(element) {
			if (!(element instanceof HTMLUListElement)) return;

			const binder = new Binder(sink, itemTemplate, element);
			instances.set(element, binder);
		},
		disconnected(element){
			const instance = instances.get(element);
			if (!instance) return;

			instance.unsubscribe();
			instances.delete(element);
		},
	};

	return spec;
}

export { NAME, makeSpec };
