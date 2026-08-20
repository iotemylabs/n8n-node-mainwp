import type { INodeProperties } from 'n8n-workflow';

import { clientLocator, returnAllAndLimit } from './shared';

const CLIENT_LOCATOR_OPERATIONS = [
	'countSites',
	'get',
	'getCosts',
	'getSites',
	'remove',
	'suspend',
	'unsuspend',
	'update',
];

export const clientOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['client'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				action: 'Add a client',
				description: 'Create a client record and optionally assign sites to it',
			},
			{
				name: 'Add Field',
				value: 'addField',
				action: 'Add a client field',
				description: 'Create a custom client field',
			},
			{
				name: 'Count',
				value: 'count',
				action: 'Count clients',
			},
			{
				name: 'Count Sites',
				value: 'countSites',
				action: 'Count the sites of a client',
				description: 'Count the sites assigned to a client',
			},
			{
				name: 'Delete Field',
				value: 'deleteField',
				action: 'Delete a client field',
				description:
					'Permanently delete a custom client field and the values stored in it. This cannot be undone.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a client',
			},
			{
				name: 'Get Costs',
				value: 'getCosts',
				action: 'Get the costs of a client',
				description: 'List cost records linked to a client',
			},
			{
				name: 'Get Fields',
				value: 'getFields',
				action: 'Get client fields',
				description: 'List the custom client fields',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many clients',
				description: 'List the stored client records',
			},
			{
				name: 'Get Sites',
				value: 'getSites',
				action: 'Get the sites of a client',
				description: 'List the sites assigned to a client. Returns the full set in one call.',
			},
			{
				name: 'Remove',
				value: 'remove',
				action: 'Remove a client',
				description:
					'Delete the client record from the Dashboard. The sites assigned to it are kept, but the client data is deleted. This cannot be undone.',
			},
			{
				name: 'Suspend',
				value: 'suspend',
				action: 'Suspend a client',
				description: 'Mark a client as suspended',
			},
			{
				name: 'Unsuspend',
				value: 'unsuspend',
				action: 'Unsuspend a client',
				description: 'Mark a suspended client as active again',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a client',
			},
			{
				name: 'Update Field',
				value: 'updateField',
				action: 'Update a client field',
				description: 'Update the name or description of a custom client field',
			},
		],
		default: 'getAll',
	},
];

export const clientFields: INodeProperties[] = [
	clientLocator('client', CLIENT_LOCATOR_OPERATIONS),

	// ----------------------------------------------------------------------
	// client:getAll / getFields — pagination
	// ----------------------------------------------------------------------
	...returnAllAndLimit('client', ['getAll', 'getFields']),

	// ----------------------------------------------------------------------
	// client:getAll / count — filters
	// ----------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getAll', 'count'],
			},
		},
		options: [
			{
				displayName: 'Exclude IDs',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'Comma-separated list of client IDs to leave out of the result set',
			},
			{
				displayName: 'Include IDs',
				name: 'include',
				type: 'string',
				default: '',
				description: 'Comma-separated list of client IDs to limit the result set to',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only clients matching this string',
			},
		],
	},

	// ----------------------------------------------------------------------
	// client:getFields — filters
	// ----------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'fieldFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getFields'],
			},
		},
		options: [
			{
				displayName: 'Exclude IDs',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'Comma-separated list of client field IDs to leave out of the result set',
			},
			{
				displayName: 'Include IDs',
				name: 'include',
				type: 'string',
				default: '',
				description: 'Comma-separated list of client field IDs to limit the result set to',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only client fields whose name matches this string',
			},
		],
	},

	// ----------------------------------------------------------------------
	// client:add
	// ----------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the client',
		displayOptions: {
			show: {
				resource: ['client'],
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
				resource: ['client'],
				operation: ['add'],
			},
		},
		options: [
			{
				displayName: 'Address Line 1',
				name: 'address_1',
				type: 'string',
				default: '',
				description: 'Street address, first line',
			},
			{
				displayName: 'Address Line 2',
				name: 'address_2',
				type: 'string',
				default: '',
				description: 'Street address, second line',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'client_email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Primary contact email',
			},
			{
				displayName: 'Facebook URL',
				name: 'client_facebook',
				type: 'string',
				default: '',
				description: 'Facebook profile URL',
			},
			{
				displayName: 'Instagram URL',
				name: 'client_instagram',
				type: 'string',
				default: '',
				description: 'Instagram profile URL',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'client_linkedin',
				type: 'string',
				default: '',
				description: 'LinkedIn profile URL',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Free-form note stored with the client',
			},
			{
				displayName: 'Phone',
				name: 'client_phone',
				type: 'string',
				default: '',
				description: 'Primary contact phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'zip',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Primary Contact ID',
				name: 'primary_contact_id',
				type: 'number',
				default: 0,
				description: 'Contact record to use as the primary contact',
			},
			{
				displayName: 'Site IDs',
				name: 'selected_sites',
				type: 'string',
				default: '',
				description: 'Comma-separated site IDs to assign to the client',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or region',
			},
			{
				displayName: 'Twitter URL',
				name: 'client_twitter',
				type: 'string',
				default: '',
				description: 'X (formerly Twitter) profile URL',
			},
		],
	},

	// ----------------------------------------------------------------------
	// client:update
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Address Line 1',
				name: 'address_1',
				type: 'string',
				default: '',
				description: 'Street address, first line',
			},
			{
				displayName: 'Address Line 2',
				name: 'address_2',
				type: 'string',
				default: '',
				description: 'Street address, second line',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'client_email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Primary contact email',
			},
			{
				displayName: 'Facebook URL',
				name: 'client_facebook',
				type: 'string',
				default: '',
				description: 'Facebook profile URL',
			},
			{
				displayName: 'Instagram URL',
				name: 'client_instagram',
				type: 'string',
				default: '',
				description: 'Instagram profile URL',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'client_linkedin',
				type: 'string',
				default: '',
				description: 'LinkedIn profile URL',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the client',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Free-form note stored with the client',
			},
			{
				displayName: 'Phone',
				name: 'client_phone',
				type: 'string',
				default: '',
				description: 'Primary contact phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'zip',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Primary Contact ID',
				name: 'primary_contact_id',
				type: 'number',
				default: 0,
				description: 'Contact record to use as the primary contact',
			},
			{
				displayName: 'Site IDs',
				name: 'selected_sites',
				type: 'string',
				default: '',
				description:
					'Comma-separated site IDs assigned to the client. Replaces the current assignment.',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or region',
			},
			{
				displayName: 'Twitter URL',
				name: 'client_twitter',
				type: 'string',
				default: '',
				description: 'X (formerly Twitter) profile URL',
			},
		],
	},

	// ----------------------------------------------------------------------
	// client:addField
	// ----------------------------------------------------------------------
	{
		displayName: 'Field Name',
		name: 'fieldName',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the client field',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['addField'],
			},
		},
	},
	{
		displayName: 'Field Description',
		name: 'fieldDescription',
		type: 'string',
		default: '',
		required: true,
		description: 'Description of the client field',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['addField'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// client:updateField / deleteField
	// ----------------------------------------------------------------------
	{
		displayName: 'Field ID or Name',
		name: 'fieldIdName',
		type: 'string',
		default: '',
		required: true,
		description: 'ID or name of the client field to act on',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['deleteField', 'updateField'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'fieldUpdateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['updateField'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the client field',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the client field',
			},
		],
	},
];
