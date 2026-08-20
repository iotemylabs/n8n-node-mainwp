import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { OperationHandler } from './index';
import { mainWpApiRequest, unwrapData } from '../GenericFunctions';

/** Splits a comma-separated string into a trimmed array. */
function toList(value: unknown): string[] {
	return String(value)
		.split(',')
		.map((entry) => entry.trim())
		.filter((entry) => entry !== '');
}

/** Parses a json-type parameter that may arrive as a string or an object. */
function parseJsonField(
	context: IExecuteFunctions,
	value: unknown,
	displayName: string,
): IDataObject {
	if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		return value as IDataObject;
	}
	try {
		const parsed: unknown = JSON.parse(String(value));
		if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
			return parsed as IDataObject;
		}
	} catch {
		// fall through to the error below
	}
	throw new NodeOperationError(
		context.getNode(),
		`The "${displayName}" field must be a JSON object`,
	);
}

// ----------------------------------------------------------------------
// General
// ----------------------------------------------------------------------

const getGeneral: OperationHandler = async function (this) {
	const response = await mainWpApiRequest.call(this, 'GET', '/settings/general');
	return unwrapData(response);
};

const updateGeneral: OperationHandler = async function (this, i) {
	const body = { ...(this.getNodeParameter('updateFields', i, {}) as IDataObject) };
	if (body.automatic_daily_update !== undefined) {
		body.automatic_daily_update = toList(body.automatic_daily_update);
	}
	if (body.trans_automatic_daily_update !== undefined) {
		body.trans_automatic_daily_update = toList(body.trans_automatic_daily_update);
	}
	if (body.mainwp_widgets !== undefined) {
		body.mainwp_widgets = parseJsonField(this, body.mainwp_widgets, 'Widgets');
	}
	const response = await mainWpApiRequest.call(this, 'PUT', '/settings/general/edit', body);
	return unwrapData(response);
};

// ----------------------------------------------------------------------
// Advanced
// ----------------------------------------------------------------------

const getAdvanced: OperationHandler = async function (this) {
	const response = await mainWpApiRequest.call(this, 'GET', '/settings/advanced');
	return unwrapData(response);
};

const updateAdvanced: OperationHandler = async function (this, i) {
	const body = { ...(this.getNodeParameter('updateFields', i, {}) as IDataObject) };
	if (body.sync_data !== undefined) {
		body.sync_data = parseJsonField(this, body.sync_data, 'Sync Data');
	}
	const response = await mainWpApiRequest.call(this, 'PUT', '/settings/advanced/edit', body);
	return unwrapData(response);
};

// ----------------------------------------------------------------------
// Tools settings
// ----------------------------------------------------------------------

const getTools: OperationHandler = async function (this) {
	const response = await mainWpApiRequest.call(this, 'GET', '/settings/tools');
	return unwrapData(response);
};

const updateTools: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'PUT', '/settings/tools/edit', body);
	return unwrapData(response);
};

// ----------------------------------------------------------------------
// Emails
// ----------------------------------------------------------------------

const getEmails: OperationHandler = async function (this) {
	const response = await mainWpApiRequest.call(this, 'GET', '/settings/emails');
	return unwrapData(response);
};

const updateEmail: OperationHandler = async function (this, i) {
	const mailType = this.getNodeParameter('mailType', i) as string;
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'PUT',
		`/settings/emails/${encodeURIComponent(mailType)}/edit`,
		body,
	);
	return unwrapData(response);
};

// ----------------------------------------------------------------------
// Monitoring
// ----------------------------------------------------------------------

const getMonitoring: OperationHandler = async function (this) {
	const response = await mainWpApiRequest.call(this, 'GET', '/settings/monitoring');
	return unwrapData(response);
};

const updateMonitoring: OperationHandler = async function (this, i) {
	const body = { ...(this.getNodeParameter('updateFields', i, {}) as IDataObject) };
	if (body.mainwp_uptime_monitoring_up_status_codes !== undefined) {
		body.mainwp_uptime_monitoring_up_status_codes = toList(
			body.mainwp_uptime_monitoring_up_status_codes,
		).map((code) => Number(code));
	}
	const response = await mainWpApiRequest.call(this, 'PUT', '/settings/monitoring/edit', body);
	return unwrapData(response);
};

// ----------------------------------------------------------------------
// Cost Tracker
// ----------------------------------------------------------------------

const getCostTracker: OperationHandler = async function (this) {
	const response = await mainWpApiRequest.call(this, 'GET', '/settings/cost-tracker');
	return unwrapData(response);
};

const updateCostTracker: OperationHandler = async function (this, i) {
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(this, 'PUT', '/settings/cost-tracker/edit', body);
	return unwrapData(response);
};

// ----------------------------------------------------------------------
// Tools jobs — start a background job, return the job-started payload raw
// so the job ID stays visible for the matching status operation.
// ----------------------------------------------------------------------

const destroySessions: OperationHandler = async function (this) {
	// Starts a background job — the raw payload carries the job ID for
	// getDestroySessionsStatus.
	return await mainWpApiRequest.call(this, 'POST', '/settings/tools/destroy-sessions');
};

const disconnectAllSites: OperationHandler = async function (this) {
	// Starts a background job — the raw payload carries the job ID for
	// getDisconnectAllSitesStatus.
	return await mainWpApiRequest.call(this, 'POST', '/settings/tools/disconnect-all-sites');
};

const renewConnections: OperationHandler = async function (this) {
	// Starts a background job — the raw payload carries the job ID for
	// getRenewConnectionsStatus.
	return await mainWpApiRequest.call(this, 'POST', '/settings/tools/renew-connections');
};

// ----------------------------------------------------------------------
// Tools job status polls — responses are ToolJobStatus, passed through raw.
// ----------------------------------------------------------------------

function jobIdValue(context: IExecuteFunctions, i: number): string {
	return encodeURIComponent(context.getNodeParameter('jobId', i) as string);
}

const getDestroySessionsStatus: OperationHandler = async function (this, i) {
	return await mainWpApiRequest.call(
		this,
		'GET',
		`/settings/tools/destroy-sessions-status/${jobIdValue(this, i)}`,
	);
};

const getDisconnectAllSitesStatus: OperationHandler = async function (this, i) {
	return await mainWpApiRequest.call(
		this,
		'GET',
		`/settings/tools/disconnect-all-sites-status/${jobIdValue(this, i)}`,
	);
};

const getRenewConnectionsStatus: OperationHandler = async function (this, i) {
	return await mainWpApiRequest.call(
		this,
		'GET',
		`/settings/tools/renew-connections-status/${jobIdValue(this, i)}`,
	);
};

export const operations: Record<string, OperationHandler> = {
	destroySessions,
	disconnectAllSites,
	getAdvanced,
	getCostTracker,
	getDestroySessionsStatus,
	getDisconnectAllSitesStatus,
	getEmails,
	getGeneral,
	getMonitoring,
	getRenewConnectionsStatus,
	getTools,
	renewConnections,
	updateAdvanced,
	updateCostTracker,
	updateEmail,
	updateGeneral,
	updateMonitoring,
	updateTools,
};
