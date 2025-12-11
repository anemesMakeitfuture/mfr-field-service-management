import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'listContacts',
				description: 'List Contacts',
				action: 'List contacts',
			}
		],
		default: 'listContacts',
	},
];

export const contactFields: INodeProperties[] = [

/* --------------------------------------------------------------------------  */
/*                                  contact:listContacts                       */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Fetch All Results',
		name: 'fetchAllResults',
		type: 'boolean',
		required: true,
		hint: 'Whether to fetch all contacts. If this parameter is set to true, limit is ignored and all contacts will be retrieved.',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['listContacts'],
			},
		},
		default: false,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['listContacts'],
			},
		},
		options: [
			{
				displayName: 'Expand',
				name: '$expand',
				type: 'multiOptions',
				options: [
					{
						name: 'Company',
						value: 'Company',
					},
					{
						name: 'User',
						value: 'User',
					},
				],
				default: [],
				hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
			},
			{
				displayName: 'Filter',
				name: '$filter',
				hint: 'Allows to filter by a condition or a set of conditions given. <a href="https://www.odata.org/documentation/odata-version-3-0/url-conventions/">Filters documentation</a>',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	},
];
