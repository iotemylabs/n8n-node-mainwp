import type { IDataObject } from 'n8n-workflow';

/**
 * The standard MainWP v2 response envelope.
 * Some routes report a failed action as `success: 0` inside an HTTP 200
 * response — the shared unwrapper treats that as an error.
 */
export interface MainWpEnvelope {
	success?: number | boolean;
	message?: string;
	data?: IDataObject | IDataObject[];
	total?: number;
	pages?: number;
}

/**
 * Returned when the Dashboard queues the work instead of running it inline
 * (`/sites/sync`, `/updates/update` and their per-site variants).
 * Job status is only exposed through the WordPress Abilities API
 * (`mainwp/get-batch-job-status-v1`), which uses WordPress authentication —
 * it cannot be polled with the MainWP API key.
 */
export interface QueuedAction {
	success: number;
	message?: string;
	job_id: string;
	queued_count?: number;
	total?: number;
}

/**
 * Per-site outcome of a fleet-wide action. Carries no `success` key —
 * the unwrapper passes this shape through unchanged.
 */
export interface BulkSiteResult {
	total: number;
	data: IDataObject;
}

/** Progress of a pollable settings/tools background job. */
export interface ToolJobStatus {
	success?: boolean;
	status?: string;
	total?: number;
	processed?: number;
	failed?: number;
	progress?: number;
}

/** WordPress REST error body: { code, message, data: { status } }. */
export interface WordPressRestError {
	code?: string;
	message?: string;
	data?: {
		status?: number;
	};
}

export type MainWpResource =
	| 'site'
	| 'client'
	| 'tag'
	| 'update'
	| 'cost'
	| 'post'
	| 'page'
	| 'user'
	| 'monitor'
	| 'settings'
	| 'batch';
