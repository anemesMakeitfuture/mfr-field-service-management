import type { INodeProperties } from 'n8n-workflow';

export const ReportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['report'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Generate Report',
				value: 'generateReportFromReportDefinition',
				description: 'Generate Report from Report Definition',
				action: 'Generate report from report definition',
			}
		],
		default: 'generateReportFromReportDefinition',
	},
];

export const ReportFields: INodeProperties[] = [

	/* -------------------------------------------------------------------------- */
	/*                                  report:generateReportFromReportDefinition  */
	/* ------------------------------------------------------------------------ */


{
		displayName: 'Search Service Request',
		name: 'ServiceRequest',
		required: true,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Can search by ID',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['generateReportFromReportDefinition'],
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
	displayName: 'Report Definition Code',
	name: 'ReportDefinitionCode',
	type: 'string',
	required: true,
	hint: 'Report Definition Code.',
	displayOptions: {
	show: {
				resource: ['report'],
				operation: ['generateReportFromReportDefinition'],
			},
	},
	default: '',
},

]
