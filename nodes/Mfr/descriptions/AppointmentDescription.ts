import type { INodeProperties } from 'n8n-workflow';

export const AppointmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['appointment'],
			},
		},
		options: [
			{
				name: 'Create One',
				value: 'createAppointment',
				description: 'Create an Appointment',
				action: 'Create an appointment',
			}
		],
		default: 'createAppointment',
	},
];

export const appointmentFields: INodeProperties[] = [

/* -------------------------------------------------------------------------- */
/*                                  appointment:createAppointment            */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact',
		name: 'ContactId',
		type: 'resourceLocator',
		description: 'Can search by name or ID',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['appointment'],
				operation: ['createAppointment'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select from the list',
				typeOptions: {
					searchListMethod: 'searchContacts',
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
							errorMessage: 'Not a valid contact ID',
						},
					},
				],
			},
		],
	},
	{
		displayName: 'Start Date Time',
		name: 'StartDateTime',
		displayOptions: {
			show: {
				resource: ['appointment'],
				operation: ['createAppointment'],
			},
		},
		type: 'dateTime',
		required: true,
		default: '',
	},
	{
		displayName: 'End Date Time',
		name: 'EndDateTime',
		displayOptions: {
			show: {
				resource: ['appointment'],
				operation: ['createAppointment'],
			},
		},
		type: 'dateTime',
		required: true,
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
				resource: ['appointment'],
				operation: ['createAppointment'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'Type',
				type: 'options',
				options: [
					{
						name: 'Illness',
						value: 'Illness',
					},
					{
						name: 'Vacation',
						value: 'Vacation',
					},
					{
						name: 'Other',
						value: 'Other',
					},
				],
				default: 'Other',
			},
		],
	},
];
