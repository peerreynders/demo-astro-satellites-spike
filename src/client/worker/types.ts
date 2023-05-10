export type RefreshFail = {
	kind: 'fail';
	code: number;
	message: string;
};

export type Refresh = {
	kind: 'refresh';
	lastModified: string;
	payload: string;
};

export type RefreshReturn = Refresh | RefreshFail;

export type FetchRefresh = (
	lastModified?: string
) => Promise<RefreshReturn | undefined>;
