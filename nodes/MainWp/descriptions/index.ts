import type { INodeProperties } from 'n8n-workflow';

import { siteFields, siteOperations } from './SiteDescription';

export const resourceSelector: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Batch', value: 'batch' },
		{ name: 'Client', value: 'client' },
		{ name: 'Cost', value: 'cost' },
		{ name: 'Monitor', value: 'monitor' },
		{ name: 'Page', value: 'page' },
		{ name: 'Post', value: 'post' },
		{ name: 'Setting', value: 'settings' },
		{ name: 'Site', value: 'site' },
		{ name: 'Tag', value: 'tag' },
		{ name: 'Update', value: 'update' },
		{ name: 'User', value: 'user' },
	],
	default: 'site',
};

export const resourceDescriptions: INodeProperties[] = [...siteOperations, ...siteFields];
