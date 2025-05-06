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
]
