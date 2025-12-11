import type { INodeProperties } from 'n8n-workflow';

export const UserOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Get Many Users',
				value: 'listUsers',
				description: 'Get all Users',
				action: 'Get all users',
			}
		],
		default: 'listUsers',
	},
];

export const UserFields: INodeProperties[] = [

/* -------------------------------------------------------------------------- */
/*                                  user:listUsers                            */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Fetch All Results',
		name: 'fetchAllResults',
		type: 'boolean',
		required: true,
		hint: 'Whether to fetch all users. If this parameter is set to true, limit is ignored and all users will be retrieved.',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['listUsers'],
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
				resource: ['user'],
				operation: ['listUsers'],
			},
		},
		options: [
			{
				displayName: 'Expand',
				name: '$expand',
				type: 'multiOptions',
				options: [
					{
						name: 'Contact',
						value: 'Contact',
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
