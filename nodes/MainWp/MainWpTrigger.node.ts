import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { mainWpApiRequest, unwrapData } from './GenericFunctions';
import { listSearch, loadOptions } from './loadOptions';

type TriggerEvent =
	| 'updatesAvailable'
	| 'siteStatusChanged'
	| 'monitorIncident'
	| 'newNonMainWpChange'
	| 'newClient'
	| 'newSite';

interface TriggerStaticData {
	initialized?: boolean;
	seenKeys?: string[];
	siteStatuses?: Record<string, string>;
}

/**
 * Builds a stable identity key for a record. The spec does not type the list
 * records (see docs/OPEN_QUESTIONS.md), so this falls back through the likely
 * ID fields and finally the serialized record itself.
 */
function keyOf(record: IDataObject): string {
	const candidates = [record.id, record.incident_id, record.change_id, record.client_id];
	for (const candidate of candidates) {
		if (candidate !== undefined && candidate !== null && candidate !== '') {
			return String(candidate);
		}
	}
	return JSON.stringify(record);
}

function asRecordArray(data: IDataObject | IDataObject[]): IDataObject[] {
	if (Array.isArray(data)) return data;
	if (data === null || typeof data !== 'object') return [];
	// Some list routes key records by ID instead of returning an array.
	return Object.values(data).filter(
		(value): value is IDataObject => value !== null && typeof value === 'object',
	);
}

const MAX_SEEN_KEYS = 5000;

