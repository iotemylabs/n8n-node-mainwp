import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
	INodePropertyOptions,
} from 'n8n-workflow';

import { mainWpApiRequest, mainWpApiRequestAllItems } from './GenericFunctions';

function toName(record: IDataObject): string {
	const candidates = [record.name, record.title, record.url, record.domain, record.email];
	for (const candidate of candidates) {
		if (typeof candidate === 'string' && candidate !== '') return candidate;
	}
	return String(record.id ?? '');
}

async function fetchSites(this: ILoadOptionsFunctions, search?: string): Promise<IDataObject[]> {
	const qs: IDataObject = {};
	if (search !== undefined && search !== '') qs.search = search;
	return await mainWpApiRequestAllItems.call(this, 'GET', '/sites/basic', {}, qs);
}

async function fetchClients(this: ILoadOptionsFunctions, search?: string): Promise<IDataObject[]> {
	const qs: IDataObject = {};
	if (search !== undefined && search !== '') qs.search = search;
	return await mainWpApiRequestAllItems.call(this, 'GET', '/clients', {}, qs);
}

async function fetchTags(this: ILoadOptionsFunctions, search?: string): Promise<IDataObject[]> {
	const qs: IDataObject = {};
	if (search !== undefined && search !== '') qs.search = search;
	return await mainWpApiRequestAllItems.call(this, 'GET', '/tags', {}, qs);
}

function toSearchItems(records: IDataObject[]): INodeListSearchItems[] {
	return records
		.map((record) => ({
			name: toName(record),
			value: String(record.id ?? ''),
		}))
		.filter((item) => item.value !== '')
		.sort((a, b) => a.name.localeCompare(b.name));
}

function toOptions(records: IDataObject[]): INodePropertyOptions[] {
	return toSearchItems(records);
}

export const listSearch = {
	async searchSites(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		return { results: toSearchItems(await fetchSites.call(this, filter)) };
	},

	async searchClients(
		this: ILoadOptionsFunctions,
		filter?: string,
	): Promise<INodeListSearchResult> {
		return { results: toSearchItems(await fetchClients.call(this, filter)) };
	},

	async searchTags(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
		return { results: toSearchItems(await fetchTags.call(this, filter)) };
	},
};

export const loadOptions = {
	async getSites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		return toOptions(await fetchSites.call(this));
	},

	async getClients(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		return toOptions(await fetchClients.call(this));
	},

	async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		return toOptions(await fetchTags.call(this));
	},

	/** Email notification types, for settings.updateEmail. */
	async getEmailTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const response = await mainWpApiRequest.call(this, 'GET', '/settings/emails');
		const data = response.data;
		if (data === null || typeof data !== 'object' || Array.isArray(data)) return [];
		return Object.keys(data as IDataObject)
			.map((key) => ({ name: key, value: key }))
			.sort((a, b) => a.name.localeCompare(b.name));
	},
};
