import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import type { OperationHandler } from './index';
import {
	getResourceLocatorValue,
	mainWpApiRequest,
	unwrapData,
} from '../GenericFunctions';

function siteValue(context: IExecuteFunctions, i: number): string {
	return getResourceLocatorValue.call(context, 'site', i);
}

const getAll: OperationHandler = async function (this, i) {
	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const qs: IDataObject = { ...filters };
	// The route declares `roles` as an array parameter.
	if (typeof qs.roles === 'string') {
		const roles = qs.roles
			.split(',')
			.map((role) => role.trim())
			.filter((role) => role !== '');
		if (roles.length === 0) {
			delete qs.roles;
		} else {
			qs.roles = roles;
		}
	}
	const response = await mainWpApiRequest.call(this, 'GET', '/users', {}, qs);
	return unwrapData(response);
};

const create: OperationHandler = async function (this, i) {
	const body: IDataObject = {
		username: this.getNodeParameter('username', i) as string,
		email: this.getNodeParameter('email', i) as string,
		...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
	};
	const response = await mainWpApiRequest.call(this, 'POST', '/users/create', body);
	return unwrapData(response);
};

const importUsers: OperationHandler = async function (this, i) {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
	const hasHeader = this.getNodeParameter('hasHeader', i, true) as boolean;
	const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
	const form = new FormData();
	form.append(
		'csv_file',
		new Blob([new Uint8Array(buffer)], { type: binaryData.mimeType || 'text/csv' }),
		binaryData.fileName ?? 'users.csv',
	);
	form.append('has_header', hasHeader ? '1' : '0');
	const response = await mainWpApiRequest.call(this, 'POST', '/users/import', {}, {}, {
		body: form,
	});
	// Returns a UserImportReport (per-row outcomes, no envelope) — unwrapData passes it through.
	return unwrapData(response);
};

const updateAdminPassword: OperationHandler = async function (this, i) {
	const body: IDataObject = {
		password: this.getNodeParameter('password', i) as string,
		...(this.getNodeParameter('scope', i, {}) as IDataObject),
	};
	const response = await mainWpApiRequest.call(this, 'PUT', '/users/update-admin-password', body);
	return unwrapData(response);
};

const deleteUser: OperationHandler = async function (this, i) {
	const userId = this.getNodeParameter('userId', i) as string;
	const response = await mainWpApiRequest.call(
		this,
		'DELETE',
		`/users/${siteValue(this, i)}/${userId}/delete`,
	);
	return unwrapData(response);
};

const update: OperationHandler = async function (this, i) {
	const userId = this.getNodeParameter('userId', i) as string;
	const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
	const response = await mainWpApiRequest.call(
		this,
		'PUT',
		`/users/${siteValue(this, i)}/${userId}/edit`,
		body,
	);
	return unwrapData(response);
};

export const operations: Record<string, OperationHandler> = {
	create,
	delete: deleteUser,
	getAll,
	import: importUsers,
	update,
	updateAdminPassword,
};
