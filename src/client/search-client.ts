import { request, type Results } from './search-messages';

function makeSearchClient(resultCb: (result: Results) => void) {
	const worker = new Worker('/search-worker.js');

	const handleMessage = ({ data: result }: MessageEvent<Results>) =>
		resultCb(result);

	const searchPosts = (term: string) => {
		const message = request.searchPosts(term);
		worker.postMessage(message);
		return message.id;
	};

	const terminate = () => {
		worker.removeEventListener('message', handleMessage);
		worker.terminate();
	};

	worker.addEventListener('message', handleMessage);

	return {
		searchPosts,
		terminate,
	};
}

export { makeSearchClient };
