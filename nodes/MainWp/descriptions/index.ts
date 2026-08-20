import type { INodeProperties } from 'n8n-workflow';

import { batchFields, batchOperations } from './BatchDescription';
import { clientFields, clientOperations } from './ClientDescription';
import { costFields, costOperations } from './CostDescription';
import { monitorFields, monitorOperations } from './MonitorDescription';
import { pageFields, pageOperations } from './PageDescription';
import { postFields, postOperations } from './PostDescription';
import { settingsFields, settingsOperations } from './SettingsDescription';
import { siteFields, siteOperations } from './SiteDescription';
import { tagFields, tagOperations } from './TagDescription';
import { updateFields, updateOperations } from './UpdateDescription';
import { userFields, userOperations } from './UserDescription';

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

export const resourceDescriptions: INodeProperties[] = [
	...batchOperations,
	...batchFields,
	...clientOperations,
	...clientFields,
	...costOperations,
	...costFields,
	...monitorOperations,
	...monitorFields,
	...pageOperations,
	...pageFields,
	...postOperations,
	...postFields,
	...settingsOperations,
	...settingsFields,
	...siteOperations,
	...siteFields,
	...tagOperations,
	...tagFields,
	...updateOperations,
	...updateFields,
	...userOperations,
	...userFields,
];
