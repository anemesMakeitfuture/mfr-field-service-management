import type { INodeProperties } from 'n8n-workflow';

export const ItemTypeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['itemType'],
			},
		},
		options: [
			{
				name: 'Create One',
				value: 'createItemType',
				description: 'Create an Item Type',
				action: 'Create an item type',
			},
			{
				name: 'Get One',
				value: 'getItemType',
				description: 'Get an Item Type',
				action: 'Get an item type',
			},
			{
				name: 'Get Many',
				value: 'listItemTypes',
				description: 'List Item Types',
				action: 'List item types',
			}
		],
		default: 'createItemType',
	},
];

export const itemTypeFields: INodeProperties[] = [

/* -------------------------------------------------------------------------- */
	/*                                  itemType:createItemType                 */
	/* -------------------------------------------------------------------------*/

	{
		displayName: 'Name Or Number',
		name: 'NameOrNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},
	{
		displayName: 'External ID',
		name: 'ExternalId',
		type: 'string',
		description: 'Optional. External ID for the item. Can be used for searching or adding items to a Service Request.',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},
	{
		displayName: 'Type',
		name: 'Type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Material',
				value: 'Material'
			},
			{
				name: 'Service',
				value: 'Service'
			},
			{
				name: 'Equipment',
				value: 'Equipment'
			},
			{
				name: 'Text',
				value: 'Text'
			},
			{
				name: 'ExchangePart',
				value: 'ExchangePart'
			},
			{
				name: '',
				value: ''
			},

		],
		default: '',
	},
	{
		displayName: 'Costs',
		name: 'Costs',
		type: 'string',
		description: 'Purchase cost of the item. Default is 0.0.',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},
	{
		displayName: 'Price',
		name: 'Price',
		type: 'string',
		description: 'Selling price of the item. Default is 0.0.',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},

	{
		displayName: 'Unit Name or ID',
		name: 'UnitId',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		typeOptions: {
		loadOptionsMethod: 'getItemUnits',
	},
		default: '',
	},

	{
		displayName: 'Manufacture',
		name: 'Manufacture',
		type: 'string',
		description: 'ID or number of the Manufacturer',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},
	{
		displayName: 'VAT',
		name: 'VAT',
		type: 'string',
		description: 'Tax value for the item. Default is 0.0.',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},
	{
		displayName: 'Description',
		name: 'Description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},
	{
		displayName: 'Global Trade Item Nr',
		name: 'GlobalTradeItemNr',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		default: '',
	},

	/* -------------------------------------------------------------------------- */
	/*                                  itemType:getItemType                     */
	/* -------------------------------------------------------------------------*/

	{
		displayName: 'Item Type',
		name: 'id',
		type: 'resourceLocator',
		description: 'Can search by name or external ID',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['getItemType'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select from the list',
				typeOptions: {
					searchListMethod: 'getItemTypes',
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
				resource: ['itemType'],
				operation: ['getItemType'],
			},
		},
		default: '',
	},

		/* -------------------------------------------------------------------------- */
	/*                                  itemType:listItemTypes                     */
	/* -------------------------------------------------------------------------*/
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['listItemTypes'],
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
				resource: ['itemType'],
				operation: ['listItemTypes'],
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
				resource: ['itemType'],
				operation: ['listItemTypes'],
			},
		},
		default: '',
	},
	{
		displayName: 'Expand',
		name: '$expand',
		hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['listItemTypes'],
			},
		},
		default: '',
	},


]
