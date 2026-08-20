import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { OperationHandler } from './index';
import { mainWpApiRequest } from '../GenericFunctions';

const ACTION_GROUPS = ['clients', 'costs', 'sites', 'tags', 'updates'] as const;

function parseGroup(
	context: IExecuteFunctions,
	i: number,
	parameterName: string,
): IDataObject | undefined {
	const raw = context.getNodeParameter(parameterName, i, '') as string | IDataObject;
	if (raw === null || raw === undefined) return undefined;

	let value: unknown = raw;
	if (typeof raw === 'string') {
		const trimmed = raw.trim();
		if (trimmed === '') return undefined;
		try {
			value = JSON.parse(trimmed);
		} catch {
			throw new NodeOperationError(
				context.getNode(),
				`The "${parameterName}" parameter is not valid JSON`,
				{ itemIndex: i },
			);
		}
	}

	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		throw new NodeOperationError(
			context.getNode(),
			`The "${parameterName}" parameter must be a JSON object keyed by action, e.g. { "sync": [1, 2] }`,
			{ itemIndex: i },
		);
	}

	const group = value as IDataObject;
	return Object.keys(group).length === 0 ? undefined : group;
}

const run: OperationHandler = async function (this, i) {
	const body: IDataObject = {};
	for (const groupName of ACTION_GROUPS) {
		const group = parseGroup(this, i, groupName);
		if (group !== undefined) body[groupName] = group;
	}

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'Provide at least one action group (Sites, Clients, Costs, Tags, or Updates)',
			{ itemIndex: i },
		);
	}

	// Returns a BatchResult keyed by action group, mirroring the request
	// structure — failed items carry an error object instead of failing the
	// whole call. Passed through as-is (no envelope unwrapping).
	return await mainWpApiRequest.call(this, 'POST', '/batch', body);
};

export const operations: Record<string, OperationHandler> = {
	run,
};
