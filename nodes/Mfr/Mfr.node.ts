import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
} from 'n8n-workflow';
import { companyFields, companyOperations } from './descriptions/CompanyDescription';

export class Mfr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MFR - Field Service Management',
		name: 'mfr',
		group: ['transform'],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:mfrLogo.png',
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Field service management app for scheduling technicians.',
		defaults: {
			name: 'MFR - Field Service Management',
		},
		credentials: [
			{
				name: 'mfrApi',
				required: true,
			}],
		inputs: ['main'],
		outputs: ['main'],

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				default: 'company',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
					}]},

			// COMPANY
			...companyOperations,
			...companyFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		let responseData;
		const returnData: INodeExecutionData[] = [];
		const qs: IDataObject = {};
		const body: IDataObject = {};

		for (let i = 0; i < items.length; i++) {
		try{

	// get company
	if (resource === 'company') {
		if (operation === 'get') {
			const companyUI = this.getNodeParameter('companyId', i) as IDataObject;
			console.log(companyUI)
			let companyId = companyUI.value as string;

			const endpoint = `https://portal.mobilefieldreport.com/odata/Companies(${companyId}L)`;
			const options = {
				method: 'GET',
				qs,
				headers: {},
				uri: endpoint,
				body,
				json: true,
				useQuerystring: true,
			} satisfies IRequestOptions;

			console.log(options);


		responseData = await this.helpers.requestWithAuthentication.call(
				this,
				'mfrApi',
				options,
		);}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);
}
		 catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ error: error.message, json: {} });
				continue;
			}
			throw error;
		}
	}
	// return [returnData as INodeExecutionData[]];
	return [returnData];
	}
}
