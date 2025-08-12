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
/*                                  contact:listContacts                      */
	/* --------------------------------------------------------------------------*/
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['listContacts']
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
				resource: ['contact'],
				operation: ['listContacts']
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
				resource: ['contact'],
				operation: ['listContacts']
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
      name: 'Company',
      value: 'Company',
    },
    {
      name: 'User',
      value: 'User',
    }
  ],
  default: [],
  hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
  displayOptions: {
    show: {
				resource: ['contact'],
				operation: ['listContacts']
			},
  },
},


];
