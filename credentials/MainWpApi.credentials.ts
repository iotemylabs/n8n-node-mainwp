import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class MainWpApi implements ICredentialType {
	name = 'mainWpApi';

	displayName = 'MainWP API';

	icon: Icon = {
		light: 'file:../nodes/MainWp/mainwp.svg',
		dark: 'file:../nodes/MainWp/mainwp.dark.svg',
	};

	documentationUrl = 'https://docs.mainwp.com/api-reference/rest-api/overview';

	properties: INodeProperties[] = [
		{
			displayName: 'Dashboard URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://dashboard.example.com',
			description:
				'The WordPress site running the MainWP Dashboard plugin, without any path. Do not include /wp-json — it is added automatically. The site must not use plain permalinks, or the REST routes will not resolve.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'A MainWP REST API v2 key, created under MainWP Dashboard > API Access > API Keys. The key is shown once at creation and cannot be recovered later. It grants control over every connected WordPress site — use a Read-scope key for read-only workflows. Keys need Read scope for GET operations and Write & Delete scope for everything else.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// /sites/count is the cheapest authenticated route and needs only Read scope.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl.replace(new RegExp("/+$"), "")}}',
			url: '/wp-json/mainwp/v2/sites/count',
			method: 'GET',
		},
	};
}
