import type { INodeProperties } from 'n8n-workflow';

import { returnAllAndLimit, siteLocator } from './shared';

const SITE_LOCATOR_OPERATIONS = [
	'activatePlugins',
	'activateTheme',
	'check',
	'deactivatePlugins',
	'deletePlugins',
	'deleteThemes',
	'disconnect',
	'get',
	'getAbandonedPlugins',
	'getAbandonedThemes',
	'getClient',
	'getCosts',
	'getNonMainWpChanges',
	'getPlugins',
	'getSecurity',
	'getThemes',
	'reconnect',
	'remove',
	'suspend',
	'sync',
	'unsuspend',
	'update',
];

export const siteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['site'],
			},
		},
		options: [
			{
				name: 'Activate Plugins',
				value: 'activatePlugins',
				action: 'Activate plugins on a site',
				description: 'Activate one or more plugins on a child site',
			},
			{
				name: 'Activate Theme',
				value: 'activateTheme',
				action: 'Activate a theme on a site',
				description: 'Activate a theme on a child site',
			},
			{
				name: 'Add',
				value: 'add',
				action: 'Add a site',
				description: 'Connect a new child site to the Dashboard',
			},
			{
				name: 'Check',
				value: 'check',
				action: 'Check a site',
				description: 'Run a connection check for one site',
			},
			{
				name: 'Check All',
				value: 'checkAll',
				action: 'Check all sites',
				description: 'Run a connection check across sites. Returns one outcome per site.',
			},
			{
				name: 'Count',
				value: 'count',
				action: 'Count sites',
			},
			{
				name: 'Deactivate Plugins',
				value: 'deactivatePlugins',
				action: 'Deactivate plugins on a site',
				description: 'Deactivate one or more plugins on a child site',
			},
			{
				name: 'Delete Plugins',
				value: 'deletePlugins',
				action: 'Delete plugins from a site',
				description:
					'Permanently delete plugins from the live child site. This cannot be undone.',
			},
			{
				name: 'Delete Themes',
				value: 'deleteThemes',
				action: 'Delete themes from a site',
				description: 'Permanently delete themes from the live child site. This cannot be undone.',
			},
			{
				name: 'Disconnect',
				value: 'disconnect',
				action: 'Disconnect a site',
				description:
					'Disconnect one site from the Dashboard. Reconnecting needs valid admin credentials on the child site.',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a site',
			},
			{
				name: 'Get Abandoned Plugins',
				value: 'getAbandonedPlugins',
				action: 'Get abandoned plugins on a site',
				description: 'List plugins on a site that their authors appear to have abandoned',
			},
			{
				name: 'Get Abandoned Themes',
				value: 'getAbandonedThemes',
				action: 'Get abandoned themes on a site',
				description: 'List themes on a site that their authors appear to have abandoned',
			},
			{
				name: 'Get Client',
				value: 'getClient',
				action: 'Get the client of a site',
				description: 'Get the client record linked to a site',
			},
			{
				name: 'Get Costs',
				value: 'getCosts',
				action: 'Get the costs of a site',
				description: 'List cost records linked to a site',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many sites',
				description: 'List the connected child sites with full data',
			},
			{
				name: 'Get Many (Basic)',
				value: 'getAllBasic',
				action: 'Get many sites with basic fields',
				description: 'List the connected child sites with basic fields only — much cheaper',
			},
			{
				name: 'Get Non-MainWP Changes',
				value: 'getNonMainWpChanges',
				action: 'Get changes made outside the dashboard',
				description: 'List changes made on the child site outside of MainWP',
			},
			{
				name: 'Get Plugins',
				value: 'getPlugins',
				action: 'Get plugins of a site',
				description: 'List the plugins installed on a child site',
			},
			{
				name: 'Get Security',
				value: 'getSecurity',
				action: 'Get the security snapshot of a site',
			},
			{
				name: 'Get Themes',
				value: 'getThemes',
				action: 'Get themes of a site',
				description: 'List the themes installed on a child site',
			},
			{
				name: 'Reconnect',
				value: 'reconnect',
				action: 'Reconnect a site',
				description: 'Re-establish the Dashboard connection to one site',
			},
			{
				name: 'Remove',
				value: 'remove',
				action: 'Remove a site',
				description:
					'Remove the site from the Dashboard. The WordPress site itself is not deleted, but all MainWP data for it is. This cannot be undone.',
			},
			{
				name: 'Suspend',
				value: 'suspend',
				action: 'Suspend a site',
				description: 'Suspend Dashboard management of one site',
			},
			{
				name: 'Sync',
				value: 'sync',
				action: 'Sync a site',
				description:
					'Sync data with one child site. May return a queued job instead of an inline result — completion is not confirmed by this call.',
			},
			{
				name: 'Sync All',
				value: 'syncAll',
				action: 'Sync all sites',
				description:
					'Sync data with every matching child site. May return a queued job instead of per-site results — completion is not confirmed by this call.',
			},
			{
				name: 'Unsuspend',
				value: 'unsuspend',
				action: 'Unsuspend a site',
				description: 'Resume Dashboard management of one site',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a site',
				description: 'Update the Dashboard settings of a site',
			},
		],
		default: 'getAll',
	},
];

