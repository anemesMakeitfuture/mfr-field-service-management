import type { INodeProperties } from 'n8n-workflow';

export const ServiceRequestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
			},
		},
		options: [
			{
				name: 'Create One',
				value: 'createServiceRequest',
				description: 'Create a Service Request',
				action: 'Create a service request',
			}
		],
		default: 'createServiceRequest',
	},
];

export const serviceRequestFields: INodeProperties[] = [

/* -------------------------------------------------------------------------- */
	/*                                  serviceRequest:createServiceRequest      */
	/* -------------------------------------------------------------------------- */

	{
		displayName: 'Name',
		name: 'Name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
			},
		},
		default: '',
	},

	{
		displayName: 'Service Objects',
		name: 'ServiceObjects',
		required: true,
		type: 'json',
		default: '',
		"description": "Provide an array having this format: \n[ \n    { \n        \"Id\": \"231\" \n    }, \n    { \n        \"Id\": \"231\" \n    } \n]",
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
			},
		},
	},

	{
		displayName: 'Service Request Template Name or ID',
		name: 'CreateFromServiceRequestTemplateId',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
			},
		},
		type: 'options',
		typeOptions: {
		loadOptionsMethod: 'getServiceRequestsTemplates',
	},
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
	},

	{
		displayName: 'State',
		name: 'State',
		type: 'options',
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'ReadyForScheduling',
				value: 'ReadyForScheduling',
			},
			{
				name: 'Created',
				value: 'Created',
			},
			{
				name: 'Scheduled',
				value: 'Scheduled',
			},
			{
				name: 'Released',
				value: 'Released',
			},
			{
				name: '',
				value: '',
			}
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
			},
		},
	},

	{
		displayName: 'Description',
		name: 'Description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
			},
		},
		default: '',
	},

	{
		displayName: 'Search Customer',
		name: 'CustomerId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Can search by name or ID',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
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
    displayName: 'Appointments',
    name: 'Appointments',
    required: true,
    type: 'json',
    default: '',
    "description": "Provide an array having this format: \n[ \n    { \n        \"ContactIds\": [ \n            \"60357836802\", \n            \"60357836804\", \n            \"60409872395\" \n        ], \n        \"EndDateTime\": \"2025-05-21T14:50:00.000Z\", \n        \"StartDateTime\": \"2025-05-14T14:50:00.000Z\" \n    } \n]",
    displayOptions: {
        show: {
            resource: ['serviceRequest'],
            operation: ['createServiceRequest'],
        },
    },
},

{
	displayName: 'External ID',
	name: 'ExternalId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['serviceRequest'],
			operation: ['createServiceRequest'],
		},
	},
	default: '',
},

// {
// 	displayName: 'Target Time In Minutes',
// 	name: 'TargetTimeInMinutes',
// 	type: 'number',
// 	displayOptions: {
// 		show: {
// 			resource: ['serviceRequest'],
// 			operation: ['createServiceRequest'],
// 		},
// 	},
// 	default: '',
// },

{
	displayName: 'Due Date Range End',
	name: 'DueDateRangeEnd',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['serviceRequest'],
			operation: ['createServiceRequest'],
		},
	},
	default: '',
},

{
	displayName: 'Cost Center Name or ID',
	name: 'CostCenterId',

	displayOptions: {
		show: {
			resource: ['serviceRequest'],
			operation: ['createServiceRequest'],
		},
	},
	type: 'options',
	typeOptions: {
	loadOptionsMethod: 'getCostCenter',
},
	default: '',
	description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
},

{
	displayName: 'Qualifications Name or ID',
	name: 'Qualifications',
	displayOptions: {
		show: {
			resource: ['serviceRequest'],
			operation: ['createServiceRequest'],
		},
	},
	type: 'options',
	typeOptions: {
	loadOptionsMethod: 'getQualifications',
},
	default: '',
	description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
},


]
