import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MfrApi implements ICredentialType {
	name = 'mfrApi';
	displayName = 'MFR API';
	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	// Authentication configuration
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};

	// Test configuration (request to the API to verify credentials)
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://portal.mobilefieldreport.com/odata',
			url: '/Users?$expand=Contact',
		},
	};
}