export class MainWpTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MainWP Trigger',
		name: 'mainWpTrigger',
		icon: { light: 'file:mainwp.svg', dark: 'file:mainwp.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description:
			'Starts a workflow on MainWP Dashboard events. MainWP exposes no webhooks, so this node polls the REST API on the schedule you set.',
		defaults: {
			name: 'MainWP Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'mainWpApi',
				required: true,
			},
		],
		properties: [
			{
				displayName:
					'MainWP has no outgoing webhooks — this trigger polls the Dashboard on the schedule set under Poll Times. The first poll only records the current state and emits nothing.',
				name: 'pollingNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Monitor Incident',
						value: 'monitorIncident',
						description: 'A new uptime incident was recorded for a monitored site',
					},
					{
						name: 'New Client',
						value: 'newClient',
						description: 'A client record was added to the Dashboard',
					},
					{
						name: 'New Non-MainWP Change',
						value: 'newNonMainWpChange',
						description: 'A change was made on a child site outside of the Dashboard',
					},
					{
						name: 'New Site',
						value: 'newSite',
						description: 'A child site was connected to the Dashboard',
					},
					{
						name: 'Site Status Changed',
						value: 'siteStatusChanged',
						description: 'The connection status of a child site changed since the last poll',
					},
					{
						name: 'Updates Available',
						value: 'updatesAvailable',
						description: 'A core, plugin, theme or translation update became available',
					},
				],
				default: 'updatesAvailable',
			},
			{
				displayName: 'Update Type',
				name: 'updateType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Core', value: 'wp' },
					{ name: 'Plugin', value: 'plugin' },
					{ name: 'Theme', value: 'theme' },
					{ name: 'Translation', value: 'translation' },
				],
				default: '',
				description: 'Only emit updates of this type',
				displayOptions: {
					show: {
						event: ['updatesAvailable'],
					},
				},
			},
			{
				displayName: 'Site IDs',
				name: 'includeSites',
				type: 'string',
				default: '',
				placeholder: '1,2,3',
				description:
					'Comma-separated list of site IDs to watch. Leave empty to watch every connected site.',
				displayOptions: {
					show: {
						event: ['updatesAvailable'],
					},
				},
			},
			{
				displayName: 'Site',
				name: 'site',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				description: 'The child site to watch',
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						typeOptions: {
							searchListMethod: 'searchSites',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[0-9]+',
									errorMessage: 'Not a valid site ID',
								},
							},
						],
						placeholder: '42',
					},
					{
						displayName: 'By Domain',
						name: 'domain',
						type: 'string',
						placeholder: 'example.com',
					},
				],
				displayOptions: {
					show: {
						event: ['monitorIncident', 'newNonMainWpChange'],
					},
				},
			},
		],
	};

	methods = {
		listSearch,
		loadOptions,
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event') as TriggerEvent;
		const staticData = this.getWorkflowStaticData('node') as TriggerStaticData;
		const isManual = this.getMode() === 'manual';

		let records: IDataObject[] = [];

		if (event === 'updatesAvailable') {
			const qs: IDataObject = {};
			const updateType = this.getNodeParameter('updateType', '') as string;
			const includeSites = this.getNodeParameter('includeSites', '') as string;
			if (updateType !== '') qs.type = updateType;
			if (includeSites !== '') qs.include = includeSites;
			const response = await mainWpApiRequest.call(this, 'GET', '/updates', {}, qs);
			records = asRecordArray(unwrapData(response));
		} else if (event === 'newSite' || event === 'siteStatusChanged') {
			const response = await mainWpApiRequest.call(this, 'GET', '/sites/basic');
			records = asRecordArray(unwrapData(response));
		} else if (event === 'newClient') {
			const response = await mainWpApiRequest.call(this, 'GET', '/clients');
			records = asRecordArray(unwrapData(response));
		} else if (event === 'monitorIncident' || event === 'newNonMainWpChange') {
			const locator = this.getNodeParameter('site') as
				| string
				| { mode: string; value: string };
			const site = typeof locator === 'string' ? locator : String(locator.value);
			const endpoint =
				event === 'monitorIncident'
					? `/monitors/${site}/incidents`
					: `/sites/${site}/non-mainwp-changes`;
			const response = await mainWpApiRequest.call(this, 'GET', endpoint);
			records = asRecordArray(unwrapData(response));
		} else {
			throw new NodeOperationError(this.getNode(), `Unknown event: ${event as string}`);
		}

		// Manual runs return current data so the user can map fields.
		if (isManual) {
			const sample = records.slice(0, 3);
			if (sample.length === 0) return null;
			return [this.helpers.returnJsonArray(sample)];
		}

		if (event === 'siteStatusChanged') {
			const previous = staticData.siteStatuses ?? {};
			const next: Record<string, string> = {};
			const changed: IDataObject[] = [];
			for (const record of records) {
				const id = keyOf(record);
				const status = String(record.status ?? record.connection_status ?? '');
				next[id] = status;
				if (staticData.initialized === true && previous[id] !== undefined && previous[id] !== status) {
					changed.push({ ...record, previous_status: previous[id] });
				}
			}
			staticData.siteStatuses = next;
			staticData.initialized = true;
			if (changed.length === 0) return null;
			return [this.helpers.returnJsonArray(changed)];
		}

		// All other events: emit records not seen before.
		const seen = new Set(staticData.seenKeys ?? []);
		const fresh: IDataObject[] = [];
		for (const record of records) {
			const key = event === 'updatesAvailable' ? updateKey(record) : keyOf(record);
			if (!seen.has(key)) {
				seen.add(key);
				fresh.push(record);
			}
		}
		staticData.seenKeys = [...seen].slice(-MAX_SEEN_KEYS);

		// First poll: record the watermark, emit nothing.
		if (staticData.initialized !== true) {
			staticData.initialized = true;
			return null;
		}

		if (fresh.length === 0) return null;
		return [this.helpers.returnJsonArray(fresh)];
	}
}

/**
 * Updates have no single ID field — key on site + item + version so the same
 * update is not re-emitted every poll, but a newer version of the same item is.
 */
function updateKey(record: IDataObject): string {
	const site = record.site_id ?? record.id ?? '';
	const item = record.slug ?? record.name ?? record.type ?? '';
	const version = record.new_version ?? record.version ?? '';
	const key = `${String(site)}|${String(item)}|${String(version)}`;
	return key === '||' ? JSON.stringify(record) : key;
}
