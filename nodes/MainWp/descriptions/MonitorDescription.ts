import type { INodeProperties } from 'n8n-workflow';

import { returnAllAndLimit, siteLocator } from './shared';

const MONITOR_LOCATOR_OPERATIONS = [
	'check',
	'countIncidents',
	'get',
	'getBasic',
	'getHeartbeat',
	'getIncidents',
	'updateSettings',
];

const MONITOR_STATUS_OPTIONS = [
	{ name: 'Down', value: 'down' },
	{ name: 'First', value: 'first' },
	{ name: 'Paused', value: 'paused' },
	{ name: 'Pending', value: 'pending' },
	{ name: 'Up', value: 'up' },
];

const MONITOR_METHOD_OPTIONS = [
	{ name: 'DELETE', value: 'delete' },
	{ name: 'GET', value: 'get' },
	{ name: 'HEAD', value: 'head' },
	{ name: 'PATCH', value: 'patch' },
	{ name: 'POST', value: 'post' },
	{ name: 'PUSH', value: 'push' },
	{ name: 'Use Global', value: 'useglobal' },
];

const MONITOR_TYPE_OPTIONS = [
	{ name: 'HTTP', value: 'http' },
	{ name: 'Keyword', value: 'keyword' },
	{ name: 'Ping', value: 'ping' },
	{ name: 'Use Global', value: 'useglobal' },
];

export const monitorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['monitor'],
			},
		},
		options: [
			{
				name: 'Check',
				value: 'check',
				action: 'Run a monitor check now',
				description:
					'Check the monitored URL straight away and return the status code and resulting up or down state',
			},
			{
				name: 'Count',
				value: 'count',
				action: 'Count monitors',
				description: 'Return how many monitors match the filters',
			},
			{
				name: 'Count Incidents',
				value: 'countIncidents',
				action: 'Count incidents of a monitor',
				description: 'Return the number of down checks across the incidents of one monitor',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a monitor',
				description: 'Get one monitor with its heartbeat statistics block',
			},
			{
				name: 'Get (Basic)',
				value: 'getBasic',
				action: 'Get basic details of a monitor',
				description: 'Get the ID, URL, and current status of one monitor',
			},
			{
				name: 'Get Heartbeat',
				value: 'getHeartbeat',
				action: 'Get the heartbeat history of a monitor',
				description: 'List the individual checks recorded for one monitor over the selected period',
			},
			{
				name: 'Get Incidents',
				value: 'getIncidents',
				action: 'Get incidents of a monitor',
				description: 'List the downtime incidents recorded for one monitor',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many monitors',
				description:
					'List uptime monitors with their uptime ratios, response times, and last check result',
			},
			{
				name: 'Get Many (Basic)',
				value: 'getAllBasic',
				action: 'Get many monitors with basic fields',
				description: 'List uptime monitors with only their ID, URL, and last status',
			},
			{
				name: 'Update Global Settings',
				value: 'updateGlobalSettings',
				action: 'Update global monitor settings',
				description: 'Update the uptime monitoring defaults that individual monitors fall back to',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				action: 'Update the settings of a monitor',
				description:
					'Update the monitoring settings for one site. Set a field to "useglobal" to fall back to the global defaults.',
			},
		],
		default: 'getAll',
	},
];

export const monitorFields: INodeProperties[] = [
	siteLocator('monitor', MONITOR_LOCATOR_OPERATIONS),

	// ----------------------------------------------------------------------
	// monitor:getAll / getAllBasic / count — filters
	// ----------------------------------------------------------------------
	...returnAllAndLimit('monitor', ['getAll', 'getAllBasic']),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['monitor'],
				operation: ['getAll', 'getAllBasic', 'count'],
			},
		},
		options: [
			{
				displayName: 'Exclude IDs',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'Comma-separated list of monitor IDs to leave out of the result set',
			},
			{
				displayName: 'Include IDs',
				name: 'include',
				type: 'string',
				default: '',
				description: 'Comma-separated list of monitor IDs to limit the result set to',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only monitors matching this string',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: MONITOR_STATUS_OPTIONS,
				default: 'up',
				description: 'Return only monitors with this status',
			},
		],
	},

	// ----------------------------------------------------------------------
	// monitor:getHeartbeat — pagination + filters
	// ----------------------------------------------------------------------
	...returnAllAndLimit('monitor', ['getHeartbeat']),
	{
		displayName: 'Filters',
		name: 'heartbeatFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['monitor'],
				operation: ['getHeartbeat'],
			},
		},
		options: [
			{
				displayName: 'Period',
				name: 'period',
				type: 'string',
				default: '30d',
				description:
					'Window to return checks for. Either "24h", "7d", "30d", or an ISO 8601 range written as "start/end", for example "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z".',
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'string',
				default: '',
				placeholder: '2024-01-01T00:00:00Z',
				description: 'ISO 8601 datetime — only return newer entries',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: MONITOR_STATUS_OPTIONS,
				default: 'up',
				description: 'Return only checks with this status',
			},
		],
	},

	// ----------------------------------------------------------------------
	// monitor:getIncidents — pagination
	// ----------------------------------------------------------------------
	...returnAllAndLimit('monitor', ['getIncidents']),

	// ----------------------------------------------------------------------
	// monitor:updateSettings — per-monitor body
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['monitor'],
				operation: ['updateSettings'],
			},
		},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'options',
				options: [
					{ name: 'Disabled', value: '0' },
					{ name: 'Enabled', value: '1' },
					{ name: 'Use Global', value: 'useglobal' },
				],
				default: 'useglobal',
				description:
					'Enable or disable monitoring for this site. Set "Use Global" to follow the global default.',
			},
			{
				displayName: 'Expected Status',
				name: 'expected_status',
				type: 'string',
				default: '',
				placeholder: '200,301',
				description:
					'Expected HTTP status codes, as a comma-separated list such as "200,301". Set "useglobal" to follow the global default.',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'string',
				default: '',
				placeholder: '5m',
				description: 'Check frequency (e.g. "5m", "1h")',
			},
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				default: '',
				description: 'Keyword to match',
			},
			{
				displayName: 'Max Retries',
				name: 'maxretries',
				type: 'number',
				default: 0,
				description: 'Number of retries on failure',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: MONITOR_METHOD_OPTIONS,
				default: 'useglobal',
				description: 'Monitor method',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'string',
				default: '',
				description: 'Request timeout in milliseconds',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: MONITOR_TYPE_OPTIONS,
				default: 'useglobal',
				description: 'Monitor type',
			},
		],
	},

	// ----------------------------------------------------------------------
	// monitor:updateGlobalSettings — global body
	// ----------------------------------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'globalUpdateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['monitor'],
				operation: ['updateGlobalSettings'],
			},
		},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether uptime monitoring is enabled globally',
			},
			{
				displayName: 'Expected Status',
				name: 'expected_status',
				type: 'string',
				default: '',
				placeholder: '200,301',
				description: 'Expected HTTP status codes, as a comma-separated list such as "200,301"',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'string',
				default: '',
				placeholder: '5m',
				description: 'Default check frequency (e.g. "5m", "1h")',
			},
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				default: '',
				description: 'Keyword to match',
			},
			{
				displayName: 'Max Retries',
				name: 'maxretries',
				type: 'number',
				default: 0,
				description: 'Number of retries on failure',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: MONITOR_METHOD_OPTIONS,
				default: 'useglobal',
				description: 'Monitor method',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'string',
				default: '',
				description: 'Request timeout in milliseconds',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: MONITOR_TYPE_OPTIONS,
				default: 'useglobal',
				description: 'Monitor type',
			},
		],
	},
];
