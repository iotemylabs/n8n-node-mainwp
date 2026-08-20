import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { OperationHandler } from './index';
import { getResourceLocatorValue, mainWpApiRequest, unwrapData } from '../GenericFunctions';

function siteValue(context: IExecuteFunctions, i: number): string {
	return getResourceLocatorValue.call(context, 'site', i);
}

function pageIdValue(context: IExecuteFunctions, i: number): string {
	return context.getNodeParameter('pageId', i) as string;
}

/**
 * The inventory declares these body properties as objects/arrays — the json
 * parameter type hands them over as strings, so parse them before sending.
 */
function parseJsonProperties(
	context: IExecuteFunctions,
	i: number,
	body: IDataObject,
	keys: string[],
): void {
	for (const key of keys) {
		const value = body[key];
		if (typeof value !== 'string') continue;
		if (value.trim() === '') {
			delete body[key];
			continue;
		}
		try {
			body[key] = JSON.parse(value) as IDataObject;
		} catch {
			throw new NodeOperationError(context.getNode(), `The field "${key}" is not valid JSON`, {
				itemIndex: i,
			});
		}
	}
}

const getAll: OperationHandler = async function (this, i) {
	const maximum = this.getNodeParameter('maximum', i, 10) as number;
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	// GET /pages is not paginated — the `maximum` cap bounds the single response.
	const response = await mainWpApiRequest.call(this, 'GET', '/pages', {}, {
		...filters,
		maximum,
	});
	return unwrapData(response);
};

const get: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/pages/${siteValue(this, i)}/${pageIdValue(this, i)}`,
	);
	return unwrapData(response);
};

const create: OperationHandler = async function (this, i) {
	const body: IDataObject = {
		post_title: this.getNodeParameter('post_title', i) as string,
		post_content: this.getNodeParameter('post_content', i) as string,
		post_name: this.getNodeParameter('post_name', i) as string,
		post_status: this.getNodeParameter('post_status', i) as string,
		...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
	};
	parseJsonProperties(this, i, body, ['post_custom', 'featured_image_data']);
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/pages/${siteValue(this, i)}/create`,
		body,
	);
	return unwrapData(response);
};

const update: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	parseJsonProperties(this, i, body, ['post_custom', 'featured_image_data']);
	const response = await mainWpApiRequest.call(
		this,
		'PUT',
		`/pages/${siteValue(this, i)}/${pageIdValue(this, i)}/edit`,
		body,
	);
	return unwrapData(response);
};

const updateStatus: OperationHandler = async function (this, i) {
	const status = this.getNodeParameter('status', i) as string;
	const response = await mainWpApiRequest.call(
		this,
		'PUT',
		`/pages/${siteValue(this, i)}/${pageIdValue(this, i)}/update-status`,
		{ status },
	);
	return unwrapData(response);
};

const deletePage: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/pages/${siteValue(this, i)}/${pageIdValue(this, i)}/delete`,
	);
	return unwrapData(response);
};

export const operations: Record<string, OperationHandler> = {
	create,
	delete: deletePage,
	get,
	getAll,
	update,
	updateStatus,
};
