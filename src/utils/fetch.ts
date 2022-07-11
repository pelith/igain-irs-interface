export const jsonFetcher = (url: string) => fetch(url).then((r) => r.json());
export const plainFetcher = (url: string) => fetch(url).then((r) => r.text());
