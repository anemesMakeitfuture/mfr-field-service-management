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
			},
			{
				name: 'Get a Service Object',
				value: 'getServiceObject',
				description: 'Get a Service Object by ID',
				action: 'Get a service object by id',
			},
			{
				name: 'Get Many Service Objects',
				value: 'listServiceObjects',
				description: 'Get all Service Objects',
				action: 'Get all service objects',
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

	/* -------------------------------------------------------------------------- */
	/*                                  serviceObject:getServiceObject           */
	/* ------------------------------------------------------------------------ */

	{
		displayName: 'Service Object',
		name: 'id',
		type: 'resourceLocator',
		description: 'Can search by name or external ID. Complete this or External ID field.',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				resource: ['serviceObject'],
				operation: ['getServiceObject'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select from the list',
				typeOptions: {
					searchListMethod: 'getServiceObject',
					searchable: true,
				},
			},
			{
				displayName: 'By External Id',
				name: 'id',
				type: 'string',
				placeholder: '58539222'
			},
		],
	},
	{
		displayName: 'External ID',
		name: 'ExternalId',
		hint: 'Enter either an External ID (to search by External ID) or an ID (to fetch by ID); if an External ID is provided, the lookup uses that.',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['serviceObject'],
				operation: ['getServiceObject'],
			},
		},
		default: '',
	},
	{
	displayName: 'Expand',
	name: '$expand',
	type: 'multiOptions',
	options: [
		{
			name: 'Contacts',
			value: 'Contacts',
		},
		{
			name: 'Company',
			value: 'Company',
		},
		{
			name: 'Product',
			value: 'Product',
		},
		{
			name: 'Tags',
			value: 'Tags',
		},
	],
	default: [],
	hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
	displayOptions: {
		show: {
				resource: ['serviceObject'],
				operation: ['getServiceObject'],
			},
	},
},

	/* -------------------------------------------------------------------------- */
	/*                                  serviceObject:listServiceObjects          */
	/* ------------------------------------------------------------------------ */

	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['serviceObject'],
				operation: ['listServiceObjects'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Fetch All Results',
		name: 'fetchAllResults',
		type: 'boolean',
		required: true,
		hint: 'Whether to fetch all refunds. If this parameter is set to true, number of entities is ignored and all refunds will be retrieved.',
		displayOptions: {
				show: {
				resource: ['serviceObject'],
				operation: ['listServiceObjects'],
			},
		},
		default: false,
	},
	{
		displayName: 'Filter',
		name: '$filter',
		hint: 'Allows to filter by a condition or a set of conditions given. <a href="https://www.odata.org/documentation/odata-version-3-0/url-conventions/">Filters documentation</a>',
		type: 'string',
		displayOptions: {
				show: {
				resource: ['serviceObject'],
				operation: ['listServiceObjects'],
			},
		},
		default: '',
	},
	{
  displayName: 'Expand',
  name: '$expand',
  type: 'multiOptions',
  options: [
   {
			name: 'Contacts',
			value: 'Contacts',
		},
		{
			name: 'Company',
			value: 'Company',
		},
		{
			name: 'Product',
			value: 'Product',
		},
		{
			name: 'Tags',
			value: 'Tags',
		},
  ],
  default: [],
  hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
  displayOptions: {
    	show: {
				resource: ['serviceObject'],
				operation: ['listServiceObjects'],
			},
  },
},

]
