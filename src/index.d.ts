// file: src/index.d.ts
declare module 'qsa-observer' {
	export interface QsaoOptions {
		query: string[];
		root: Node;
		handle(element: Element, connected: boolean, selector: string);
	}

	export interface QsaoReturn {
		drop(elements: ArrayLike<Element>): void;
		flush(): void;
		observer: MutationObserver;
		parse(elements: ArrayLike<Element>, connected?: boolean): void;
	}

	export type QsaoSpec = {
		connected?: (element: Element) => void;
		disconnected?: (element: Element) => void;
	};

	export default function (options: QsaoOptions): QsaoReturn;
}
