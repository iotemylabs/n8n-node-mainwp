import type { INodeProperties } from 'n8n-workflow';

import { returnAllAndLimit } from './shared';

export const costOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cost'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				action: 'Add a cost',
				description:
					'Create a Cost Tracker record. Assign it to at least one site, tag, or client, or the request fails.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a cost',
				description: 'Get one Cost Tracker record',
			},
			{
				name: 'Get Clients',
				value: 'getClients',
				action: 'Get the clients of a cost',
				description: 'List the clients linked to a cost',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many costs',
				description: 'List Cost Tracker records',
			},
			{
				name: 'Get Sites',
				value: 'getSites',
				action: 'Get the sites of a cost',
				description: 'List the sites linked to a cost',
			},
			{
				name: 'Remove',
				value: 'remove',
				action: 'Remove a cost',
				description: 'Permanently delete the cost record. This cannot be undone.',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a cost',
				description:
					'Update a Cost Tracker record. The same fields are required as when creating one.',
			},
		],
		default: 'getAll',
	},
];

export const costFields: INodeProperties[] = [
	// ----------------------------------------------------------------------
	// cost — {id} routes
	// ----------------------------------------------------------------------
	{
		displayName: 'Cost ID',
		name: 'costId',
		type: 'string',
		default: '',
		required: true,
		placeholder: '12',
		description: 'ID of the cost record to act on',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['get', 'getClients', 'getSites', 'remove', 'update'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// cost:getAll
	// ----------------------------------------------------------------------
	...returnAllAndLimit('cost', ['getAll']),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Product category to filter on',
			},
			{
				displayName: 'Exclude IDs',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'Comma-separated list of cost IDs to leave out of the result set',
			},
			{
				displayName: 'Include IDs',
				name: 'include',
				type: 'string',
				default: '',
				description: 'Comma-separated list of cost IDs to limit the result set to',
			},
			{
				displayName: 'Payment Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'Lifetime', value: 'lifetime' },
					{ name: 'Subscription', value: 'subscription' },
				],
				default: 'any',
				description: 'Payment type to filter on',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only records matching this string',
			},
		],
	},

	// ----------------------------------------------------------------------
	// cost:add / update — required CostInput fields
	// ----------------------------------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Cost name',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		default: 0,
		required: true,
		description: 'Amount charged per renewal period',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'Payment Type',
		name: 'paymentType',
		type: 'options',
		options: [
			{ name: 'Lifetime', value: 'lifetime' },
			{ name: 'Subscription', value: 'subscription' },
		],
		default: 'subscription',
		required: true,
		description: 'Payment type of the cost',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'Product Type',
		name: 'productType',
		type: 'string',
		default: '',
		required: true,
		description:
			'Product type slug, as listed by the Get Cost Tracker settings operation (GET /settings/cost-tracker)',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'License Type',
		name: 'licenseType',
		type: 'string',
		default: '',
		required: true,
		description: 'Licence type of the cost',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'costStatus',
		type: 'string',
		default: '',
		required: true,
		description: 'Status of the cost record',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'Product Color',
		name: 'productColor',
		type: 'color',
		default: '',
		required: true,
		placeholder: '#7fb100',
		description: 'Hex colour used for the record in the interface',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'Payment Method',
		name: 'paymentMethod',
		type: 'string',
		default: '',
		required: true,
		description:
			'Payment method slug, as listed by the Get Cost Tracker settings operation (GET /settings/cost-tracker)',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
	},
	{
		displayName: 'Renewal Type',
		name: 'renewalType',
		type: 'string',
		default: '',
		required: true,
		description: 'Renewal period of the cost',
		displayOptions: {
			show: {
				resource: ['cost'],
				operation: ['add', 'update'],
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
				resource: ['cost'],
				operation: ['add', 'update'],
			},
		},
		options: [
			{
				displayName: 'Client IDs',
				name: 'clients',
				type: 'string',
				default: '',
				description: 'Comma-separated client IDs the cost applies to',
			},
			{
				displayName: 'Icon',
				name: 'icon_hidden',
				type: 'string',
				default: '',
				description: 'Icon shown against the record',
			},
			{
				displayName: 'Last Renewal',
				name: 'last_renewal',
				type: 'string',
				default: '',
				description: 'Date of the last renewal. Any format strtotime() accepts.',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Free-form note stored with the record',
			},
			{
				displayName: 'Product Slug',
				name: 'product_slug',
				type: 'string',
				default: '',
				description: 'Slug of the product the cost covers',
			},
			{
				displayName: 'Site IDs',
				name: 'sites',
				type: 'string',
				default: '',
				description: 'Comma-separated site IDs the cost applies to',
			},
			{
				displayName: 'Tag IDs',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Comma-separated tag IDs the cost applies to',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Link to the vendor or product page',
			},
		],
	},
];
