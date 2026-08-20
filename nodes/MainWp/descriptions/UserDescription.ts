import type { INodeProperties } from 'n8n-workflow';

import { siteLocator } from './shared';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a user on sites',
				description:
					'Create the same user account on every selected site and report which sites succeeded',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a user from a site',
				description:
					'Permanently delete a user from the live child site. Content owned by the user is handled by WordPress on the child site. This cannot be undone.',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many users',
				description:
					'List users from the selected sites. Users are read from each child site while the request runs.',
			},
			{
				name: 'Import',
				value: 'import',
				action: 'Import users from a file',
				description:
					'Create users from an uploaded CSV file. The response is an import report with the outcome of every row.',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a user on a site',
				description: 'Update the profile fields of one user on one live child site',
			},
			{
				name: 'Update Admin Password',
				value: 'updateAdminPassword',
				action: 'Update administrator passwords on sites',
				description:
					'Set a new password for the administrator account MainWP uses on each selected site. This changes real login credentials on live production sites — without a scope, every connected site is affected.',
			},
		],
		default: 'getAll',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------------------------------------------
	// user — {id_domain} routes
	// ----------------------------------------------------------------------
	siteLocator('user', ['delete', 'update']),
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		placeholder: '7',
		description: 'ID of the user on the child site',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['delete', 'update'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// user:getAll
	// ----------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Clients',
				name: 'clients',
				type: 'string',
				default: '',
				description: 'Return only users from sites of these clients',
			},
			{
				displayName: 'Roles',
				name: 'roles',
				type: 'string',
				default: '',
				placeholder: 'administrator, editor',
				description: 'Comma-separated list of roles to limit the result set to',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only users whose name matches this string',
			},
			{
				displayName: 'Site IDs',
				name: 'websites',
				type: 'string',
				default: '',
				description: 'Comma-separated child site IDs to read users from',
			},
			{
				displayName: 'Tags',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Return only users from sites with these tags',
			},
		],
	},

	// ----------------------------------------------------------------------
	// user:create
	// ----------------------------------------------------------------------
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		required: true,
		description: 'Username of the new user',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		description: 'Email address of the new user',
		displayOptions: {
			show: {
				resource: ['user'],
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
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Clients',
				name: 'clients',
				type: 'string',
				default: '',
				description: 'Create the user on the sites of these clients',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name of the new user',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name of the new user',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password of the new user',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{ name: 'Administrator', value: 'administrator' },
					{ name: 'Author', value: 'author' },
					{ name: 'Contributor', value: 'contributor' },
					{ name: 'Editor', value: 'editor' },
					{ name: 'Subscriber', value: 'subscriber' },
				],
				default: 'subscriber',
				description: 'Role to assign on each target site',
			},
			{
				displayName: 'Send Password',
				name: 'send_password',
				type: 'boolean',
				default: false,
				description: 'Whether to send the password to the new user',
			},
			{
				displayName: 'Site IDs',
				name: 'websites',
				type: 'string',
				default: '',
				description: 'Comma-separated child site IDs to create the user on',
			},
			{
				displayName: 'Tags',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Create the user on sites with these tags',
			},
			{
				displayName: 'User Website',
				name: 'user_url',
				type: 'string',
				default: '',
				description: 'Website URL stored on the user profile',
			},
		],
	},

	// ----------------------------------------------------------------------
	// user:import
	// ----------------------------------------------------------------------
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		hint: 'The name of the input binary field containing the CSV file with one user per row',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['import'],
			},
		},
	},
	{
		displayName: 'Has Header Row',
		name: 'hasHeader',
		type: 'boolean',
		default: true,
		description: 'Whether to skip the first row of the file as a header row',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['import'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// user:updateAdminPassword
	// ----------------------------------------------------------------------
	{
		displayName: 'New Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		description: 'New password for the administrator account MainWP uses on each selected site',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateAdminPassword'],
			},
		},
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'collection',
		placeholder: 'Add scope',
		default: {},
		description:
			'Without a scope, the password is changed on every connected site',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateAdminPassword'],
			},
		},
		options: [
			{
				displayName: 'Clients',
				name: 'clients',
				type: 'string',
				default: '',
				description: 'Limit the change to the sites of these clients',
			},
			{
				displayName: 'Site IDs',
				name: 'websites',
				type: 'string',
				default: '',
				description: 'Comma-separated child site IDs to limit the change to',
			},
			{
				displayName: 'Tags',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Limit the change to sites with these tags',
			},
		],
	},

	// ----------------------------------------------------------------------
	// user:update
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Biographical description of the user',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				description: 'Name shown publicly for the user',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email address of the user',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name of the user',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name of the user',
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: 'Nickname of the user',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'New password for the user',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{ name: 'Administrator', value: 'administrator' },
					{ name: 'Author', value: 'author' },
					{ name: 'Contributor', value: 'contributor' },
					{ name: 'Editor', value: 'editor' },
					{ name: 'Subscriber', value: 'subscriber' },
				],
				default: 'subscriber',
				description: 'Role to assign to the user',
			},
			{
				displayName: 'User Website',
				name: 'user_url',
				type: 'string',
				default: '',
				description: 'Website URL stored on the user profile',
			},
		],
	},
];
