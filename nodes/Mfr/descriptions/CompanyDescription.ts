/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items */
import type { INodeProperties } from 'n8n-workflow';

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a company',
				action: 'Get a company',
			},
			{
				name: 'Get Many',
				value: 'listCompanies',
				description: 'List Companies',
				action: 'List companies',
			},
			{
				name: 'Create One',
				value: 'createCompany',
				description: 'Create a Company',
				action: 'Create a company',
			}
		],
		default: 'get',
	},
];

export const companyFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                  company:get                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Company to Get',
		name: 'companyId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Can search by name or ID',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get'],
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
							errorMessage: 'Not a valid Company ID',
						},
					},
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get'],
			},
		},
		options: [
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
						name: 'Main Contact',
						value: 'MainContact',
					},
					{
						name: 'Service Objects',
						value: 'ServiceObjects',
					},
					{
						name: 'Tags',
						value: 'Tags',
					},
				],
				default: [],
				hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
			},
		],
	},


/* --------------------------------------------------------------------------  */
/*                                  company:listCompanies                      */
/* --------------------------------------------------------------------------*/
	{
		displayName: 'Fetch All Results',
		name: 'fetchAllResults',
		type: 'boolean',
		required: true,
		hint: 'Whether to fetch all results. If this parameter is set to true, limit is ignored and all companies will be retrieved.',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['listCompanies'],
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
				resource: ['company'],
				operation: ['listCompanies'],
			},
		},
		options: [
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
						name: 'Main Contact',
						value: 'MainContact',
					},
					{
						name: 'Service Objects',
						value: 'ServiceObjects',
					},
					{
						name: 'Tags',
						value: 'Tags',
					},
				],
				default: [],
				hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
			},
			{
				displayName: 'Filter',
				name: '$filter',
				type: 'string',
				default: '',
				hint: 'Allows to filter by a condition or a set of conditions given. <a href="https://www.odata.org/documentation/odata-version-3-0/url-conventions/">Filters documentation</a>',
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

	/* -------------------------------------------------------------------------- */
	/*                                company:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'Name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['createCompany'],
			},
		},
		default: '',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['createCompany'],
			},
		},
		options: [
			{
				displayName: 'External ID',
				name: 'ExternalId',
				description: 'External or ERP ID for the company. If is not given, one is automatically generated.',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is Physical Person',
				name: 'IsPhysicalPerson',
				description: 'Whether the customer is a company (true) or a single person. Default is false. If true, MainContact must be defined and the company will get the full name of this contact.',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Note',
				name: 'Note',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Support Fax',
				name: 'SupportFax',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Support Mail',
				name: 'SupportMail',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Support Telephone',
				name: 'SupportTelephone',
				type: 'string',
				default: '',
			},
		],
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
				resource: ['company'],
				operation: ['createCompany'],
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
				displayName: 'City',
				name: 'City',
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
			{
				displayName: 'Postal',
				name: 'Postal',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'State',
				type: 'string',
				default: '',
			},
		],
	},
	// Main Contact
	{
		displayName: 'Main Contact',
		name: 'MainContact',
		type: 'collection',
		placeholder: 'Add Main Contact Field',
		default: {},
		description: 'Main Contact for the Company. It won\'t be an existing contact - will instead create a new one and only needs the LastName property to be defined.',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['createCompany'],
			},
		},
		options: [
			{
				displayName: 'Company ID',
				name: 'CompanyId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'Email',
				type: 'string',
				description: 'Required',
				default: '',
			},
			{
				displayName: 'External ID',
				name: 'ExternalId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Fax',
				name: 'Fax',
				type: 'string',
				default: '',
			},
			{
				displayName: 'First Name',
				name: 'FirstName',
				type: 'string',
				description: 'Required',
				default: '',
			},
			{
				displayName: 'Gender',
				name: 'Gender',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is User',
				name: 'IsUser',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Job Title',
				name: 'JobTitle',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'LastName',
				type: 'string',
				description: 'Required',
				default: '',
			},
			{
				displayName: 'Mobile Phone',
				name: 'MobilePhone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Note',
				name: 'Note',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Telephone',
				name: 'Telephone',
				type: 'string',
				description: 'Required',
				default: '',
			},
		],
	},
];
