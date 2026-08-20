import type { INodeProperties } from 'n8n-workflow';

import { returnAllAndLimit, tagLocator } from './shared';

const TAG_LOCATOR_OPERATIONS = ['get', 'getClients', 'getSites', 'remove', 'update'];

export const tagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tag'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				action: 'Add a tag',
				description: 'Create a tag in the Dashboard',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a tag',
			},
			{
				name: 'Get Clients',
				value: 'getClients',
				action: 'Get the clients of a tag',
				description: 'List the clients in a tag. Returns the full set in one call.',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tags',
				description: 'List the tags stored in the Dashboard',
			},
			{
				name: 'Get Sites',
				value: 'getSites',
				action: 'Get the sites of a tag',
				description: 'List the sites in a tag. Returns the full set in one call.',
			},
			{
				name: 'Remove',
				value: 'remove',
				action: 'Remove a tag',
				description:
					'Delete the tag from the Dashboard. The sites and clients in it are kept, but the tag itself is deleted. This cannot be undone.',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a tag',
				description: 'Update the name or color of a tag',
			},
		],
		default: 'getAll',
	},
];

export const tagFields: INodeProperties[] = [
	tagLocator('tag', TAG_LOCATOR_OPERATIONS),

	// ----------------------------------------------------------------------
	// tag:getAll — pagination + filters
	// ----------------------------------------------------------------------
	...returnAllAndLimit('tag', ['getAll']),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Exclude IDs',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag IDs to leave out of the result set',
			},
			{
				displayName: 'Include IDs',
				name: 'include',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag IDs to limit the result set to',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only tags matching this string',
			},
		],
	},

	// ----------------------------------------------------------------------
	// tag:add
	// ----------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the tag',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['add'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['add'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Hex color used for the tag in the interface, for example #7fb100',
			},
		],
	},

	// ----------------------------------------------------------------------
	// tag:update
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Hex color used for the tag in the interface, for example #7fb100',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the tag',
			},
		],
	},
];
