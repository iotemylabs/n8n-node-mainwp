import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IPollFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import type { MainWpEnvelope, WordPressRestError } from './types';

type MainWpContext = IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions | IHookFunctions;

const API_PREFIX = '/wp-json/mainwp/v2';

/**
 * Strips trailing slashes and rejects URLs that already contain /wp-json —
 * the API prefix is appended by the request wrapper.
 */
export function normalizeBaseUrl(this: MainWpContext, rawUrl: string): string {
	const baseUrl = rawUrl.trim().replace(/\/+$/, '');
	if (baseUrl === '') {
		throw new NodeOperationError(this.getNode(), 'The MainWP credential has no Dashboard URL');
	}
	if (/\/wp-json(\/|$)/i.test(baseUrl)) {
		throw new NodeOperationError(
			this.getNode(),
			'The Dashboard URL must not include /wp-json — enter only the WordPress site URL, e.g. https://dashboard.example.com',
		);
	}
	return baseUrl;
}

function extractHttpStatus(error: JsonObject): number | undefined {
	const candidates = [
		error.httpCode,
		error.statusCode,
		(error.response as JsonObject | undefined)?.status,
		(error.cause as JsonObject | undefined)?.status,
		((error.cause as JsonObject | undefined)?.response as JsonObject | undefined)?.status,
	];
	for (const candidate of candidates) {
		const status = Number(candidate);
		if (!Number.isNaN(status) && status >= 100) return status;
	}
	return undefined;
}

function extractWordPressError(error: JsonObject): WordPressRestError {
	const candidates = [
		(error.response as JsonObject | undefined)?.body,
		(error.response as JsonObject | undefined)?.data,
		((error.cause as JsonObject | undefined)?.response as JsonObject | undefined)?.data,
		error.errorResponse,
	];
	for (const candidate of candidates) {
		if (candidate !== null && typeof candidate === 'object' && !Array.isArray(candidate)) {
			const body = candidate as WordPressRestError;
			if (body.code !== undefined || body.message !== undefined) return body;
		}
	}
	return {};
}

/**
 * Makes an authenticated request against the MainWP Dashboard REST API v2 and
 * runs the response through the shared envelope check. Routes that report a
 * failed action as `success: 0` inside an HTTP 200 response throw here, so
 * operation files never need to inspect the envelope themselves.
 */
export async function mainWpApiRequest(
	this: MainWpContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	option: Partial<IHttpRequestOptions> = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('mainWpApi');
	const baseUrl = normalizeBaseUrl.call(this, credentials.baseUrl as string);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${API_PREFIX}${endpoint}`,
		headers: {
			Accept: 'application/json',
		},
		qs,
		body,
		json: true,
		...option,
	};

	if (Object.keys(qs).length === 0) delete options.qs;
	if (Object.keys(body).length === 0 && options.body === body) delete options.body;

	let response: IDataObject;
	try {
		response = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'mainWpApi',
			options,
		)) as IDataObject;
	} catch (error) {
		throw mapRequestError.call(this, error as JsonObject, endpoint);
	}

	assertMainWpSuccess.call(this, response);
	return response;
}

/**
 * Maps transport and WordPress REST errors ({ code, message, data: { status } })
 * to a NodeApiError with actionable hints for the two ambiguous statuses.
 */
function mapRequestError(this: MainWpContext, error: JsonObject, endpoint: string): NodeApiError {
	const status = extractHttpStatus(error);
	const wpError = extractWordPressError(error);

	let message: string | undefined;
	let description: string | undefined;

	if (wpError.message !== undefined) {
		message = wpError.code !== undefined ? `${wpError.code}: ${wpError.message}` : wpError.message;
	}

	if (status === 401) {
		description =
			'Check the key is valid and that its scope covers this method — MainWP returns 401 for both an invalid key and an insufficient scope. GET needs Read scope; other methods need Write & Delete scope.';
	} else if (status === 404 && wpError.code === 'rest_no_route') {
		description = `The Dashboard has no route for ${endpoint}. Check that WordPress is not using plain permalinks (Settings > Permalinks must not be "Plain"), and that any MainWP extension this operation requires is installed and active.`;
	}

	return new NodeApiError(this.getNode(), error, { message, description });
}

/**
 * Throws when the response is the MainWP envelope and reports `success: 0`.
 * Shapes without a `success` key (BulkSiteResult, raw records) pass through.
 */
export function assertMainWpSuccess(this: MainWpContext, response: IDataObject): void {
	if (response === null || typeof response !== 'object' || Array.isArray(response)) return;
	if (!('success' in response)) return;

	const envelope = response as MainWpEnvelope;
	if (Number(envelope.success) === 0) {
		throw new NodeApiError(this.getNode(), response as JsonObject, {
			message: envelope.message ?? 'MainWP reported the action failed',
			description:
				'The Dashboard returned HTTP 200 but reported success: 0 for this action. The raw response is attached.',
		});
	}
}

/**
 * Unwraps the { success, message, data, total, pages } envelope to `data`.
 * Shapes without the envelope (BulkSiteResult, ToolJobStatus, QueuedAction)
 * are returned unchanged.
 */
export function unwrapData(response: IDataObject): IDataObject | IDataObject[] {
	if (response === null || typeof response !== 'object' || Array.isArray(response)) {
		return response;
	}
	if ('success' in response && 'data' in response) {
		return response.data as IDataObject | IDataObject[];
	}
	return response;
}

/**
 * Fetches every page of a paginated list route (page/per_page, envelope
 * carries total and pages). Only call this for routes the inventory marks as
 * paginated — pagination is per-route in this API.
 */
export async function mainWpApiRequestAllItems(
	this: MainWpContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const perPage = 100;
	const items: IDataObject[] = [];
	let page = 1;

	 
	while (true) {
		const response = await mainWpApiRequest.call(this, method, endpoint, body, {
			...qs,
			page,
			per_page: perPage,
		});
		const envelope = response as MainWpEnvelope;
		const data = Array.isArray(envelope.data) ? envelope.data : [];
		items.push(...data);

		if (limit !== undefined && items.length >= limit) {
			return items.slice(0, limit);
		}
		if (data.length < perPage) break;
		if (envelope.pages !== undefined && page >= envelope.pages) break;
		page += 1;
	}

	return items;
}

/**
 * Reads a resourceLocator parameter and returns its plain value, whichever
 * mode (list / id / domain / email) the user picked.
 */
export function getResourceLocatorValue(
	this: IExecuteFunctions,
	parameterName: string,
	itemIndex: number,
): string {
	const locator = this.getNodeParameter(parameterName, itemIndex) as
		| string
		| { mode: string; value: string };
	if (typeof locator === 'string') return locator;
	return String(locator.value);
}
