import type { INodeProperties } from 'n8n-workflow';

export const batchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['batch'],
			},
		},
		options: [
			{
				name: 'Run',
				value: 'run',
				action: 'Run grouped actions across controllers',
				description:
					'Run grouped actions against the sites, clients, updates, costs, and tags controllers in one request. Actions run on live production sites immediately. The default limit is 100 items across all groups. The response is a BatchResult keyed by action group — failed items carry an error object and the call does not fail as a whole.',
			},
		],
		default: 'run',
	},
];

export const batchFields: INodeProperties[] = [
	{
		displayName: 'Clients',
		name: 'clients',
		type: 'json',
		default: '',
		placeholder: '{ "create": [ { "name": "Client A" } ] }',
		description:
			'Client actions as JSON. Supports "create": an array of clients to create, with the same fields as the client Create operation. Counts toward the default limit of 100 items across all groups.',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['run'],
			},
		},
	},
	{
		displayName: 'Costs',
		name: 'costs',
		type: 'json',
		default: '',
		placeholder: '{ "create": [ { "name": "Hosting", "price": 10 } ] }',
		description:
			'Cost actions as JSON. Supports "create": an array of cost records to create, with the same fields as the cost Create operation. Counts toward the default limit of 100 items across all groups.',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['run'],
			},
		},
	},
	{
		displayName: 'Sites',
		name: 'sites',
		type: 'json',
		default: '',
		placeholder: '{ "sync": [1, 2], "check": [3] }',
		description:
			'Site actions as JSON. Supports "create" (an array of sites to connect, same fields as the site Add operation) and arrays of site IDs under "sync", "reconnect", "disconnect", "suspend", "check", "remove", "security", "plugins", "themes", and "non-mainwp-changes". Counts toward the default limit of 100 items across all groups.',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['run'],
			},
		},
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'json',
		default: '',
		placeholder: '{ "create": [ { "name": "Production" } ] }',
		description:
			'Tag actions as JSON. Supports "create": an array of tags to create, with the same fields as the tag Create operation. Counts toward the default limit of 100 items across all groups.',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['run'],
			},
		},
	},
	{
		displayName: 'Updates',
		name: 'updates',
		type: 'json',
		default: '',
		description:
			'Update actions as JSON. The route accepts a "create" array here, but the Dashboard has no create handler for updates — every item comes back as an "invalid-method" error. Use the Update resource operations instead.',
		displayOptions: {
			show: {
				resource: ['batch'],
				operation: ['run'],
			},
		},
	},
];
