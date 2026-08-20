import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import type { OperationHandler } from './index';
import {
	getResourceLocatorValue,
	mainWpApiRequest,
	mainWpApiRequestAllItems,
	unwrapData,
} from '../GenericFunctions';

function clientValue(context: IExecuteFunctions, i: number): string {
	return getResourceLocatorValue.call(context, 'client', i);
}

function fieldIdName(context: IExecuteFunctions, i: number): string {
	return encodeURIComponent(context.getNodeParameter('fieldIdName', i) as string);
}

/**
 * The API takes `selected_sites` as an array of site IDs; the node exposes it
 * as a comma-separated string. Converts in place.
 */
function normalizeSelectedSites(body: IDataObject): IDataObject {
	if (typeof body.selected_sites === 'string') {
		const ids = body.selected_sites
			.split(',')
			.map((id) => Number(id.trim()))
			.filter((id) => !Number.isNaN(id) && id > 0);
		if (ids.length > 0) {
			body.selected_sites = ids;
		} else {
			delete body.selected_sites;
		}
	}
	return body;
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
	return await paginatedList(this, i, '/clients', { ...filters });
};

const count: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'GET', '/clients/count', {}, filters);
	return unwrapData(response);
};

const get: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(this, 'GET', `/clients/${clientValue(this, i)}`);
	return unwrapData(response);
};

const add: OperationHandler = async function (this, i) {
	const body: IDataObject = normalizeSelectedSites({
		name: this.getNodeParameter('name', i) as string,
		...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
	});
	const response = await mainWpApiRequest.call(this, 'POST', '/clients/add', body);
	return unwrapData(response);
};

const update: OperationHandler = async function (this, i) {
	const body = normalizeSelectedSites(
		this.getNodeParameter('updateFields', i, {}) as IDataObject,
	);
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/clients/${clientValue(this, i)}/edit`,
		body,
	);
	return unwrapData(response);
};

const remove: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/clients/${clientValue(this, i)}/remove`,
	);
	return unwrapData(response);
};

const suspend: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/clients/${clientValue(this, i)}/suspend`,
	);
	return unwrapData(response);
};

const unsuspend: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/clients/${clientValue(this, i)}/unsuspend`,
	);
	return unwrapData(response);
};

const getSites: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/clients/${clientValue(this, i)}/sites`,
	);
	return unwrapData(response);
};

const countSites: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/clients/${clientValue(this, i)}/sites/count`,
	);
	return unwrapData(response);
};

const getCosts: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/clients/${clientValue(this, i)}/costs`,
	);
	return unwrapData(response);
};

const getFields: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('fieldFilters', i, {}) as IDataObject;
	const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
	// spec declares pre_page (see docs/OPEN_QUESTIONS.md #1); send both spellings until verified live
	if (returnAll) {
		return await mainWpApiRequestAllItems.call(this, 'GET', '/clients/fields', {}, {
			...filters,
			pre_page: 100,
		});
	}
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const response = await mainWpApiRequest.call(this, 'GET', '/clients/fields', {}, {
		...filters,
		page: 1,
		per_page: limit,
		pre_page: limit,
	});
	return unwrapData(response);
};

const addField: OperationHandler = async function (this, i) {
	const body: IDataObject = {
		name: this.getNodeParameter('fieldName', i) as string,
		description: this.getNodeParameter('fieldDescription', i) as string,
	};
	const response = await mainWpApiRequest.call(this, 'POST', '/clients/fields/add', body);
	return unwrapData(response);
};

const updateField: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('fieldUpdateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'PUT',
		`/clients/fields/${fieldIdName(this, i)}/edit`,
		body,
	);
	return unwrapData(response);
};

const deleteField: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/clients/fields/${fieldIdName(this, i)}/delete`,
	);
	return unwrapData(response);
};

export const operations: Record<string, OperationHandler> = {
	add,
	addField,
	count,
	countSites,
	deleteField,
	get,
	getAll,
	getCosts,
	getFields,
	getSites,
	remove,
	suspend,
	unsuspend,
	update,
	updateField,
};
