import type { INodeProperties } from 'n8n-workflow';

export const settingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['settings'],
			},
		},
		options: [
			{
				name: 'Destroy Sessions',
				value: 'destroySessions',
				action: 'Destroy sessions on all sites',
				description:
					'Start a background job that destroys active user sessions on every connected child site. This affects live production sites and cannot be undone. Returns a job ID for the Get Destroy Sessions Status operation.',
			},
			{
				name: 'Disconnect All Sites',
				value: 'disconnectAllSites',
				action: 'Disconnect all sites from the dashboard',
				description:
					'Start a background job that disconnects every connected child site from the Dashboard. Every site must be reconnected manually afterward — this cannot be undone. Returns a job ID for the Get Disconnect All Sites Status operation.',
			},
			{
				name: 'Get Advanced',
				value: 'getAdvanced',
				action: 'Get the advanced settings',
				description: 'Get the values on the Advanced settings screen',
			},
			{
				name: 'Get Cost Tracker',
				value: 'getCostTracker',
				action: 'Get the cost tracker settings',
				description: 'Get the Cost Tracker settings',
			},
			{
				name: 'Get Destroy Sessions Status',
				value: 'getDestroySessionsStatus',
				action: 'Get the status of a destroy sessions job',
				description:
					'Poll the progress of a destroy sessions job, using the job ID returned by the Destroy Sessions operation',
			},
			{
				name: 'Get Disconnect All Sites Status',
				value: 'getDisconnectAllSitesStatus',
				action: 'Get the status of a disconnect all sites job',
				description:
					'Poll the progress of a disconnect all sites job, using the job ID returned by the Disconnect All Sites operation',
			},
			{
				name: 'Get Emails',
				value: 'getEmails',
				action: 'Get the email notification settings',
				description: 'Get the email notification settings, keyed by email type',
			},
			{
				name: 'Get General',
				value: 'getGeneral',
				action: 'Get the general settings',
				description: 'Get the values on the General settings screen',
			},
			{
				name: 'Get Monitoring',
				value: 'getMonitoring',
				action: 'Get the monitoring settings',
				description: 'Get the site health and uptime monitoring settings',
			},
			{
				name: 'Get Renew Connections Status',
				value: 'getRenewConnectionsStatus',
				action: 'Get the status of a renew connections job',
				description:
					'Poll the progress of a renew connections job, using the job ID returned by the Renew Connections operation',
			},
			{
				name: 'Get Tools',
				value: 'getTools',
				action: 'Get the tools settings',
				description: 'Get the values on the Tools settings screen',
			},
			{
				name: 'Renew Connections',
				value: 'renewConnections',
				action: 'Renew the connections of all sites',
				description:
					'Start a background job that renews the connection keys of every connected child site. Returns a job ID for the Get Renew Connections Status operation.',
			},
			{
				name: 'Update Advanced',
				value: 'updateAdvanced',
				action: 'Update the advanced settings',
				description: 'Update values on the Advanced settings screen',
			},
			{
				name: 'Update Cost Tracker',
				value: 'updateCostTracker',
				action: 'Update the cost tracker settings',
				description: 'Update the Cost Tracker settings',
			},
			{
				name: 'Update Email',
				value: 'updateEmail',
				action: 'Update an email notification',
				description: 'Update the settings of one email notification type',
			},
			{
				name: 'Update General',
				value: 'updateGeneral',
				action: 'Update the general settings',
				description: 'Update values on the General settings screen',
			},
			{
				name: 'Update Monitoring',
				value: 'updateMonitoring',
				action: 'Update the monitoring settings',
				description: 'Update the site health and uptime monitoring settings',
			},
			{
				name: 'Update Tools',
				value: 'updateTools',
				action: 'Update the tools settings',
				description: 'Update values on the Tools settings screen',
			},
		],
		default: 'getGeneral',
	},
];

