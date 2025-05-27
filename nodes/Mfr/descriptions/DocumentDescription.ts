import type { INodeProperties } from 'n8n-workflow';

export const DocumentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Upload One',
				value: 'uploadDocument',
				description: 'Upload Document',
				action: 'Upload document',
			}
		],
		default: 'uploadDocument',
	},
];

export const DocumentFields: INodeProperties[] = [

// ----------------------------------
//         uploadDocument
// ----------------------------------

	{
		displayName: 'Search Service Request',
		name: 'ServiceRequest',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Can search by ID',
		displayOptions: {
			show: {
			operation: ['uploadDocument'],
			resource: ['document'],
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
	displayName: 'Binary File',
	name: 'binaryData',
	type: 'boolean',
	default: false,
	displayOptions: {
		show: {
			operation: ['uploadDocument'],
			resource: ['document'],
		},
	},
	description: 'Whether the data to upload should be taken from binary field',
},
{
	displayName: 'File Content',
	name: 'fileContent',
	type: 'string',
	default: '',
	displayOptions: {
		show: {
			operation: ['uploadDocument'],
			resource: ['document'],
		},
	},
	placeholder: '',
	description: 'The text content of the file to upload',
},
{
	displayName: 'Input Binary Field',
	name: 'binaryPropertyName',
	type: 'string',
	default: 'data',
	required: true,
	displayOptions: {
		show: {
			operation: ['uploadDocument'],
			resource: ['document'],
		},
	},
	placeholder: '',
	hint: 'The name of the input binary field containing the file to be uploaded',
},


]
