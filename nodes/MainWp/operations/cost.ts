import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import type { OperationHandler } from './index';
import {
	mainWpApiRequest,
	mainWpApiRequestAllItems,
	unwrapData,
} from '../GenericFunctions';

/** Converts a comma-separated ID string to the number[] the CostInput schema declares. */
function toIdArray(value: unknown): number[] | undefined {
	if (typeof value !== 'string' || value.trim() === '') return undefined;
	return value
		.split(',')
		.map((part) => Number(part.trim()))
		.filter((id) => !Number.isNaN(id));
}

/** Builds the CostInput body shared by cost:add and cost:update. */
function buildCostBody(context: IExecuteFunctions, i: number): IDataObject {
	const body: IDataObject = {
		name: context.getNodeParameter('name', i) as string,
		price: context.getNodeParameter('price', i) as number,
		payment_type: context.getNodeParameter('paymentType', i) as string,
		product_type: context.getNodeParameter('productType', i) as string,
		license_type: context.getNodeParameter('licenseType', i) as string,
		cost_tracker_status: context.getNodeParameter('costStatus', i) as string,
		product_color: context.getNodeParameter('productColor', i) as string,
		payment_method: context.getNodeParameter('paymentMethod', i) as string,
		renewal_type: context.getNodeParameter('renewalType', i) as string,
		...(context.getNodeParameter('additionalFields', i, {}) as IDataObject),
	};
	for (const key of ['sites', 'groups', 'clients']) {
		if (key in body) {
			const ids = toIdArray(body[key]);
			if (ids === undefined) {
				delete body[key];
			} else {
				body[key] = ids;
			}
		}
	}
	return body;
}

const getAll: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
	if (returnAll) {
		return await mainWpApiRequestAllItems.call(this, 'GET', '/costs', {}, filters);
	}
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const response = await mainWpApiRequest.call(this, 'GET', '/costs', {}, {
		...filters,
		page: 1,
		per_page: limit,
	});
	return unwrapData(response);
};

const add: OperationHandler = async function (this, i) {
	const body = buildCostBody(this, i);
	const response = await mainWpApiRequest.call(this, 'POST', '/costs/add', body);
	return unwrapData(response);
};

const get: OperationHandler = async function (this, i) {
	const costId = this.getNodeParameter('costId', i) as string;
	const response = await mainWpApiRequest.call(this, 'GET', `/costs/${costId}`);
	return unwrapData(response);
};

const getClients: OperationHandler = async function (this, i) {
	const costId = this.getNodeParameter('costId', i) as string;
	const response = await mainWpApiRequest.call(this, 'GET', `/costs/${costId}/clients`);
	return unwrapData(response);
};

const getSites: OperationHandler = async function (this, i) {
	const costId = this.getNodeParameter('costId', i) as string;
	const response = await mainWpApiRequest.call(this, 'GET', `/costs/${costId}/sites`);
	return unwrapData(response);
};

const update: OperationHandler = async function (this, i) {
	const costId = this.getNodeParameter('costId', i) as string;
	const body = buildCostBody(this, i);
	const response = await mainWpApiRequest.call(this, 'POST', `/costs/${costId}/edit`, body);
	return unwrapData(response);
};

const remove: OperationHandler = async function (this, i) {
	const costId = this.getNodeParameter('costId', i) as string;
	const response = await mainWpApiRequest.call(this, 'DELETE', `/costs/${costId}/remove`);
	return unwrapData(response);
};

export const operations: Record<string, OperationHandler> = {
	add,
	get,
	getAll,
	getClients,
	getSites,
	remove,
	update,
};