export const settingsFields: INodeProperties[] = [
	// ----------------------------------------------------------------------
	// settings:updateGeneral
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateGeneral'],
			},
		},
		options: [
			{
				displayName: 'Archive Format',
				name: 'mainwp_archive_format',
				type: 'options',
				options: [
					{ name: 'TAR', value: 'tar' },
					{ name: 'TAR.BZ2', value: 'tar.bz2' },
					{ name: 'TAR.GZ', value: 'tar.gz' },
					{ name: 'ZIP', value: 'zip' },
				],
				default: 'zip',
				description: 'Archive format for legacy backups',
			},
			{
				displayName: 'Automatic Daily Update List',
				name: 'automatic_daily_update',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of plugin automatic daily update values, sent as an array',
			},
			{
				displayName: 'Backup Before Upgrade',
				name: 'backup_before_upgrade',
				type: 'boolean',
				default: false,
				description: 'Whether to require a backup before upgrades',
			},
			{
				displayName: 'Backup Before Upgrade Days',
				name: 'backup_before_upgrade_days',
				type: 'number',
				default: 7,
				description: 'Days to check for an existing backup before an upgrade',
			},
			{
				displayName: 'Backup on External Sources',
				name: 'mainwp_backup_on_external_sources',
				type: 'string',
				default: '',
				description: 'Backups to keep on external sources',
			},
			{
				displayName: 'Backups on Server',
				name: 'mainwp_backups_on_server',
				type: 'string',
				default: '',
				description: 'Backups to keep on the server',
			},
			{
				displayName: 'Check HTTP Response',
				name: 'check_http_response',
				type: 'boolean',
				default: false,
				description: 'Whether to check the HTTP response of a site after an update',
			},
			{
				displayName: 'Check HTTP Response Method',
				name: 'check_http_response_method',
				type: 'options',
				options: [
					{ name: 'GET', value: 'get' },
					{ name: 'HEAD', value: 'head' },
				],
				default: 'head',
				description: 'HTTP method used for the response check',
			},
			{
				displayName: 'Chunked Backup Tasks',
				name: 'mainwp_chunked_backup_tasks',
				type: 'boolean',
				default: false,
				description: 'Whether to run legacy backup tasks in chunks',
			},
			{
				displayName: 'Date Format',
				name: 'date_format',
				type: 'string',
				default: '',
				description: 'Date format used across the Dashboard',
			},
			{
				displayName: 'Day in Month for Auto Updates',
				name: 'dayinmonth_auto_update',
				type: 'number',
				default: 1,
				description: 'Day of the month automatic updates run on',
			},
			{
				displayName: 'Day in Week for Auto Updates',
				name: 'dayinweek_auto_update',
				type: 'number',
				default: 1,
				description: 'Day of the week automatic updates run on',
			},
			{
				displayName: 'Delay Automatic Updates',
				name: 'delay_autoupdate',
				type: 'options',
				options: [
					{ name: '1 Day', value: 1 },
					{ name: '14 Days', value: 14 },
					{ name: '2 Days', value: 2 },
					{ name: '3 Days', value: 3 },
					{ name: '30 Days', value: 30 },
					{ name: '4 Days', value: 4 },
					{ name: '5 Days', value: 5 },
					{ name: '6 Days', value: 6 },
					{ name: '7 Days', value: 7 },
					{ name: 'No Delay', value: 0 },
				],
				default: 0,
				description: 'How many days to delay automatic updates after a release',
			},
			{
				displayName: 'Disable Update Confirmations',
				name: 'disable_update_confirmations',
				type: 'options',
				options: [
					{ name: 'Confirmations Disabled', value: 1 },
					{ name: 'Confirmations Enabled', value: 0 },
					{ name: 'Disabled for Single Updates Only', value: 2 },
				],
				default: 0,
				description: 'Update confirmation behavior in the Dashboard',
			},
			{
				displayName: 'Enable Legacy Backup Feature',
				name: 'mainwp_enable_legacy_backup_feature',
				type: 'boolean',
				default: false,
				description: 'Whether to enable the legacy backup feature',
			},
			{
				displayName: 'Frequency of Auto Updates',
				name: 'frequency_auto_update',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'daily' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Weekly', value: 'weekly' },
				],
				default: 'daily',
				description: 'How often automatic updates run',
			},
			{
				displayName: 'Frequency of Daily Updates',
				name: 'frequency_daily_update',
				type: 'number',
				default: 1,
				description: 'How many times per day daily updates run (1-12)',
			},
			{
				displayName: 'Hide Update Everything Button',
				name: 'hide_update_everything',
				type: 'boolean',
				default: false,
				description: 'Whether to hide the Update Everything button',
			},
			{
				displayName: 'Notification on Backup Fail',
				name: 'mainwp_notification_on_backup_fail',
				type: 'boolean',
				default: false,
				description: 'Whether to send a notification when a backup fails',
			},
			{
				displayName: 'Notification on Backup Start',
				name: 'mainwp_notification_on_backup_start',
				type: 'boolean',
				default: false,
				description: 'Whether to send a notification when a backup starts',
			},
			{
				displayName: 'Outdated Plugin/Theme Days',
				name: 'numberdays_outdate_plugin_theme',
				type: 'number',
				default: 365,
				description: 'Number of days after which a plugin or theme counts as abandoned',
			},
			{
				displayName: 'Plugin Automatic Daily Update',
				name: 'plugin_automatic_daily_update',
				type: 'boolean',
				default: false,
				description: 'Whether to update plugins automatically every day',
			},
			{
				displayName: 'Primary Backup Method',
				name: 'mainwp_primary_backup',
				type: 'options',
				options: [
					{ name: 'API Backups', value: 'module-api-backups' },
					{ name: 'None', value: '' },
				],
				default: '',
				description: 'Primary backup system used by the Dashboard',
			},
			{
				displayName: 'Show Language Updates',
				name: 'show_language_updates',
				type: 'boolean',
				default: false,
				description: 'Whether to show translation updates',
			},
			{
				displayName: 'Sidebar Position',
				name: 'sidebar_position',
				type: 'boolean',
				default: false,
				description: 'Whether to show the Dashboard sidebar in the alternate position',
			},
			{
				displayName: 'Theme Automatic Daily Update',
				name: 'theme_automatic_daily_update',
				type: 'boolean',
				default: false,
				description: 'Whether to update themes automatically every day',
			},
			{
				displayName: 'Time for Auto Updates',
				name: 'time_auto_update',
				type: 'string',
				default: '',
				description: 'Time automatic updates run at, as a whole hour in 24h format',
			},
			{
				displayName: 'Time for Daily Updates',
				name: 'time_daily_update',
				type: 'string',
				default: '',
				description: 'Time daily updates run at, in HH:MM format',
			},
			{
				displayName: 'Time Format',
				name: 'time_format',
				type: 'string',
				default: '',
				description: 'Time format used across the Dashboard',
			},
			{
				displayName: 'Timezone',
				name: 'timezone_string',
				type: 'string',
				default: '',
				description: 'Timezone used by the Dashboard',
			},
			{
				displayName: 'Translation Automatic Daily Update List',
				name: 'trans_automatic_daily_update',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of translation automatic daily update values, sent as an array',
			},
			{
				displayName: 'Widgets',
				name: 'mainwp_widgets',
				type: 'json',
				default: '{}',
				description:
					'Dashboard widget visibility as a JSON object keyed by widget name — send 1 to show a widget and 0 to hide it. The accepted keys match the widgets returned by the Get General operation; unknown keys are rejected.',
			},
		],
	},

	// ----------------------------------------------------------------------
	// settings:updateAdvanced
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateAdvanced'],
			},
		},
		options: [
			{
				displayName: 'Chunk Sites Number',
				name: 'mainwp_chunksitesnumber',
				type: 'number',
				default: 10,
				description: 'Number of sites to process per chunk',
			},
			{
				displayName: 'Chunk Sleep Interval',
				name: 'mainwp_chunksleepinterval',
				type: 'number',
				default: 0,
				description: 'Sleep interval between chunks',
			},
			{
				displayName: 'Connection Signature Algorithm',
				name: 'mainwp_connect_signature_algo',
				type: 'number',
				default: 0,
				description: 'OpenSSL signature algorithm used when connecting to child sites',
			},
			{
				displayName: 'Force IPv4',
				name: 'mainwp_force_use_ipv4',
				type: 'boolean',
				default: false,
				description: 'Whether to force IPv4 for requests to child sites',
			},
			{
				displayName: 'Maximum Install/Update Requests',
				name: 'mainwp_maximum_install_update_requests',
				type: 'number',
				default: 1,
				description: 'Maximum simultaneous install and update requests',
			},
			{
				displayName: 'Maximum IP Requests',
				name: 'mainwp_maximum_ip_requests',
				type: 'number',
				default: 1,
				description: 'Maximum simultaneous requests per IP',
			},
			{
				displayName: 'Maximum Requests',
				name: 'mainwp_maximum_requests',
				type: 'number',
				default: 4,
				description: 'Maximum simultaneous requests',
			},
			{
				displayName: 'Maximum Sync Requests',
				name: 'mainwp_maximum_sync_requests',
				type: 'number',
				default: 8,
				description: 'Maximum simultaneous sync requests',
			},
			{
				displayName: 'Maximum Uptime Monitoring Requests',
				name: 'mainwp_maximum_uptime_monitoring_requests',
				type: 'number',
				default: 10,
				description: 'Maximum simultaneous uptime monitoring requests',
			},
			{
				displayName: 'Minimum Delay',
				name: 'mainwp_minimum_delay',
				type: 'number',
				default: 200,
				description: 'Minimum delay between requests, in milliseconds',
			},
			{
				displayName: 'Minimum IP Delay',
				name: 'mainwp_minimum_ip_delay',
				type: 'number',
				default: 1000,
				description: 'Minimum delay between requests to the same IP, in milliseconds',
			},
			{
				displayName: 'Optimize Data Loading',
				name: 'mainwp_optimize',
				type: 'boolean',
				default: false,
				description: 'Whether to optimize data loading',
			},
			{
				displayName: 'Sync Data',
				name: 'sync_data',
				type: 'json',
				default: '{}',
				description:
					'Sync data toggles as a JSON object, keyed by the setting names already stored on the Dashboard — send 1 to enable a key and 0 to disable it. The accepted keys match the values returned by the Get Advanced operation; unknown keys are rejected.',
			},
			{
				displayName: 'Use WP Cron',
				name: 'mainwp_wp_cron',
				type: 'boolean',
				default: false,
				description: 'Whether to use WP Cron for scheduled tasks',
			},
			{
				displayName: 'Verify Connection Method',
				name: 'mainwp_verify_connection_method',
				type: 'options',
				options: [
					{ name: 'Method 1', value: 1 },
					{ name: 'Method 2', value: 2 },
				],
				default: 1,
				description: 'Method used to verify the connection to child sites',
			},
			{
				displayName: 'Verify SSL Certificate',
				name: 'mainwp_ssl_verify_certificate',
				type: 'boolean',
				default: true,
				description: 'Whether to verify the SSL certificates of child sites',
			},
		],
	},

	// ----------------------------------------------------------------------
	// settings:updateTools
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateTools'],
			},
		},
		options: [
			{
				displayName: 'Enable Chatbase',
				name: 'chatbase',
				type: 'boolean',
				default: false,
				description: 'Whether to enable Chatbase',
			},
			{
				displayName: 'Enable Guided Tours',
				name: 'guided_tours',
				type: 'boolean',
				default: false,
				description: 'Whether to enable guided tours',
			},
			{
				displayName: 'Enable YouTube Embeds',
				name: 'guided_video',
				type: 'boolean',
				default: false,
				description: 'Whether to enable YouTube video embeds',
			},
			{
				displayName: 'Theme',
				name: 'mainwp_theme',
				type: 'options',
				options: [
					{ name: 'Classic', value: 'classic' },
					{ name: 'Dark', value: 'dark' },
					{ name: 'Default', value: 'default' },
					{ name: 'Default 2024', value: 'default-2024' },
					{ name: 'Minimalistic', value: 'minimalistic' },
					{ name: 'WP Admin', value: 'wpadmin' },
				],
				default: 'default',
				description: 'Color theme of the Dashboard',
			},
		],
	},

	// ----------------------------------------------------------------------
	// settings:updateEmail
	// ----------------------------------------------------------------------
	{
		 
		displayName: 'Email Type Name or ID',
		name: 'mailType',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getEmailTypes',
		},
		default: '',
		required: true,
		description: 'Choose from the list, or specify an ID using an expression. <a href="https://docs.n8n.io/code/expressions/">More info</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateEmail'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateEmail'],
			},
		},
		options: [
			{
				displayName: 'Disable',
				name: 'disable',
				type: 'boolean',
				default: false,
				description: 'Whether to disable this email notification',
			},
			{
				displayName: 'Heading',
				name: 'heading',
				type: 'string',
				default: '',
				description: 'Heading shown in the email notification',
			},
			{
				displayName: 'Recipients',
				name: 'recipients',
				type: 'string',
				default: '',
				description: 'Recipients of the email notification',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Subject of the email notification',
			},
		],
	},

	// ----------------------------------------------------------------------
	// settings:updateMonitoring
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateMonitoring'],
			},
		},
		options: [
			{
				displayName: 'Disable Sites Health Monitoring',
				name: 'mainwp_disable_sites_health_monitoring',
				type: 'boolean',
				default: false,
				description: 'Whether to disable site health monitoring',
			},
			{
				displayName: 'Site Health Threshold',
				name: 'mainwp_sitehealth_threshold',
				type: 'options',
				options: [
					{ name: 'Good (80)', value: 80 },
					{ name: 'Should Be Improved (100)', value: 100 },
				],
				default: 80,
				description: 'Site health score threshold',
			},
			{
				displayName: 'Uptime Monitoring Active',
				name: 'mainwp_uptime_monitoring_active',
				type: 'boolean',
				default: false,
				description: 'Whether to enable uptime monitoring globally',
			},
			{
				displayName: 'Uptime Monitoring Down Confirmation Check',
				name: 'mainwp_uptime_monitoring_down_confirmation_check',
				type: 'options',
				options: [
					{ name: 'Disabled', value: 0 },
					{ name: 'Enabled', value: 1 },
				],
				default: 0,
				description: 'Whether a site reported down is re-checked before it counts as down',
			},
			{
				displayName: 'Uptime Monitoring Interval',
				name: 'mainwp_uptime_monitoring_interval',
				type: 'number',
				default: 60,
				description: 'Uptime monitoring check interval',
			},
			{
				displayName: 'Uptime Monitoring Keyword',
				name: 'mainwp_uptime_monitoring_keyword',
				type: 'string',
				default: '',
				description: 'Keyword to look for when the monitoring type is Keyword',
			},
			{
				displayName: 'Uptime Monitoring Timeout',
				name: 'mainwp_uptime_monitoring_timeout',
				type: 'number',
				default: 30,
				description: 'Uptime monitoring request timeout',
			},
			{
				displayName: 'Uptime Monitoring Type',
				name: 'mainwp_uptime_monitoring_type',
				type: 'options',
				options: [
					{ name: 'HTTP', value: 'http' },
					{ name: 'Keyword', value: 'keyword' },
					{ name: 'Ping', value: 'ping' },
				],
				default: 'http',
				description: 'Type of uptime monitoring check',
			},
			{
				displayName: 'Uptime Monitoring Up Status Codes',
				name: 'mainwp_uptime_monitoring_up_status_codes',
				type: 'string',
				default: '',
				placeholder: '200, 301, 302',
				description:
					'Comma-separated list of HTTP status codes that count as up, sent as an array of integers',
			},
		],
	},

	// ----------------------------------------------------------------------
	// settings:updateCostTracker
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateCostTracker'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Currency used by the Cost Tracker',
			},
			{
				displayName: 'Currency Position',
				name: 'currency_position',
				type: 'options',
				options: [
					{ name: 'Left', value: 'left' },
					{ name: 'Left With Space', value: 'left_space' },
					{ name: 'Right', value: 'right' },
					{ name: 'Right With Space', value: 'right_space' },
				],
				default: 'left',
				description: 'Position of the currency symbol',
			},
			{
				displayName: 'Decimal Separator',
				name: 'decimal_separator',
				type: 'string',
				default: '',
				description: 'Character used as the decimal separator',
			},
			{
				displayName: 'Thousand Separator',
				name: 'thousand_separator',
				type: 'string',
				default: '',
				description: 'Character used as the thousands separator',
			},
		],
	},

	// ----------------------------------------------------------------------
	// settings:getDestroySessionsStatus / getDisconnectAllSitesStatus /
	// getRenewConnectionsStatus
	// ----------------------------------------------------------------------
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the background job, as returned by the operation that started it',
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: [
					'getDestroySessionsStatus',
					'getDisconnectAllSitesStatus',
					'getRenewConnectionsStatus',
				],
			},
		},
	},
];
