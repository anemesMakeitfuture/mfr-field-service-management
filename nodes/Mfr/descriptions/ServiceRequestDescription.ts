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
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Create One',
				value: 'createServiceRequest',
				description: 'Create a Service Request',
				action: 'Create a service request',
			},
			{
				name: 'Get One',
				value: 'getServiceRequest',
				description: 'Get a Service Request by ID',
				action: 'Get a service request by id',
			},
			{
				name: 'Delete One',
				value: 'deleteServiceRequest',
				description: 'Delete a Service Request',
				action: 'Delete a service request',
			},
			{
				name: 'Add Tags to Service Request',
				value: 'addTagsToServiceRequest',
				description: 'Add a tag to a service request',
				action: 'Add a tag to a service request',
			},
			{
				name: 'Remove Tag From Service Request',
				value: 'removeTagFromServiceRequest',
				description: 'Remove a tag from service request',
				action: 'Remove a tag from service request',
			},
			{
				name: 'Get Many Service Requests',
				value: 'listServiceRequests',
				description: 'Get a list of all service requests, with Service Objects and Products, Steps, Reports, Appointments and Items expanded',
				action: 'Get a list of all service requests',
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
		displayName: 'Use JSON for Service Objects',
		name: 'useJsonServiceObjects',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
			},
		},
		default: false,
	},

	{
		displayName: 'Service Objects',
		name: 'ServiceObjects',
		type: 'json',
		default: '',
		"description": "Provide an array having this format: \n[ \n    { \n        \"Id\": \"231\" \n    }, \n    { \n        \"Id\": \"231\" \n    } \n]",
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
				useJsonServiceObjects: [true],
			},
		},
	},

{
	displayName: 'Service Objects',
	name: 'ServiceObjectsUi',
	placeholder: 'Add Service Objects',
	type: 'fixedCollection',
	default: {},
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			name: 'value',
			displayName: 'Service Object',
			values: [
				{
					displayName: 'Name or ID',
					name: 'id',
					type: 'options',
					default: '',
			    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',

					typeOptions: {
					loadOptionsMethod: 'getServiceObjectLoadOptions'
				},
				},
			],
		},
	],
	displayOptions: {
		show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
				useJsonServiceObjects: [false],
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
		displayName: 'Use JSON for Appointments',
		name: 'useJsonAppointments',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['createServiceRequest'],
			},
		},
		default: false,
	},

	{
    displayName: 'Appointments',
    name: 'Appointments',
    type: 'json',
    default: '',
    "description": "Provide an array having this format: \n[ \n    { \n        \"ContactIds\": [ \n            \"60357836802\", \n            \"60357836804\", \n            \"60409872395\" \n        ], \n        \"EndDateTime\": \"2025-05-21T14:50:00.000Z\", \n        \"StartDateTime\": \"2025-05-14T14:50:00.000Z\" \n    } \n]",
    displayOptions: {
        show: {
            resource: ['serviceRequest'],
            operation: ['createServiceRequest'],
						useJsonAppointments: [true],
        },
    },
},

{
    displayName: 'Appointments',
    name: 'AppointmentsUI',
    type: 'fixedCollection',
    placeholder: 'Add appointment',
    displayOptions: {
        show: {
            resource: ['serviceRequest'],
            operation: ['createServiceRequest'],
            useJsonAppointments: [false],

        },
    },
    default: {},
    typeOptions: {
        multipleValues: true,
    },
    options:
    [{
        name: 'value',
        displayName: 'Appointment',
        values: [
            {
            displayName: 'Contact Name or ID',
            name: 'ContactIds',
            type: 'options',
            default: '',
            typeOptions: {
                multipleValues: true,
               loadOptionsMethod: 'getContactsLoadOptions'
            },
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
        },
        {
            displayName: 'Start Date Time',
            name: 'StartDateTime',
            type: 'dateTime',
            default: '',
            placeholder: '2025-05-14T14:50:00.000Z',
            description: 'Start date and time in ISO format',
        },
        {
            displayName: 'End Date Time',
            name: 'EndDateTime',
            type: 'dateTime',
            default: '',
            placeholder: '2025-05-21T14:50:00.000Z',
            description: 'End date and time in ISO format',
        },
    ],
    }, ]

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

{
	displayName: 'Target Time In Minutes',
	name: 'TargetTimeInMinutes',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['serviceRequest'],
			operation: ['createServiceRequest'],
		},
	},
	default: '',
},

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
	type: 'string',
	default: ''
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
	type: 'string',
	default: ''
},

/* -------------------------------------------------------------------------- */
	/*                                  serviceRequest:addTagsToServiceRequest, removeTagFromServiceRequest, deleteServiceRequest    */
	/* -------------------------------------------------------------------------- */

	{
		displayName: 'Search Service Request',
		name: 'ServiceRequest',
		required: true,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Can search by ID',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['addTagsToServiceRequest', 'removeTagFromServiceRequest', 'deleteServiceRequest'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select from the list',
				typeOptions: {
					searchListMethod: 'searchServiceRequest',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string'
			},
		],
	},

	{
		displayName: 'Tag Name or ID',
		name: 'Tag',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['addTagsToServiceRequest', 'removeTagFromServiceRequest'],
			},
		},
		type: 'options',
		typeOptions: {
		loadOptionsMethod: 'getTag',
	},
		default: '',
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
	},

	/* -------------------------------------------------------------------------- */
	/*                                  serviceRequest:listServiceRequests          */
	/* ------------------------------------------------------------------------ */

	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['listServiceRequests'],
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
				resource: ['serviceRequest'],
				operation: ['listServiceRequests'],
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
				resource: ['serviceRequest'],
				operation: ['listServiceRequests'],
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
			name: 'Qualifications',
			value: 'Qualifications',
		}
  ],
  default: [],
  hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
  displayOptions: {
    	show: {
				resource: ['serviceRequest'],
				operation: ['listServiceRequests'],
			},
  },
},
	/* ------------------------------------------------------------------------ */
	/*                                  serviceRequest:getServiceRequest        */
	/* ------------------------------------------------------------------------ */

	{
		displayName: 'Search Service Request',
		name: 'ServiceRequest',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Can search by ID',
		displayOptions: {
			show: {
				resource: ['serviceRequest'],
				operation: ['getServiceRequest'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select from the list',
				typeOptions: {
					searchListMethod: 'searchServiceRequest',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string'
			},
		],
	},
{
	displayName: 'External ID',
	name: 'ExternalId',
	type: 'string',
	hint: 'Enter either an External ID (to search by External ID) or an ID (to fetch by ID); if an External ID is provided, the lookup uses that.',
	displayOptions: {
		show: {
		resource: ['serviceRequest'],
				operation: ['getServiceRequest'],
		},
	},
	default: '',
},
	{
  displayName: 'Expand',
  name: '$expand',
  type: 'multiOptions',
  // eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
  options: [
   {
			name: 'Service Objects',
			value: 'ServiceObjects',
		},
		{
			name: 'Customer',
			value: 'Customer',
		},
			{
			name: 'Reports',
			value: 'Reports',
		},
			{
			name: 'Items',
			value: 'Items',
		},
			{
			name: 'Appointments/Contacts',
			value: 'Appointments/Contacts',
		},
			{
			name: 'Steps',
			value: 'Steps',
		},
			{
			name: 'Comments',
			value: 'Comments',
		},
			{
			name: 'Stock Movements',
			value: 'StockMovements',
		}
  ],
  default: [],
  hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
  displayOptions: {
    	show: {
				resource: ['serviceRequest'],
				operation: ['getServiceRequest'],
			},
  },
},


]
