// file: src/client/shame.ts
//
// `shame` as in ashamed for not thinking
// of a better name (or place) than "utils" or "helpers".
//
// credit: https://csswizardry.com/2013/04/shame-css/

const forPostDate = Intl.DateTimeFormat('en', {
	year: 'numeric',
	month: '2-digit',
	day: 'numeric',
	timeZone: 'UTC',
});

const formatDateForPost = (date: Date) => forPostDate.format(date);

export { formatDateForPost };
