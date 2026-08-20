import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { resourceSelector, resourceDescriptions } from './descriptions';
import { listSearch, loadOptions } from './loadOptions';
import { router } from './operations';

export class MainWp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MainWP',
		name: 'mainWp',
		icon: { light: 'file:mainwp.svg', dark: 'file:mainwp.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage WordPress sites through a MainWP Dashboard',
		defaults: {
			name: 'MainWP',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'mainWpApi',
				required: true,
			},
		],
		properties: [resourceSelector, ...resourceDescriptions],
	};

	methods = {
		listSearch,
		loadOptions,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await router.call(this);
	}
}
