import type { INodeProperties } from 'n8n-workflow';

import { siteLocator } from './shared';

const SITE_LOCATOR_OPERATIONS = ['create', 'delete', 'get', 'update', 'updateStatus'];

export const postOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['post'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a post',
				description: 'Create a new post on a child site',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a post',
				description:
					'Permanently delete the post from the live child site. This cannot be undone.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a post',
				description: 'Get one post from a child site',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many posts',
				description: 'List posts across the connected child sites',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a post',
				description: 'Update an existing post on a child site',
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update the status of a post',
				description: 'Change the status of a post on a child site',
			},
		],
		default: 'getAll',
	},
];

export const postFields: INodeProperties[] = [
	siteLocator('post', SITE_LOCATOR_OPERATIONS),
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'string',
		default: '',
		required: true,
		placeholder: '123',
		description: 'ID of the post on the child site',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['delete', 'get', 'update', 'updateStatus'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// post:getAll
	// ----------------------------------------------------------------------
	{
		displayName: 'Maximum',
		name: 'maximum',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description:
			'Maximum number of posts to return. The API returns up to this many records in a single response — this route has no pagination.',
		displayOptions: {
			show: {
				resource: ['post'],
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
				resource: ['post'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Clients',
				name: 'clients',
				type: 'string',
				default: '',
				description: 'Return only posts from sites of these clients',
			},
			{
				displayName: 'End Date',
				name: 'dtsstop',
				type: 'string',
				default: '',
				placeholder: '2026-01-31',
				description: 'Return only posts up to this date',
			},
			{
				displayName: 'Post Type',
				name: 'post_type',
				type: 'string',
				default: '',
				description: 'Return only posts of this post type',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only posts matching this keyword',
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
				description: 'Return only posts from this date on',
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
				description: 'Return only posts with this status',
			},
			{
				displayName: 'Tags',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Return only posts from sites with these tags',
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
	// post:create
	// ----------------------------------------------------------------------
	{
		displayName: 'Title',
		name: 'post_title',
		type: 'string',
		default: '',
		required: true,
		description: 'Title of the post',
		displayOptions: {
			show: {
				resource: ['post'],
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
		description: 'Content of the post',
		displayOptions: {
			show: {
				resource: ['post'],
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
		placeholder: 'my-new-post',
		description: 'URL slug of the post',
		displayOptions: {
			show: {
				resource: ['post'],
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
		description: 'Status to create the post with',
		displayOptions: {
			show: {
				resource: ['post'],
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
				resource: ['post'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Categories',
				name: 'post_category',
				type: 'string',
				default: '',
				description: 'Categories of the post, as a raw string',
			},
			{
				displayName: 'Comment Status',
				name: 'comment_status',
				type: 'options',
				options: [
					{ name: 'Closed', value: 'closed' },
					{ name: 'Open', value: 'open' },
				],
				default: 'open',
				description: 'Whether comments are open on the post',
			},
			{
				displayName: 'Custom Fields',
				name: 'post_custom',
				type: 'json',
				default: '{}',
				description: 'Custom meta key/values of the post, as a JSON object',
			},
			{
				displayName: 'Date',
				name: 'post_date',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the post (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Date GMT',
				name: 'post_date_gmt',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the post in GMT (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Excerpt',
				name: 'post_excerpt',
				type: 'string',
				default: '',
				description: 'Excerpt of the post',
			},
			{
				displayName: 'Featured Image',
				name: 'post_featured_image',
				type: 'string',
				default: '',
				description: 'Featured image URL or data',
			},
			{
				displayName: 'Gallery Images',
				name: 'post_gallery_images',
				type: 'json',
				default: '[]',
				description: 'Gallery images, as a JSON array of objects with ID, src, title, alt, caption, and description',
			},
			{
				displayName: 'Password',
				name: 'post_password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password protecting the post',
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
				description: 'Whether pingbacks are open on the post',
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
				description: 'Whether the post is sticky',
			},
			{
				displayName: 'Tags',
				name: 'post_tags',
				type: 'string',
				default: '',
				description: 'Tags of the post, as a string',
			},
		],
	},

	// ----------------------------------------------------------------------
	// post:update
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Categories',
				name: 'post_category',
				type: 'string',
				default: '',
				description: 'Categories of the post, as a raw string',
			},
			{
				displayName: 'Comment Status',
				name: 'comment_status',
				type: 'options',
				options: [
					{ name: 'Closed', value: 'closed' },
					{ name: 'Open', value: 'open' },
				],
				default: 'open',
				description: 'Whether comments are open on the post',
			},
			{
				displayName: 'Content',
				name: 'post_content',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'Content of the post',
			},
			{
				displayName: 'Custom Fields',
				name: 'post_custom',
				type: 'json',
				default: '{}',
				description: 'Custom meta key/values of the post, as a JSON object',
			},
			{
				displayName: 'Date',
				name: 'post_date',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the post (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Date GMT',
				name: 'post_date_gmt',
				type: 'string',
				default: '',
				placeholder: '2026-01-15 09:30:00',
				description: 'Date of the post in GMT (YYYY-MM-DD HH:MM:SS)',
			},
			{
				displayName: 'Excerpt',
				name: 'post_excerpt',
				type: 'string',
				default: '',
				description: 'Excerpt of the post',
			},
			{
				displayName: 'Password',
				name: 'post_password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password protecting the post',
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
				description: 'Whether pingbacks are open on the post',
			},
			{
				displayName: 'Slug',
				name: 'post_name',
				type: 'string',
				default: '',
				description: 'URL slug of the post',
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
				description: 'Status of the post',
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
				description: 'Whether the post is sticky',
			},
			{
				displayName: 'Tags',
				name: 'post_tags',
				type: 'string',
				default: '',
				description: 'Tags of the post, as a string',
			},
			{
				displayName: 'Title',
				name: 'post_title',
				type: 'string',
				default: '',
				description: 'Title of the post',
			},
		],
	},

	// ----------------------------------------------------------------------
	// post:updateStatus
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
			'New status for the post. "Delete" permanently deletes the post from the live child site and cannot be undone.',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['updateStatus'],
			},
		},
	},
];
