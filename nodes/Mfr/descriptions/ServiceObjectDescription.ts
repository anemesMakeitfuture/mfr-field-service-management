import type { INodeProperties } from 'n8n-workflow';

export const ServiceObjectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['serviceObject'],
			},
		},
		options: [
			{
				name: 'Create One',
				value: 'createServiceObject',
				description: 'Create a Service Object',
				action: 'Create a service object',
			}
		],
		default: 'createServiceObject',
	},
];

export const serviceObjectFields: INodeProperties[] = [

/* -------------------------------------------------------------------------- */
	/*                                  serviceObject:createServiceObject       */
	/* ------------------------------------------------------------------------ */

	{
		displayName: 'Name',
		name: 'Name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['serviceObject'],
				operation: ['createServiceObject'],
			},
		},
		default: '',
	},

	// Location
	{
		displayName: 'Location',
		name: 'Location',
		type: 'collection',
		placeholder: 'Add Location Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['serviceObject'],
				operation: ['createServiceObject'],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'AddressString',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Postal',
				name: 'Postal',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'City',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'State',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'Country',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is Valid Location',
				name: 'IsValidLocation',
				type: 'boolean',
				default: false,
			},
		],
	},

	{
		displayName: 'Company ID',
		name: 'CompanyId',
		type: 'resourceLocator',
		description: 'Can search by name or ID',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				resource: ['serviceObject'],
				operation: ['createServiceObject'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select from the list',
				typeOptions: {
					searchListMethod: 'searchCompanies',
					searchable: true,
				},
			},
			{
				displayName: 'By Id',
				name: 'id',
				type: 'string',
				placeholder: '58539222',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[0-9]+',
							errorMessage: 'Not a valid company ID',
						},
					},
				],
			},
		],
	},

	{
		displayName: 'External ID',
		name: 'ExternalId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['serviceObject'],
				operation: ['createServiceObject'],
			},
		},
		default: '',
	},

]