export const siteFields: INodeProperties[] = [
	siteLocator('site', SITE_LOCATOR_OPERATIONS),

	// ----------------------------------------------------------------------
	// site:getAll / getAllBasic / count — filters
	// ----------------------------------------------------------------------
	...returnAllAndLimit('site', ['getAll', 'getAllBasic']),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['getAll', 'getAllBasic', 'count'],
			},
		},
		options: [
			{
				displayName: 'Exclude IDs',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'Comma-separated list of site IDs to leave out of the result set',
			},
			{
				displayName: 'Include IDs',
				name: 'include',
				type: 'string',
				default: '',
				description: 'Comma-separated list of site IDs to limit the result set to',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only sites matching this string',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'Available Update', value: 'available_update' },
					{ name: 'Connected', value: 'connected' },
					{ name: 'Disconnected', value: 'disconnected' },
					{ name: 'Suspended', value: 'suspended' },
				],
				default: 'any',
				description: 'Return only sites with this connection status',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'string',
				default: '',
				description: 'Comma-separated list of custom fields to include in the response',
			},
			{
				displayName: 'Full Data',
				name: 'full_data',
				type: 'boolean',
				default: true,
				description: 'Whether to return the full data set for every site',
			},
			{
				displayName: 'With Tags',
				name: 'with_tags',
				type: 'boolean',
				default: true,
				description: 'Whether to include the tags of every site',
			},
		],
	},

	// ----------------------------------------------------------------------
	// site:add
	// ----------------------------------------------------------------------
	{
		displayName: 'Site URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'https://example.com',
		description: 'URL of the child site, including the scheme',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['add'],
			},
		},
	},
	{
		displayName: 'Admin Username',
		name: 'admin',
		type: 'string',
		default: '',
		required: true,
		description: 'Administrator username on the child site',
		displayOptions: {
			show: {
				resource: ['site'],
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
				resource: ['site'],
				operation: ['add'],
			},
		},
		options: [
			{
				displayName: 'Admin Password',
				name: 'adminpassword',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Administrator password, required when the child site uses Password Authentication',
			},
			{
				displayName: 'Client ID',
				name: 'client_id',
				type: 'number',
				default: 0,
				description: 'Client to assign the site to',
			},
			{
				displayName: 'Force IPv4',
				name: 'force_use_ipv4',
				type: 'boolean',
				default: false,
				description: 'Whether to force IPv4 for requests to this site',
			},
			{
				displayName: 'HTTP Basic Auth Password',
				name: 'http_pass',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password for HTTP Basic authentication in front of the child site',
			},
			{
				displayName: 'HTTP Basic Auth Username',
				name: 'http_user',
				type: 'string',
				default: '',
				description: 'Username for HTTP Basic authentication in front of the child site',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name to show for the site in the Dashboard',
			},
			{
				displayName: 'Tag IDs',
				name: 'groupids',
				type: 'string',
				default: '',
				description: 'Comma-separated tag IDs to assign the site to',
			},
			{
				displayName: 'Unique Security ID',
				name: 'uniqueid',
				type: 'string',
				default: '',
				description: 'Unique Security ID, required when the child site has one set',
			},
			{
				displayName: 'Verify SSL Certificate',
				name: 'ssl_verify',
				type: 'boolean',
				default: true,
				description: 'Whether to verify the SSL certificate of the child site',
			},
		],
	},

	// ----------------------------------------------------------------------
	// site:update
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Admin Username',
				name: 'adminname',
				type: 'string',
				default: '',
				description: 'Administrator username on the child site',
			},
			{
				displayName: 'Automatic Updates',
				name: 'automatic_update',
				type: 'options',
				options: [
					{ name: 'Disabled', value: 0 },
					{ name: 'Enabled', value: 1 },
				],
				default: 0,
				description: 'Whether to include the site in automatic updates',
			},
			{
				displayName: 'Backup Before Upgrade',
				name: 'backup_before_upgrade',
				type: 'options',
				options: [
					{ name: 'Disabled', value: 0 },
					{ name: 'Enabled', value: 1 },
				],
				default: 0,
				description: 'Whether to run a backup before updates',
			},
			{
				displayName: 'Client ID',
				name: 'client_id',
				type: 'number',
				default: 0,
				description: 'Client the site belongs to',
			},
			{
				displayName: 'Disable Health Checking',
				name: 'disablehealthchecking',
				type: 'options',
				options: [
					{ name: 'Health Checks Run', value: 0 },
					{ name: 'Health Checks Disabled', value: 1 },
				],
				default: 0,
				description: 'Whether to stop running site health checks',
			},
			{
				displayName: 'Force IPv4',
				name: 'force_use_ipv4',
				type: 'boolean',
				default: false,
				description: 'Whether to force IPv4 for requests to this site',
			},
			{
				displayName: 'Health Threshold',
				name: 'healththreshold',
				type: 'number',
				default: 80,
				description: 'Health score below which the site counts as unhealthy',
			},
			{
				displayName: 'HTTP Basic Auth Password',
				name: 'http_pass',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password for HTTP Basic authentication in front of the child site',
			},
			{
				displayName: 'HTTP Basic Auth Username',
				name: 'http_user',
				type: 'string',
				default: '',
				description: 'Username for HTTP Basic authentication in front of the child site',
			},
			{
				displayName: 'Ignore Core Updates',
				name: 'ignore_core_updates',
				type: 'options',
				options: [
					{ name: 'Show', value: 0 },
					{ name: 'Ignore', value: 1 },
				],
				default: 0,
				description: 'Whether to hide pending core updates for this site',
			},
			{
				displayName: 'Ignore Plugin Updates',
				name: 'ignore_plugin_updates',
				type: 'options',
				options: [
					{ name: 'Show', value: 0 },
					{ name: 'Ignore', value: 1 },
				],
				default: 0,
				description: 'Whether to hide pending plugin updates for this site',
			},
			{
				displayName: 'Ignore Theme Updates',
				name: 'ignore_theme_updates',
				type: 'options',
				options: [
					{ name: 'Show', value: 0 },
					{ name: 'Ignore', value: 1 },
				],
				default: 0,
				description: 'Whether to hide pending theme updates for this site',
			},
			{
				displayName: 'Monitoring Emails',
				name: 'monitoring_emails',
				type: 'string',
				default: '',
				description: 'Comma-separated addresses that receive monitoring notices for this site',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name to show for the site in the Dashboard',
			},
			{
				displayName: 'Protocol',
				name: 'protocol',
				type: 'string',
				default: '',
				description: 'Scheme used to reach the site',
			},
			{
				displayName: 'SSL Version',
				name: 'sslversion',
				type: 'string',
				default: '',
				description: 'SSL version to force for requests to this site',
			},
			{
				displayName: 'Suspended',
				name: 'suspended',
				type: 'options',
				options: [
					{ name: 'Active', value: 0 },
					{ name: 'Suspended', value: 1 },
				],
				default: 0,
				description: 'Whether the site is suspended',
			},
			{
				displayName: 'Tag IDs',
				name: 'groupids',
				type: 'string',
				default: '',
				description: 'Comma-separated tag IDs the site belongs to',
			},
			{
				displayName: 'Unique Security ID',
				name: 'uniqueid',
				type: 'string',
				default: '',
				description: 'Unique Security ID configured on the child site',
			},
		],
	},

	// ----------------------------------------------------------------------
	// site:checkAll / syncAll — fleet scoping
	// ----------------------------------------------------------------------
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'collection',
		placeholder: 'Add scope',
		default: {},
		description: 'Without a scope, the action runs against every connected site',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['checkAll', 'syncAll'],
			},
		},
		options: [
			{
				displayName: 'Exclude IDs',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'Comma-separated list of site IDs to leave out',
			},
			{
				displayName: 'Include IDs',
				name: 'include',
				type: 'string',
				default: '',
				description: 'Comma-separated list of site IDs to limit the action to',
			},
		],
	},

	// ----------------------------------------------------------------------
	// site:getPlugins / getThemes
	// ----------------------------------------------------------------------
	...returnAllAndLimit('site', ['getPlugins', 'getThemes', 'getNonMainWpChanges']),
	{
		displayName: 'Filters',
		name: 'pluginThemeFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['getPlugins', 'getThemes'],
			},
		},
		options: [
			{
				displayName: 'Must-Use Only',
				name: 'must_use',
				type: 'options',
				options: [
					{ name: 'All Plugins', value: 0 },
					{ name: 'Must-Use Plugins Only', value: 1 },
				],
				default: 0,
				description: 'Whether to list only must-use plugins (Get Plugins only)',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only records matching this string',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Any', value: 'any' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'any',
				description: 'Return only records with this status',
			},
		],
	},

	// ----------------------------------------------------------------------
	// site:activatePlugins / deactivatePlugins / deletePlugins
	// ----------------------------------------------------------------------
	{
		displayName: 'Plugin Paths',
		name: 'pluginSlug',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'akismet/akismet.php, hello-dolly/hello.php',
		description:
			'Plugin file paths to act on, comma-separated for several (as returned by Get Plugins)',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['activatePlugins', 'deactivatePlugins', 'deletePlugins'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// site:activateTheme / deleteThemes
	// ----------------------------------------------------------------------
	{
		displayName: 'Theme Slug',
		name: 'themeSlug',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'twentytwentyfive',
		description: 'Theme slug to activate',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['activateTheme'],
			},
		},
	},
	{
		displayName: 'Theme Slugs',
		name: 'themeSlugs',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'twentytwentythree, twentytwentyfour',
		description: 'Theme slugs to delete, comma-separated for several',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['deleteThemes'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// site:getNonMainWpChanges — filters
	// ----------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'changeFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['getNonMainWpChanges'],
			},
		},
		options: [
			{
				displayName: 'Actions',
				name: 'actions',
				type: 'string',
				default: '',
				description: 'Comma-separated list of actions to limit the result set to',
			},
			{
				displayName: 'Contexts',
				name: 'contexts',
				type: 'string',
				default: '',
				description: 'Comma-separated list of contexts to limit the result set to',
			},
			{
				displayName: 'Source',
				name: 'source',
				type: 'string',
				default: '',
				description: 'Source of the changes to limit the result set to',
			},
		],
	},
];
