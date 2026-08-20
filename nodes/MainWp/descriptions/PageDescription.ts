import type { INodeProperties } from 'n8n-workflow';

import { siteLocator } from './shared';

const SITE_LOCATOR_OPERATIONS = ['create', 'delete', 'get', 'update', 'updateStatus'];

export const pageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['page'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a page',
				description: 'Create a new page on a child site',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a page',
				description:
					'Permanently delete the page from the live child site. This cannot be undone.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a page',
				description: 'Get one page from a child site',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many pages',
				description: 'List pages across the connected child sites',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a page',
				description: 'Update an existing page on a child site',
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update the status of a page',
				description: 'Change the status of a page on a child site',
			},
		],
		default: 'getAll',
	},
];

export const pageFields: INodeProperties[] = [
	siteLocator('page', SITE_LOCATOR_OPERATIONS),
	{
		displayName: 'Page ID',
		name: 'pageId',
		type: 'string',
		default: '',
		required: true,
		placeholder: '123',
		description: 'ID of the page on the child site',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['delete', 'get', 'update', 'updateStatus'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// page:getAll
	// ----------------------------------------------------------------------
	{
		displayName: 'Maximum',
		name: 'maximum',
		type: 'number',
		default: 10,
		typeOptions: {
			minValue: 1,
		},
		description:
			'Maximum number of pages to return. The API returns up to this many records in a single response — this route has no pagination.',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Clients',
				name: 'clients',
				type: 'string',
				default: '',
				description: 'Return only pages from sites of these clients',
			},
			{
				displayName: 'End Date',
				name: 'dtsstop',
				type: 'string',
				default: '',
				placeholder: '2026-01-31',
				description: 'Return only pages up to this date',
			},
			{
				displayName: 'Page Type',
				name: 'post_type',
				type: 'string',
				default: '',
				description: 'Return only pages of this page type',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only pages matching this keyword',
			},
			{
				displayName: 'Search On',
				name: 'search_on',
				type: 'options',
				options: [
					{ name: 'Body', value: 'body' },
					{ name: 'Title', value: 'title' },
					{ name: 'Title and Body', value: 'Title and Body' },
				],
				default: 'title',
				description: 'Where the search keyword is matched',
			},
			{
				displayName: 'Start Date',
				name: 'dtsstart',
				type: 'string',
				default: '',
				placeholder: '2026-01-01',
				description: 'Return only pages from this date on',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Future', value: 'future' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Private', value: 'private' },
					{ name: 'Publish', value: 'publish' },
					{ name: 'Trash', value: 'trash' },
				],
				default: 'publish',
				description: 'Return only pages with this status',
			},
			{
				displayName: 'Tags',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Return only pages from sites with these tags',
			},
			{
				displayName: 'Website IDs',
				name: 'websites',
				type: 'string',
				default: '',
				description: 'Child site IDs to limit the result set to',
			},
		],
	},

	// ----------------------------------------------------------------------
	// page:create
	// ----------------------------------------------------------------------
	{
		displayName: 'Title',
		name: 'post_title',
		type: 'string',
		default: '',
		required: true,
		description: 'Title of the page',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'post_content',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 4,
		},
		description: 'Content of the page',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Slug',
		name: 'post_name',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'my-new-page',
		description: 'URL slug of the page',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'post_status',
		type: 'options',
		options: [
			{ name: 'Draft', value: 'draft' },
			{ name: 'Future', value: 'future' },
			{ name: 'Pending', value: 'pending' },
			{ name: 'Private', value: 'private' },
			{ name: 'Publish', value: 'publish' },
			{ name: 'Trash', value: 'trash' },
		],
		default: 'draft',
		required: true,
		description: 'Status to create the page with',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['create'],
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
				resource: ['page'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Comment Status',
				name: 'comment_status',
				type: 'options',
				options: [
					{ name: 'Closed', value: 'closed' },
					{ name: 'Open', value: 'open' },
				],
				default: 'open',
				description: 'Whether comments are open on the page',
			},
			{
				displayName: 'Custom Fields',
				name: 'post_custom',
				type: 'json',
				default: '{}',
				description: 'Custom meta key/values of the page, as a JSON object',
			},
			{
				displayName: 'Date',
				name: 'post_date',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the page (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Date GMT',
				name: 'post_date_gmt',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the page in GMT (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Excerpt',
				name: 'post_excerpt',
				type: 'string',
				default: '',
				description: 'Excerpt of the page',
			},
			{
				displayName: 'Featured Image',
				name: 'post_featured_image',
				type: 'string',
				default: '',
				description: 'Featured image URL or data',
			},
			{
				displayName: 'Featured Image Data',
				name: 'featured_image_data',
				type: 'json',
				default: '{}',
				description: 'Featured image extra data, as a JSON object',
			},
			{
				displayName: 'Password',
				name: 'post_password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password protecting the page',
			},
			{
				displayName: 'Ping Status',
				name: 'ping_status',
				type: 'options',
				options: [
					{ name: 'Closed', value: 'closed' },
					{ name: 'Open', value: 'open' },
				],
				default: 'open',
				description: 'Whether pingbacks are open on the page',
			},
			{
				displayName: 'Sticky',
				name: 'is_sticky',
				type: 'options',
				options: [
					{ name: 'Not Sticky', value: 0 },
					{ name: 'Sticky', value: 1 },
				],
				default: 0,
				description: 'Whether the page is sticky',
			},
		],
	},

	// ----------------------------------------------------------------------
	// page:update
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Comment Status',
				name: 'comment_status',
				type: 'options',
				options: [
					{ name: 'Closed', value: 'closed' },
					{ name: 'Open', value: 'open' },
				],
				default: 'open',
				description: 'Whether comments are open on the page',
			},
			{
				displayName: 'Content',
				name: 'post_content',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'Content of the page',
			},
			{
				displayName: 'Custom Fields',
				name: 'post_custom',
				type: 'json',
				default: '{}',
				description: 'Custom meta key/values of the page, as a JSON object',
			},
			{
				displayName: 'Date',
				name: 'post_date',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the page (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Date GMT',
				name: 'post_date_gmt',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the page in GMT (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Excerpt',
				name: 'post_excerpt',
				type: 'string',
				default: '',
				description: 'Excerpt of the page',
			},
			{
				displayName: 'Featured Image',
				name: 'post_featured_image',
				type: 'string',
				default: '',
				description: 'Featured image URL or data',
			},
			{
				displayName: 'Featured Image Data',
				name: 'featured_image_data',
				type: 'json',
				default: '{}',
				description: 'Featured image extra data, as a JSON object',
			},
			{
				displayName: 'Password',
				name: 'post_password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password protecting the page',
			},
			{
				displayName: 'Ping Status',
				name: 'ping_status',
				type: 'options',
				options: [
					{ name: 'Closed', value: 'closed' },
					{ name: 'Open', value: 'open' },
				],
				default: 'open',
				description: 'Whether pingbacks are open on the page',
			},
			{
				displayName: 'Slug',
				name: 'post_name',
				type: 'string',
				default: '',
				description: 'URL slug of the page',
			},
			{
				displayName: 'Status',
				name: 'post_status',
				type: 'options',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Future', value: 'future' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Private', value: 'private' },
					{ name: 'Publish', value: 'publish' },
					{ name: 'Trash', value: 'trash' },
				],
				default: 'draft',
				description: 'Status of the page',
			},
			{
				displayName: 'Sticky',
				name: 'is_sticky',
				type: 'options',
				options: [
					{ name: 'Not Sticky', value: 0 },
					{ name: 'Sticky', value: 1 },
				],
				default: 0,
				description: 'Whether the page is sticky',
			},
			{
				displayName: 'Title',
				name: 'post_title',
				type: 'string',
				default: '',
				description: 'Title of the page',
			},
		],
	},

	// ----------------------------------------------------------------------
	// page:updateStatus
	// ----------------------------------------------------------------------
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Approve', value: 'approve' },
			{ name: 'Delete', value: 'delete' },
			{ name: 'Publish', value: 'publish' },
			{ name: 'Restore', value: 'restore' },
			{ name: 'Trash', value: 'trash' },
			{ name: 'Unpublish', value: 'unpublish' },
		],
		default: 'publish',
		required: true,
		description:
			'New status for the page. "Delete" permanently deletes the page from the live child site and cannot be undone.',
		displayOptions: {
			show: {
				resource: ['page'],
				operation: ['updateStatus'],
			},
		},
	},
];
