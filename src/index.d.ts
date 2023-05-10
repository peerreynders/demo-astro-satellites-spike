// file: src/index.d.ts
declare module 'regular-elements' {
	export interface RegularElementsOptions {
		connectedCallback?(this: Element): void;
		disconnectedCallback?(this: Element): void;
		attributeChangedCallback?(
			this: Element,
			attributeName: string,
			oldValue: string,
			newValue: string
		): void;
		observedAttributes?: string[];
	}

	export function define(
		selector: string,
		options: RegularElementsOptions
	): void;
	export function get(selector: string): RegularElementsOptions;
	export function whenDefined(
		selector: string
	): Promise<RegularElementsOptions>;
}
