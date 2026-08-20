import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import type { OperationHandler } from './index';
import { getResourceLocatorValue, mainWpApiRequest, unwrapData } from '../GenericFunctions';

function siteValue(context: IExecuteFunctions, i: number): string {
	return getResourceLocatorValue.call(context, 'site', i);
}

function slugBody(context: IExecuteFunctions, i: number, parameterName: string): IDataObject {
	const slug = (context.getNodeParameter(parameterName, i, '') as string).trim();
	// The inventory declares `slug` as optional — an empty body acts on every
	// pending update of that type on the site.
	return slug === '' ? {} : { slug };
}

// None of the /updates list routes are paginated — they take only filter
// parameters and always return the full result set.
const getAll: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'GET', '/updates', {}, filters);
	return unwrapData(response);
};

const getForSite: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('siteFilters', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/updates/${siteValue(this, i)}`,
		{},
		filters,
	);
	return unwrapData(response);
};

const getIgnored: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('ignoredFilters', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'GET', '/updates/ignored', {}, filters);
	return unwrapData(response);
};

const getIgnoredForSite: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('ignoredFilters', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'GET',
		`/updates/${siteValue(this, i)}/ignored`,
		{},
		filters,
	);
	return unwrapData(response);
};

const runAll: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('options', i, {}) as IDataObject;
	// May return UpdateRunStarted or a QueuedAction ({ job_id, queued_count }) —
	// passed through as-is. Completion is not confirmed by this call, and the
	// queued job cannot be polled with the MainWP API key.
	return await mainWpApiRequest.call(this, 'POST', '/updates/update', body);
};

const runForSite: OperationHandler = async function (this, i) {
	// May return UpdateRunStarted or a QueuedAction ({ job_id }) — passed
	// through as-is. Completion is not confirmed by this call, and the queued
	// job cannot be polled with the MainWP API key.
	return await mainWpApiRequest.call(this, 'POST', `/updates/${siteValue(this, i)}/update`);
};

const ignoreCore: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/updates/${siteValue(this, i)}/ignore/wp`,
	);
	return unwrapData(response);
};

const ignorePlugins: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/updates/${siteValue(this, i)}/ignore/plugins`,
		slugBody(this, i, 'pluginSlug'),
	);
	return unwrapData(response);
};

const ignoreThemes: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/updates/${siteValue(this, i)}/ignore/themes`,
		slugBody(this, i, 'themeSlug'),
	);
	return unwrapData(response);
};

const updateCore: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/updates/${siteValue(this, i)}/update/wp`,
	);
	return unwrapData(response);
};

const updatePlugins: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/updates/${siteValue(this, i)}/update/plugins`,
		slugBody(this, i, 'pluginSlug'),
	);
	return unwrapData(response);
};

const updateThemes: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/updates/${siteValue(this, i)}/update/themes`,
		slugBody(this, i, 'themeSlug'),
	);
	return unwrapData(response);
};

const updateTranslations: OperationHandler = async function (this, i) {
	const response = await mainWpApiRequest.call(
		this,
		'POST',
		`/updates/${siteValue(this, i)}/update/translations`,
		slugBody(this, i, 'translationSlug'),
	);
	return unwrapData(response);
};

export const operations: Record<string, OperationHandler> = {
	getAll,
	getForSite,
	getIgnored,
	getIgnoredForSite,
	ignoreCore,
	ignorePlugins,
	ignoreThemes,
	runAll,
	runForSite,
	updateCore,
	updatePlugins,
	updateThemes,
	updateTranslations,
};
