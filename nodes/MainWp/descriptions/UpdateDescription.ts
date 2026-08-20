import type { INodeProperties } from 'n8n-workflow';

import { siteLocator } from './shared';

const SITE_LOCATOR_OPERATIONS = [
	'getForSite',
	'getIgnoredForSite',
	'ignoreCore',
	'ignorePlugins',
	'ignoreThemes',
	'runForSite',
	'updateCore',
	'updatePlugins',
	'updateThemes',
	'updateTranslations',
];

export const updateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['update'],
			},
		},
		options: [
			{
				name: 'Get for Site',
				value: 'getForSite',
				action: 'Get updates for a site',
				description: 'List the pending updates for one site',
			},
			{
				name: 'Get Ignored',
				value: 'getIgnored',
				action: 'Get ignored updates',
				description: 'List the plugin and theme updates ignored across the whole Dashboard',
			},
			{
				name: 'Get Ignored for Site',
				value: 'getIgnoredForSite',
				action: 'Get ignored updates for a site',
				description:
					'List the updates ignored for one site, including the entries ignored Dashboard-wide',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many updates',
				description:
					'List the pending core, plugin, theme, and translation updates for every site, keyed by site ID',
			},
			{
				name: 'Ignore Core',
				value: 'ignoreCore',
				action: 'Ignore the core update on a site',
				description:
					'Hide the pending WordPress core update for one site until a newer version ships',
			},
			{
				name: 'Ignore Plugins',
				value: 'ignorePlugins',
				action: 'Ignore plugin updates on a site',
				description:
					'Hide plugin updates for one site. Leave the plugin paths empty to ignore every plugin update on the site.',
			},
			{
				name: 'Ignore Themes',
				value: 'ignoreThemes',
				action: 'Ignore theme updates on a site',
				description:
					'Hide theme updates for one site. Leave the theme slugs empty to ignore every theme update on the site.',
			},
			{
				name: 'Run All',
				value: 'runAll',
				action: 'Run updates on all sites',
				description:
					'Start the pending updates across every site. This updates live production sites immediately. May return a queued job instead of an inline result — completion is not confirmed by this call, and the job cannot be polled with the MainWP API key.',
			},
			{
				name: 'Run for Site',
				value: 'runForSite',
				action: 'Run updates on a site',
				description:
					'Start the pending updates on one site. This updates the live production site immediately. May return a queued job instead of an inline result — completion is not confirmed by this call, and the job cannot be polled with the MainWP API key.',
			},
			{
				name: 'Update Core',
				value: 'updateCore',
				action: 'Update core on a site',
				description:
					'Run the pending WordPress core update on one site. This updates the live production site immediately.',
			},
			{
				name: 'Update Plugins',
				value: 'updatePlugins',
				action: 'Update plugins on a site',
				description:
					'Update plugins on one site. This updates the live production site immediately. Leave the plugin paths empty to update every plugin with an update pending.',
			},
			{
				name: 'Update Themes',
				value: 'updateThemes',
				action: 'Update themes on a site',
				description:
					'Update themes on one site. This updates the live production site immediately. Leave the theme slugs empty to update every theme with an update pending.',
			},
			{
				name: 'Update Translations',
				value: 'updateTranslations',
				action: 'Update translations on a site',
				description:
					'Update translation files on one site. This updates the live production site immediately.',
			},
		],
		default: 'getAll',
	},
];

export const updateFields: INodeProperties[] = [
	siteLocator('update', SITE_LOCATOR_OPERATIONS),

	// ----------------------------------------------------------------------
	// update:getAll — filters (no pagination on this route)
	// ----------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description:
			'This route has no pagination — the full result set is always returned, narrowed only by these filters',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['getAll'],
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
				description: 'Return only records matching this string',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				placeholder: 'plugins, themes',
				description:
					'Update types to return, comma-separated. Accepts "all", "wp", "plugins", "themes", and "translations".',
			},
		],
	},

	// ----------------------------------------------------------------------
	// update:getForSite — filters (no pagination on this route)
	// ----------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'siteFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description:
			'This route has no pagination — the full result set is always returned, narrowed only by these filters',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['getForSite'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only records matching this string',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				placeholder: 'plugins, themes',
				description:
					'Update types to return, comma-separated. Accepts "all", "wp", "plugins", "themes", and "translations".',
			},
		],
	},

	// ----------------------------------------------------------------------
	// update:getIgnored / getIgnoredForSite — filters
	// ----------------------------------------------------------------------
	{
		displayName: 'Filters',
		name: 'ignoredFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description:
			'This route has no pagination — the full result set is always returned, narrowed only by these filters',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['getIgnored', 'getIgnoredForSite'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Return only records matching this string',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				placeholder: 'plugins, themes',
				description:
					'Update types to return, comma-separated. Accepts "all", "plugins", and "themes".',
			},
		],
	},

	// ----------------------------------------------------------------------
	// update:runAll — options
	// ----------------------------------------------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['runAll'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				placeholder: 'plugins, themes',
				description:
					'Update types to run, comma-separated. Accepts "all", "wp", "plugins", "themes", and "translations".',
			},
		],
	},

	// ----------------------------------------------------------------------
	// update:ignorePlugins / updatePlugins
	// ----------------------------------------------------------------------
	{
		displayName: 'Plugin Paths',
		name: 'pluginSlug',
		type: 'string',
		default: '',
		placeholder: 'akismet/akismet.php, hello-dolly/hello.php',
		description:
			'Plugin file paths to act on, comma-separated for several. Leave empty to act on every plugin with an update pending.',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['ignorePlugins', 'updatePlugins'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// update:ignoreThemes / updateThemes
	// ----------------------------------------------------------------------
	{
		displayName: 'Theme Slugs',
		name: 'themeSlug',
		type: 'string',
		default: '',
		placeholder: 'twentytwentythree, twentytwentyfour',
		description:
			'Theme slugs to act on, comma-separated for several. Leave empty to act on every theme with an update pending.',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['ignoreThemes', 'updateThemes'],
			},
		},
	},

	// ----------------------------------------------------------------------
	// update:updateTranslations
	// ----------------------------------------------------------------------
	{
		displayName: 'Translation Slugs',
		name: 'translationSlug',
		type: 'string',
		default: '',
		description:
			'Translation slugs to update, comma-separated for several. Leave empty to update every translation with an update pending.',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['updateTranslations'],
			},
		},
	},
];
