import type { INodeProperties } from 'n8n-workflow';

/**
 * resourceLocator for routes taking {id_domain} — a site ID or a domain.
 */
export function siteLocator(resource: string, operations: string[]): INodeProperties {
	return {
		displayName: 'Site',
		name: 'site',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The child site to act on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchSites',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[0-9]+',
							errorMessage: 'Not a valid site ID',
						},
					},
				],
				placeholder: '42',
			},
			{
				displayName: 'By Domain',
				name: 'domain',
				type: 'string',
				placeholder: 'example.com',
			},
		],
		displayOptions: {
			show: {
				resource: [resource],
				operation: operations,
			},
		},
	};
}

/**
 * resourceLocator for routes taking {id_email} — a client ID or an email address.
 */
export function clientLocator(resource: string, operations: string[]): INodeProperties {
	return {
		displayName: 'Client',
		name: 'client',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The client to act on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchClients',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[0-9]+',
							errorMessage: 'Not a valid client ID',
						},
					},
				],
				placeholder: '7',
			},
			{
				displayName: 'By Email',
				name: 'email',
				type: 'string',
				placeholder: 'client@example.com',
			},
		],
		displayOptions: {
			show: {
				resource: [resource],
				operation: operations,
			},
		},
	};
}

/**
 * resourceLocator for routes taking a tag {id}.
 */
export function tagLocator(resource: string, operations: string[]): INodeProperties {
	return {
		displayName: 'Tag',
		name: 'tag',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The tag to act on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchTags',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[0-9]+',
							errorMessage: 'Not a valid tag ID',
						},
					},
				],
				placeholder: '3',
			},
		],
		displayOptions: {
			show: {
				resource: [resource],
				operation: operations,
			},
		},
	};
}

/**
 * Return All + Limit pair for paginated list operations.
 */
export function returnAllAndLimit(resource: string, operations: string[]): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions: {
				show: {
					resource: [resource],
					operation: operations,
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			typeOptions: {
				minValue: 1,
			},
			description: 'Max number of results to return',
			displayOptions: {
				show: {
					resource: [resource],
					operation: operations,
					returnAll: [false],
				},
			},
		},
	];
}
