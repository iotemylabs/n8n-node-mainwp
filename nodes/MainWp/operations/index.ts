import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import type { MainWpResource } from '../types';
import * as batch from './batch';
import * as client from './client';
import * as cost from './cost';
import * as monitor from './monitor';
import * as page from './page';
import * as post from './post';
import * as settings from './settings';
import * as site from './site';
import * as tag from './tag';
import * as update from './update';
import * as user from './user';

export type OperationHandler = (
	this: IExecuteFunctions,
	itemIndex: number,
) => Promise<IDataObject | IDataObject[]>;

const resources: Record<MainWpResource, Record<string, OperationHandler>> = {
	batch: batch.operations,
	client: client.operations,
	cost: cost.operations,
	monitor: monitor.operations,
	page: page.operations,
	post: post.operations,
	settings: settings.operations,
	site: site.operations,
	tag: tag.operations,
	update: update.operations,
	user: user.operations,
};

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		const resource = this.getNodeParameter('resource', i) as MainWpResource;
		const operation = this.getNodeParameter('operation', i) as string;

		try {
			const handler = resources[resource]?.[operation];
			if (handler === undefined) {
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for the resource "${resource}"`,
					{ itemIndex: i },
				);
			}

			const responseData = await handler.call(this, i);
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			const nodeError =
				error instanceof NodeApiError || error instanceof NodeOperationError
					? error
					: new NodeOperationError(this.getNode(), error as Error);
			nodeError.context.itemIndex = i;
			throw nodeError;
		}
	}

	return [returnData];
}
