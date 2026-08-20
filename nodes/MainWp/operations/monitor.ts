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
	return await paginatedList(this, i, '/monitors', { ...filters });
};

const getAllBasic: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	return await paginatedList(this, i, '/monitors/basic', { ...filters });
};

const count: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'GET', '/monitors/count', {}, filters);
	return unwrapData(response);
};

const get: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(this, 'GET', `/monitors/${siteValue(this, i)}`);
	return unwrapData(response);
};

const getBasic: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/monitors/${siteValue(this, i)}/basic`,
	);
	return unwrapData(response);
};

const check: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/monitors/${siteValue(this, i)}/check`,
	);
	return unwrapData(response);
};

const getHeartbeat: OperationHandler = async function (this, i) {
	// This route paginates with `page` + `limit` instead of `page` + `per_page`
	// (see docs/api-inventory.json, getMonitorsIdDomainHeartbeat), so the shared
	// mainWpApiRequestAllItems paginator — which always sends per_page — cannot
	// be used here. Custom loop: request pages of 100 until a short page comes back.
	const endpoint = `/monitors/${siteValue(this, i)}/heartbeat`;
	const filters = this.getNodeParameter('heartbeatFilters', i, {}) as IDataObject;
	const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', i, 50) as number;
		const response = await mainWpApiRequest.call(this, 'GET', endpoint, {}, {
			...filters,
			page: 1,
			limit,
		});
		return unwrapData(response);
	}

	const pageSize = 100;
	const items: IDataObject[] = [];
	let page = 1;

	for (;;) {
		const response = await mainWpApiRequest.call(this, 'GET', endpoint, {}, {
			...filters,
			page,
			limit: pageSize,
		});
		const data = unwrapData(response);
		const records = Array.isArray(data) ? data : [];
		items.push(...records);
		if (records.length < pageSize) break;
		page += 1;
	}

	return items;
};

const getIncidents: OperationHandler = async function (this, i) {
	return await paginatedList(this, i, `/monitors/${siteValue(this, i)}/incidents`, {});
};

const countIncidents: OperationHandler = async function (this, i) {
	// The spec declares page/per_page on this count route, which is suspicious
	// for a count — see docs/OPEN_QUESTIONS.md item 4. Until that is resolved
	// against a live Dashboard, this is a plain GET without pagination params.
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/monitors/${siteValue(this, i)}/incidents/count`,
	);
	return unwrapData(response);
};

const updateSettings: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'PUT',
		`/monitors/${siteValue(this, i)}/settings`,
		body,
	);
	return unwrapData(response);
};

const updateGlobalSettings: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('globalUpdateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'PUT', '/monitors/settings', body);
	return unwrapData(response);
};

export const operations: Record<string, OperationHandler> = {
	check,
	count,
	countIncidents,
	get,
	getAll,
	getAllBasic,
	getBasic,
	getHeartbeat,
	getIncidents,
	updateGlobalSettings,
	updateSettings,
};
