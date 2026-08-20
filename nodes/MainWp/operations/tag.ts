import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import type { OperationHandler } from './index';
import {
	getResourceLocatorValue,
	mainWpApiRequest,
	mainWpApiRequestAllItems,
	unwrapData,
} from '../GenericFunctions';

function tagValue(context: IExecuteFunctions, i: number): string {
	return getResourceLocatorValue.call(context, 'tag', i);
}

const getAll: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
	if (returnAll) {
		return await mainWpApiRequestAllItems.call(this, 'GET', '/tags', {}, { ...filters });
	}
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const response = await mainWpApiRequest.call(this, 'GET', '/tags', {}, {
		...filters,
		page: 1,
		per_page: limit,
	});
	return unwrapData(response);
};

const get: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(this, 'GET', `/tags/${tagValue(this, i)}`);
	return unwrapData(response);
};

const add: OperationHandler = async function (this, i) {
	const body: IDataObject = {
		name: this.getNodeParameter('name', i) as string,
		...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
	};
	const response = await mainWpApiRequest.call(this, 'POST', '/tags/add', body);
	return unwrapData(response);
};

const update: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/tags/${tagValue(this, i)}/edit`,
		body,
	);
	return unwrapData(response);
};

const remove: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/tags/${tagValue(this, i)}/remove`,
	);
	return unwrapData(response);
};

const getSites: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(this, 'GET', `/tags/${tagValue(this, i)}/sites`);
	return unwrapData(response);
};

const getClients: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(this, 'GET', `/tags/${tagValue(this, i)}/clients`);
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
