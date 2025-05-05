import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	INodeListSearchItems,
	INodeListSearchResult,
	ILoadOptionsFunctions,
	INodePropertyOptions,
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

	methods = {
		loadOptions: {
			async getCompanies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = `https://portal.mobilefieldreport.com/odata/Companies`;
				const options = {
						method: 'GET',
						qs: {
							"$top": 1
						},
						uri: endpoint,
						json: true,
						useQuerystring: true,
				} satisfies IRequestOptions;

				// Fetching the companies data
				const response = await this.helpers.requestWithAuthentication.call(
						this,
						'mfrApi',
						options,
				);

				console.log(response)

				// Extracting the companies' names from the response
				for (const company of response.value) {
					returnData.push({
							name: company.Name,  // Mapping the Name value
							value: company.Id,   // Mapping the Id value
					});
			}

				return returnData;
		}
		},
		listSearch: {
			async searchCompanies(this: ILoadOptionsFunctions, filter?: string,): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/Companies';
				const qs: IDataObject = {
			//		"$filter": `Name eq ${filter}`,
				};
				const options = {
					method: 'GET',
					qs,
					uri: endpoint,
					json: true,
					useQuerystring: true,
			} satisfies IRequestOptions;

			console.log(options)

				const searchResults = await this.helpers.requestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);
				// Extracting and filtering the company data from the response
				const results: INodeListSearchItems[] = searchResults.value
        .map((company: any) => ({
            name: company.Name,  // Mapping the Name field from the response
            value: company.Id,   // Mapping the Id field from the response
        }))
        .filter(
            (company: { name: string; value: { toString: () => string; }; }) =>
                !filter || // If no filter, return all
                company.name.toLowerCase().includes(filter.toLowerCase()) || // Filter by name
                company.value?.toString() === filter // Optionally filter by company Id
        )

    return { results };
			},
		}
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

	return [returnData];
	}
}
