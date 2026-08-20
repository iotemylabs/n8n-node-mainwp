import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import type { OperationHandler } from './index';
import {
	getResourceLocatorValue,
	mainWpApiRequest,
	mainWpApiRequestAllItems,
	unwrapData,
} from '../GenericFunctions';

function siteValue(context: IExecuteFunctions, i: number): string {
	return getResourceLocatorValue.call(context, 'site', i);
}

async function paginatedList(
	context: IExecuteFunctions,
	i: number,
	endpoint: string,
	qs: IDataObject,
): Promise<IDataObject | IDataObject[]> {
	const returnAll = context.getNodeParameter('returnAll', i, false) as boolean;
	if (returnAll) {
		return await mainWpApiRequestAllItems.call(context, 'GET', endpoint, {}, qs);
	}
	const limit = context.getNodeParameter('limit', i, 50) as number;
	const response = await mainWpApiRequest.call(context, 'GET', endpoint, {}, {
		...qs,
		page: 1,
		per_page: limit,
	});
	return unwrapData(response);
}

const getAll: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const options = this.getNodeParameter('options', i, {}) as IDataObject;
	return await paginatedList(this, i, '/sites', { ...filters, ...options });
};

const getAllBasic: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	return await paginatedList(this, i, '/sites/basic', { ...filters });
};

const count: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'GET', '/sites/count', {}, filters);
	return unwrapData(response);
};

const get: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(this, 'GET', `/sites/${siteValue(this, i)}`);
	return unwrapData(response);
};

const add: OperationHandler = async function (this, i) {
	const body: IDataObject = {
		url: this.getNodeParameter('url', i) as string,
		admin: this.getNodeParameter('admin', i) as string,
		...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
	};
	const response = await mainWpApiRequest.call(this, 'POST', '/sites/add', body);
	return unwrapData(response);
};

const update: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/edit`,
		body,
	);
	return unwrapData(response);
};

const remove: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/sites/${siteValue(this, i)}/remove`,
	);
	return unwrapData(response);
};

const sync: OperationHandler = async function (this, i) {
	// May return a QueuedAction ({ job_id, queued_count }) — passed through as-is.
	return await mainWpApiRequest.call(this, 'POST', `/sites/${siteValue(this, i)}/sync`);
};

const syncAll: OperationHandler = async function (this, i) {
	const scope = this.getNodeParameter('scope', i, {}) as IDataObject;
	// Returns BulkSiteResult or a QueuedAction — both passed through as-is.
	return await mainWpApiRequest.call(this, 'POST', '/sites/sync', scope);
};

const check: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/check`,
	);
	return unwrapData(response);
};

const checkAll: OperationHandler = async function (this, i) {
	const scope = this.getNodeParameter('scope', i, {}) as IDataObject;
	// Returns BulkSiteResult (no envelope) — passed through as-is.
	return await mainWpApiRequest.call(this, 'POST', '/sites/check', scope);
};

const reconnect: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/reconnect`,
	);
	return unwrapData(response);
};

const disconnect: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/disconnect`,
	);
	return unwrapData(response);
};

const suspend: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/suspend`,
	);
	return unwrapData(response);
};

const unsuspend: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/unsuspend`,
	);
	return unwrapData(response);
};

const getPlugins: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('pluginThemeFilters', i, {}) as IDataObject;
	return await paginatedList(this, i, `/sites/${siteValue(this, i)}/plugins`, filters);
};

const getAbandonedPlugins: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/sites/${siteValue(this, i)}/plugins/abandoned`,
	);
	return unwrapData(response);
};

const activatePlugins: OperationHandler = async function (this, i) {
	const slug = this.getNodeParameter('pluginSlug', i) as string;
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/plugins/activate`,
		{ slug },
	);
	return unwrapData(response);
};

const deactivatePlugins: OperationHandler = async function (this, i) {
	const slug = this.getNodeParameter('pluginSlug', i) as string;
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/plugins/deactivate`,
		{ slug },
	);
	return unwrapData(response);
};

const deletePlugins: OperationHandler = async function (this, i) {
	const slug = this.getNodeParameter('pluginSlug', i) as string;
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/sites/${siteValue(this, i)}/plugins/delete`,
		{},
		{ slug },
	);
	return unwrapData(response);
};

const getThemes: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('pluginThemeFilters', i, {}) as IDataObject;
	delete filters.must_use;
	return await paginatedList(this, i, `/sites/${siteValue(this, i)}/themes`, filters);
};

const getAbandonedThemes: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/sites/${siteValue(this, i)}/themes/abandoned`,
	);
	return unwrapData(response);
};

const activateTheme: OperationHandler = async function (this, i) {
	const slug = this.getNodeParameter('themeSlug', i) as string;
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/sites/${siteValue(this, i)}/themes/activate`,
		{ slug },
	);
	return unwrapData(response);
};

const deleteThemes: OperationHandler = async function (this, i) {
	const slug = this.getNodeParameter('themeSlugs', i) as string;
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/sites/${siteValue(this, i)}/themes/delete`,
		{},
		{ slug },
	);
	return unwrapData(response);
};

const getSecurity: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/sites/${siteValue(this, i)}/security`,
	);
	return unwrapData(response);
};

const getNonMainWpChanges: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('changeFilters', i, {}) as IDataObject;
	return await paginatedList(
		this,
		i,
		`/sites/${siteValue(this, i)}/non-mainwp-changes`,
		filters,
	);
};

const getClient: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/sites/${siteValue(this, i)}/client`,
	);
	return unwrapData(response);
};

const getCosts: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(this, 'GET', `/sites/${siteValue(this, i)}/costs`);
	return unwrapData(response);
};

export const operations: Record<string, OperationHandler> = {
	activatePlugins,
	activateTheme,
	add,
	check,
	checkAll,
	count,
	deactivatePlugins,
	deletePlugins,
	deleteThemes,
	disconnect,
	get,
	getAbandonedPlugins,
	getAbandonedThemes,
	getAll,
	getAllBasic,
	getClient,
	getCosts,
	getNonMainWpChanges,
	getPlugins,
	getSecurity,
	getThemes,
	reconnect,
	remove,
	suspend,
	sync,
	syncAll,
	unsuspend,
	update,
};
