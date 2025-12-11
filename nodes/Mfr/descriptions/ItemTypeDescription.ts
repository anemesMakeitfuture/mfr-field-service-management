/* eslint-disable n8n-nodes-base/node-param-description-wrong-for-dynamic-options */
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
/*                                  itemType:createItemType                   */
/* -------------------------------------------------------------------------- */
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
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['createItemType'],
			},
		},
		options: [
			{
				displayName: 'Costs',
				name: 'Costs',
				type: 'string',
				description: 'Purchase cost of the item. Default is 0.0.',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'External ID',
				name: 'ExternalId',
				type: 'string',
				description: 'Optional. External ID for the item. Can be used for searching or adding items to a Service Request.',
				default: '',
			},
			{
				displayName: 'Global Trade Item Nr',
				name: 'GlobalTradeItemNr',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Manufacture',
				name: 'Manufacture',
				type: 'string',
				description: 'ID or number of the Manufacturer',
				default: '',
			},
			{
				displayName: 'Price',
				name: 'Price',
				type: 'string',
				description: 'Selling price of the item. Default is 0.0.',
				default: '',
			},
			{
				displayName: 'Type',
				name: 'Type',
				type: 'options',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Material',
						value: 'Material',
					},
					{
						name: 'Service',
						value: 'Service',
					},
					{
						name: 'Equipment',
						value: 'Equipment',
					},
					{
						name: 'Text',
						value: 'Text',
					},
					{
						name: 'ExchangePart',
						value: 'ExchangePart',
					},
				],
				default: 'Material',
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
				displayName: 'VAT',
				name: 'VAT',
				type: 'string',
				description: 'Tax value for the item. Default is 0.0.',
				default: '',
			},
		],
	},

/* -------------------------------------------------------------------------- */
/*                                  itemType:getItemType                      */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Item Type',
		name: 'id',
		type: 'resourceLocator',
		description: 'Can search by name or external ID. Complete this or External ID field.',
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
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: '58539222',
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
				resource: ['itemType'],
				operation: ['getItemType'],
			},
		},
		options: [
			{
				displayName: 'External ID',
				name: 'ExternalId',
				hint: 'Enter either an External ID (to search by External ID) or an ID (to fetch by ID); if an External ID is provided, the lookup uses that.',
				type: 'string',
				default: '',
			},
		],
	},

/* -------------------------------------------------------------------------- */
/*                                  itemType:listItemTypes                    */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Fetch All Results',
		name: 'fetchAllResults',
		type: 'boolean',
		required: true,
		hint: 'Whether to fetch all item types. If this parameter is set to true, limit is ignored and all item types will be retrieved.',
		displayOptions: {
			show: {
				resource: ['itemType'],
				operation: ['listItemTypes'],
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
				resource: ['itemType'],
				operation: ['listItemTypes'],
			},
		},
		options: [
			{
				displayName: 'Expand',
				name: '$expand',
				hint: 'Expand hidden fields. <a href="https://documenter.getpostman.com/view/3999268/TVYCAzpK#odata-tools">Expand documentation</a>',
				type: 'multiOptions',
				options: [
					{
						name: 'Unit',
						value: 'Unit',
					},
				],
				default: [],
			},
			{
				displayName: 'Filter',
				name: '$filter',
				hint: 'Allows to filter by a condition or a set of conditions given. <a href="https://www.odata.org/documentation/odata-version-3-0/url-conventions/">Filters documentation</a>',
				type: 'string',
				default: '',
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
];
