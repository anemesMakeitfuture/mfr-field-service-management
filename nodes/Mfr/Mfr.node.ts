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
import { appointmentFields, AppointmentOperations } from './descriptions/AppointmentDescription';
import { itemTypeFields, ItemTypeOperations } from './descriptions/ItemTypeDescription';
import { serviceObjectFields, ServiceObjectOperations } from './descriptions/ServiceObjectDescription';
import { serviceRequestFields, ServiceRequestOperations } from './descriptions/ServiceRequestDescription';
import { DocumentFields, DocumentOperations } from './descriptions/DocumentDescription';
import FormData = require('form-data');

import { Buffer } from 'buffer';

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
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Appointment',
						value: 'appointment',
					},
					{
						name: 'Item Type',
						value: 'itemType',
					},
					{
						name: 'Service Object',
						value: 'serviceObject',
					},
					{
						name: 'Service Request',
						value: 'serviceRequest',
					},
					{
						name: 'Document',
						value: 'document',
					}

				]},

			// COMPANY
			...companyOperations,
			...companyFields,

			// APPOINTMENT
			...AppointmentOperations,
			...appointmentFields,

			// ITEM TYPE
			...ItemTypeOperations,
			...itemTypeFields,

			// Service Object
			...ServiceObjectOperations,
			...serviceObjectFields,

			// Service Request
			...ServiceRequestOperations,
			...serviceRequestFields,

			// Document
			...DocumentOperations,
			...DocumentFields,
		],
	};

	methods = {
		loadOptions: {
		async getItemUnits(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			const returnData: INodePropertyOptions[] = [];
			const endpoint = `https://portal.mobilefieldreport.com/odata/ItemUnits`;
			const options = {
					method: 'GET',
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

			// Extracting the companies' names from the response
			for (const itemUnit of response.value) {
				returnData.push({
						name: itemUnit.Name,  // Mapping the Name value
						value: itemUnit.Id,   // Mapping the Id value
				});
		}

			return returnData;
	},
	async getServiceRequestsTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const returnData: INodePropertyOptions[] = [];
		const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests`;
		const qs = {
			$filter: 'IsTemplate eq true'
		}
		const options = {
				method: 'GET',
				qs: qs,
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

		// Extracting the companies' names from the response
		for (const template of response.value) {
			returnData.push({
					name: 'Name: ' + template.Name + '; External ID: ' + template.ExternalId,
					value: template.Id,
			});
	}

		return returnData;
},

async getCostCenter(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const endpoint = `https://portal.mobilefieldreport.com/odata/CostCenters`;
	const options = {
			method: 'GET',
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

	// Extracting the companies' names from the response
	for (const item of response.value) {
		returnData.push({
				name: item.Name,
				value: item.Id,
		});
}

	return returnData;
},

async getQualifications(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const endpoint = `https://portal.mobilefieldreport.com/odata/Qualifications`;
	const options = {
			method: 'GET',
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

	// Extracting the companies' names from the response
	for (const item of response.value) {
		returnData.push({
				name: item.Name,
				value: item.Id,
		});
}

	return returnData;
},

async getTag(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const endpoint = `https://portal.mobilefieldreport.com/odata/Tags`;
	const options = {
			method: 'GET',
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

	// Extracting the companies' names from the response
	for (const item of response.value) {
		returnData.push({
				name: item.Name || item.Id,
				value: item.Id,
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

			async searchContacts(this: ILoadOptionsFunctions, filter?: string,): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/Contacts';
				const qs: IDataObject = {};
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
				// Extracting and filtering the contact data from the response
				const results: INodeListSearchItems[] = searchResults.value
        .map((contact: any) => ({
            name: contact.Email || contact.Id,  // Mapping the Name field from the response
            value: contact.Id,   // Mapping the Id field from the response
        }))
        .filter(
            (contact: { name: string; value: { toString: () => string; }; }) =>
                !filter || // If no filter, return all
						    contact.name.toLowerCase().includes(filter.toLowerCase()) || // Filter by name
                contact.value?.toString() === filter // Optionally filter by contact Id
        )

    return { results };
			},


			async searchServiceRequest(this: ILoadOptionsFunctions, filter?: string,): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceRequests';
				const options = {
					method: 'GET',
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

				const results: INodeListSearchItems[] = searchResults.value
        .map((el: any) => ({
            name: el.ExternalId,
            value: el.Id,
        }))
        .filter(
            (el: { name: string; value: { toString: () => string; }; }) =>
                !filter || // If no filter, return all
						el.name.includes(filter) ||
						el.value?.toString() === filter
        )

    return { results };
			},

			async getItemTypes(this: ILoadOptionsFunctions, filter?: string,): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/ItemTypes';
				const options = {
					method: 'GET',
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

				const results: INodeListSearchItems[] = searchResults.value
        .map((el: any) => ({
            name: `${el.NameOrNumber} ${el.ExternalId}`,
            value: el.Id,
        }))
        .filter(
            (el: { name: string; value: { toString: () => string; }; }) =>
                !filter || // If no filter, return all
						el.name.includes(filter) ||
						el.value?.toString() === filter
        )

    return { results };
			},

			async getServiceObject(this: ILoadOptionsFunctions, filter?: string,): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceObjects';
				const options = {
					method: 'GET',
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

				const results: INodeListSearchItems[] = searchResults.value
        .map((el: any) => ({
            name: `${el.Name} ${el.ExternalId}`,
            value: el.Id,
        }))
        .filter(
            (el: { name: string; value: { toString: () => string; }; }) =>
                !filter || // If no filter, return all
						el.name.includes(filter) ||
						el.value?.toString() === filter
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

	// list companies with pagination
	if (resource === 'company') {
    if (operation === 'listCompanies') {
        const limit = this.getNodeParameter('limit', i) as number; // Get the limit parameter
        const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
        const $filter = this.getNodeParameter('$filter', i) as string;
        const $expand = this.getNodeParameter('$expand', i) as string;

        let startingEntity = 0;
        let allCompanies: any[] = []; // Store all companies data
        const numberOfEntities = 100; // Max number of companies per page

        while (true) {
            let qs: any = {
                "$top": numberOfEntities,         // Number of records per page
                "$skip": startingEntity,          // Skip based on starting entity
            };

            if ($filter) {
                qs.$filter = $filter;
            }
            if ($expand) {
                qs.$expand = $expand;
            }

            const endpoint = `https://portal.mobilefieldreport.com/odata/Companies`;
            const options = {
                method: 'GET',
                qs,
                headers: {},
                uri: endpoint,
                body: {},
                json: true,
                useQuerystring: true,
            } satisfies IRequestOptions;

            // Fetch the page data
            const responseData = await this.helpers.requestWithAuthentication.call(
                this,
                'mfrApi',
                options,
            );

            allCompanies = allCompanies.concat(responseData.value); // Add the current page results to the array

            // Check if we've reached or exceeded the limit
            if (allCompanies.length >= limit && !fetchAllResults) {
                allCompanies = allCompanies.slice(0, limit); // Trim to the limit and break out of the loop
                break;
            }

            // If fewer than 100 results were returned, we are done
            if (responseData.value.length < numberOfEntities) {
                break; // Exit the loop if there are no more pages
            }

            // Otherwise, move to the next batch of companies
            startingEntity += numberOfEntities;
        }

        // Return the accumulated companies data
        responseData = allCompanies;
    }
}


// create company
if (resource === 'company') {
	if (operation === 'createCompany') {
		{
			const name = this.getNodeParameter('name', i) as string;
			const Location = this.getNodeParameter('Location', i) as IDataObject;
			const SupportTelephone = this.getNodeParameter('SupportTelephone', i) as string;
			const SupportFax = this.getNodeParameter('SupportFax', i) as string;
			const SupportMail = this.getNodeParameter('SupportMail', i) as string;
			const Note = this.getNodeParameter('Note', i) as string;
			const ExternalId = this.getNodeParameter('ExternalId', i) as string;
			const IsPhysicalPerson = this.getNodeParameter('IsPhysicalPerson', i) as boolean;
			const MainContact = this.getNodeParameter('MainContact', i) as IDataObject;

			body.Name = name
			body.Location = Location
			body.SupportTelephone = SupportTelephone
			body.SupportFax = SupportFax
			body.SupportMail = SupportMail
			body.Note = Note
			body.ExternalId = ExternalId
			body.IsPhysicalPerson = IsPhysicalPerson
			body.MainContact = MainContact

			const endpoint = `https://portal.mobilefieldreport.com/odata/Companies`;
			const options = {
				method: 'POST',
				qs,
				headers: {},
				uri: endpoint,
				body,
				json: true,
				useQuerystring: true,
			} satisfies IRequestOptions;

			console.log(options)


		responseData = await this.helpers.requestWithAuthentication.call(
				this,
				'mfrApi',
				options,
		);}

	}
}


// create appointment
if (resource === 'appointment') {
	if (operation === 'createAppointment') {
		const ContactIdUI = this.getNodeParameter('ContactId', i) as IDataObject;
		let ContactId = ContactIdUI.value as string;
		const Type = this.getNodeParameter('Type', i) as string;

		const StartDateTime = this.getNodeParameter('StartDateTime', i) as string;
		const EndDateTime = this.getNodeParameter('EndDateTime', i) as string;


		body.Type = Type
		body.ContactId = ContactId
		body.StartDateTime = StartDateTime
		body.EndDateTime = EndDateTime

		const endpoint = `https://portal.mobilefieldreport.com/odata/Appointments`;
		const options = {
			method: 'POST',
			qs,
			headers: {},
			uri: endpoint,
			body,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// create item type
if (resource === 'itemType') {
	if (operation === 'createItemType') {

		const UnitId = this.getNodeParameter('UnitId', i) as string;
		const Type = this.getNodeParameter('Type', i) as string;
		const NameOrNumber = this.getNodeParameter('NameOrNumber', i) as string;
		const ExternalId = this.getNodeParameter('ExternalId', i) as string;
		const Costs = this.getNodeParameter('Costs', i) as string;
		const Price = this.getNodeParameter('Price', i) as string;
		const Manufacture = this.getNodeParameter('Manufacture', i) as string;
		const VAT = this.getNodeParameter('VAT', i) as string;
		const Description = this.getNodeParameter('Description', i) as string;
		const GlobalTradeItemNr = this.getNodeParameter('GlobalTradeItemNr', i) as string;

   body.UnitId = UnitId
	 body.Type = Type
	 body.NameOrNumber = NameOrNumber
	 body.ExternalId = ExternalId
	 body.Costs = Costs
	 body.Price = Price
	 body.Manufacture = Manufacture
	 body.VAT = VAT
	 body.Description = Description
	 body.GlobalTradeItemNr = GlobalTradeItemNr


		const endpoint = `https://portal.mobilefieldreport.com/odata/ItemTypes`;
		const options = {
			method: 'POST',
			qs,
			headers: {},
			uri: endpoint,
			body,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// create service object
if (resource === 'serviceObject') {
	if (operation === 'createServiceObject') {

		const Name = this.getNodeParameter('Name', i) as string;
		const Location = this.getNodeParameter('Location', i) as IDataObject;

		const companyUI = this.getNodeParameter('CompanyId', i) as IDataObject;
			let CompanyId = companyUI.value as string;

		const ExternalId = this.getNodeParameter('ExternalId', i) as string;

		body.Name = Name
		body.Location = Location
		body.CompanyId = CompanyId
		body.ExternalId = ExternalId



		const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceObjects`;
		const options = {
			method: 'POST',
			qs,
			headers: {},
			uri: endpoint,
			body,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// create service request
if (resource === 'serviceRequest') {
	if (operation === 'createServiceRequest') {

		const Name = this.getNodeParameter('Name', i) as string;
		body.Name = Name
    const ServiceObjects = this.getNodeParameter('ServiceObjects', i) as IDataObject;
		ServiceObjects ? body.ServiceObjects = ServiceObjects : ''

		const CreateFromServiceRequestTemplateId = this.getNodeParameter('CreateFromServiceRequestTemplateId', i) as string;
		body.CreateFromServiceRequestTemplateId = CreateFromServiceRequestTemplateId

		const State = this.getNodeParameter('State', i) as string;
		body.State = State

		const Description = this.getNodeParameter('Description', i) as string;
		body.Description = Description

		const CustomerIdUI = this.getNodeParameter('CustomerId', i) as IDataObject;
			let CustomerId = CustomerIdUI.value as string;
			body.CustomerId = CustomerId

		const Appointments = this.getNodeParameter('Appointments', i) as IDataObject;
		Appointments ? body.Appointments = Appointments : ''

		const ExternalId = this.getNodeParameter('ExternalId', i) as string;
		body.ExternalId = ExternalId

		// const TargetTimeInMinutes = this.getNodeParameter('TargetTimeInMinutes', i) as number;
		// body.TargetTimeInMinutes = TargetTimeInMinutes

		const DueDateRangeEnd = this.getNodeParameter('DueDateRangeEnd', i) as string;
		body.DueDateRangeEnd = DueDateRangeEnd

		const CostCenterId = this.getNodeParameter('CostCenterId', i) as string;
		CostCenterId ? body.CostCenterId = CostCenterId : ''


		const Qualifications = this.getNodeParameter('Qualifications', i) as string;
		Qualifications ? body.Qualifications = Qualifications : ''



		const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests`;
		const options = {
			method: 'POST',
			qs,
			headers: {},
			uri: endpoint,
			body,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// add tags to service request
if (resource === 'serviceRequest') {
	if (operation === 'addTagsToServiceRequest') {


		const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
		let ServiceRequest = ServiceRequestUI.value as string;


		const Tag = this.getNodeParameter('Tag', i) as string;

		body.url = `https://portal.mobilefieldreport.com/odata/Tags(${Tag}L)`

		const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${ServiceRequest}L)/$links/Tags`;
		const options = {
			method: 'PUT',
			uri: endpoint,
			body,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// Remove Tag From Service Request
if (resource === 'serviceRequest') {
	if (operation === 'removeTagFromServiceRequest') {


		const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
		let ServiceRequest = ServiceRequestUI.value as string;


		const Tag = this.getNodeParameter('Tag', i) as string;

		body.url = `https://portal.mobilefieldreport.com/odata/Tags(${Tag}L)`

		const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${ServiceRequest}L)/$links/Tags`;
		const options = {
			method: 'DELETE',
			uri: endpoint,
			body,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// delete service request
if (resource === 'serviceRequest') {
	if (operation === 'deleteServiceRequest') {

		const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
		let ServiceRequest = ServiceRequestUI.value as string;


		const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${ServiceRequest}L)`;
		const options = {
			method: 'DELETE',
			uri: endpoint,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// upload document
if (resource === 'document') {
	if (operation === 'uploadDocument') {

		let bodyUploadDocument: Buffer;


let filename = 'file';
let mimeType = 'application/octet-stream';

if (this.getNodeParameter('binaryData', i)) {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
	this.helpers.assertBinaryData(i, binaryPropertyName);

	const fileData = items[i].binary?.[binaryPropertyName];

	bodyUploadDocument = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

	if (fileData?.fileName) {
		filename = fileData.fileName;
	}
	if (fileData?.mimeType) {
		mimeType = fileData.mimeType;
	}
} else {
	bodyUploadDocument = Buffer.from(this.getNodeParameter('fileContent', i) as string, 'utf8');
	filename = 'file.txt';
	mimeType = 'text/plain';
}

const form = new FormData();
form.append('file', bodyUploadDocument, {
	filename,
	contentType: mimeType,
});
form.append('options', JSON.stringify({ filename }));


		const endpoint = `https://portal.mobilefieldreport.com/mfr/Document/UploadAndCreate`;
		const options = {
			method: 'POST',
			body: form,
      headers: form.getHeaders(),
			uri: endpoint,
			json: false,

		} satisfies IRequestOptions;

		console.log(options)


		const firstRequestResponse = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);

	console.log(firstRequestResponse)

	// responseData = await this.helpers.requestWithAuthentication.call(
	// 		this,
	// 		'mfrApi',
	// 		options,
	// );

}
}

// get item type
if (resource === 'itemType') {
	if (operation === 'getItemType') {

		let endpoint = ''

		 const idUI = this.getNodeParameter('id', i) as IDataObject;
		 const id = idUI.value
		 const ExternalId = this.getNodeParameter('ExternalId', i) as string;

		 id && !ExternalId? endpoint = `https://portal.mobilefieldreport.com/odata/ItemTypes(${id}L)` : endpoint = `https://portal.mobilefieldreport.com/odata/ItemTypes`
		 ExternalId ? qs.$filter = `ExternalId eq '${ExternalId}'` : '';


		const options = {
			method: 'GET',
			qs,
			headers: {},
			uri: endpoint,
			body,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// listItemTypes
if (resource === 'itemType') {
	if (operation === 'listItemTypes') {

		const limit = this.getNodeParameter('limit', i) as number;
		const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
		const $filter = this.getNodeParameter('$filter', i) as string;
		const $expand = this.getNodeParameter('$expand', i) as string;

		let startingEntity = 0;
		let allItems: any[] = [];
		const numberOfEntities = 100;

		while (true) {
			let qs: any = {
				"$top": numberOfEntities,
				"$skip": startingEntity,
			};
			if ($filter) qs.$filter = $filter;
			if ($expand) qs.$expand = $expand;

			const endpoint = 'https://portal.mobilefieldreport.com/odata/ItemTypes';

			const options = {
				method: 'GET',
				qs,
				uri: endpoint,
				json: true,
				useQuerystring: true,
			} satisfies IRequestOptions;

			console.log(options)

			const responseData = await this.helpers.requestWithAuthentication.call(
				this,
				'mfrApi',
				options,
			);

			allItems = allItems.concat(responseData.value);

			if (allItems.length >= limit && !fetchAllResults) {
				allItems = allItems.slice(0, limit);
				break;
			}

			if (responseData.value.length < numberOfEntities) {
				break;
			}

			startingEntity += numberOfEntities;
		}

		responseData = allItems;
	}
}

// getServiceObject
if (resource === 'serviceObject') {
	if (operation === 'getServiceObject') {

		let endpoint = ''

		 const idUI = this.getNodeParameter('id', i) as IDataObject;
		 const id = idUI.value
		 const ExternalId = this.getNodeParameter('ExternalId', i) as string;

		 id && !ExternalId? endpoint = `https://portal.mobilefieldreport.com/odata/ServiceObjects(${id}L)` : endpoint = `https://portal.mobilefieldreport.com/odata/ServiceObjects`
		 ExternalId ? qs.$filter = `ExternalId eq '${ExternalId}'` : '';


		const options = {
			method: 'GET',
			qs,
			uri: endpoint,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		console.log(options)

	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}




// end

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
