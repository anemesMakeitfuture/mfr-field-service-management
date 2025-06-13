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
import { UserFields, UserOperations} from './descriptions/UserDescription';
import { ReportFields, ReportOperations} from './descriptions/ReportDescription';
import { mfrApiRequest } from './GenericFunctions';

import { Buffer } from 'buffer';

export class Mfr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'mfr - Field Service Management',
		name: 'mfr',
		group: ['transform'],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:mfrLogo.png',
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Field service management app for scheduling technicians.',
		defaults: {
			name: 'mfr - Field Service Management',
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
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Report',
						value: 'report',
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

			// User
			...UserOperations,
			...UserFields,

			// Report
			...ReportOperations,
			...ReportFields,
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
	//	let returnItems: INodeExecutionData[] = [];
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

			const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];
			$expandUI[0] ? qs.$expand = $expandUI.join(",") : "";

			const endpoint = `https://portal.mobilefieldreport.com/odata/Companies(${companyId}L)`;
			const options = {
				method: 'GET',
				qs,
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

				const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];

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
            if ($expandUI[0]) {
                qs.$expand = $expandUI.join(",");
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
			const Name = this.getNodeParameter('Name', i) as string;
			const Location = this.getNodeParameter('Location', i) as IDataObject;
			const SupportTelephone = this.getNodeParameter('SupportTelephone', i) as string;
			const SupportFax = this.getNodeParameter('SupportFax', i) as string;
			const SupportMail = this.getNodeParameter('SupportMail', i) as string;
			const Note = this.getNodeParameter('Note', i) as string;
			const ExternalId = this.getNodeParameter('ExternalId', i) as string;
			const IsPhysicalPerson = this.getNodeParameter('IsPhysicalPerson', i) as boolean;
			const MainContact = this.getNodeParameter('MainContact', i) as IDataObject;

			body.Name = Name
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



	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// upload document
if (resource === 'document' && operation === 'uploadDocument') {

  let bodyUploadDocument: Buffer;
  let filename = 'file';
  let mimeType = 'application/octet-stream';

	 const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
	 const serviceRequestId = ServiceRequestUI.value

  // —— preserve your existing binary/text logic ——
  if (this.getNodeParameter('binaryData', i)) {
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
    this.helpers.assertBinaryData(i, binaryPropertyName);
    const fileData = items[i].binary?.[binaryPropertyName];
    bodyUploadDocument = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
    if (fileData?.fileName) filename = fileData.fileName;
    if (fileData?.mimeType) mimeType = fileData.mimeType;
  } else {
    bodyUploadDocument = Buffer.from(this.getNodeParameter('fileContent', i) as string, 'utf8');
    filename = 'file.txt';
    mimeType = 'text/plain';
  }
  // —— end preserved logic ——

  const endpoint = `https://portal.mobilefieldreport.com/mfr/Document/UploadAndCreate`;

  const options = {
    method: 'POST',
    uri: endpoint,
    formData: {
      // this will be sent as a true file part
      file: {
        value: bodyUploadDocument,
        options: {
          filename,
          contentType: mimeType,
        },
      },
      // additional JSON part
      options: JSON.stringify({ filename }),
    },
    json: false,
  } satisfies IRequestOptions;


  responseData = await this.helpers.requestWithAuthentication.call(
    this,
    'mfrApi',
    options,
  );

 responseData = JSON.parse(responseData);

 const documentId = responseData.DocumentDto.Id;



	const uri = `https://portal.mobilefieldreport.com/mfr/ServiceRequest/${serviceRequestId}/Document/${documentId}`


	await mfrApiRequest.call(this, 'PUT', '', {}, {}, uri);


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

		 const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];


		let startingEntity = 0;
		let allItems: any[] = [];
		const numberOfEntities = 100;

		while (true) {
			let qs: any = {
				"$top": numberOfEntities,
				"$skip": startingEntity,
			};
			if ($filter) qs.$filter = $filter;
			if ($expandUI[0]) qs.$expand = $expandUI.join(",");

			const endpoint = 'https://portal.mobilefieldreport.com/odata/ItemTypes';

			const options = {
				method: 'GET',
				qs,
				uri: endpoint,
				json: true,
				useQuerystring: true,
			} satisfies IRequestOptions;



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

		 const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];
		 $expandUI[0] ? qs.$expand = $expandUI.join(",") : "";


		const options = {
			method: 'GET',
			qs,
			uri: endpoint,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;



	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

// listServiceObjects
if (resource === 'serviceObject') {
	if (operation === 'listServiceObjects') {

		const limit = this.getNodeParameter('limit', i) as number;
		const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
		const $filter = this.getNodeParameter('$filter', i) as string;

		 const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];


		let startingEntity = 0;
		let allItems: any[] = [];
		const numberOfEntities = 100;

		while (true) {
			let qs: any = {
				"$top": numberOfEntities,
				"$skip": startingEntity,
			};
			if ($filter) qs.$filter = $filter;
			if ($expandUI[0]) qs.$expand = $expandUI.join(",");

			const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceObjects';

			const options = {
				method: 'GET',
				qs,
				uri: endpoint,
				json: true,
				useQuerystring: true,
			} satisfies IRequestOptions;



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

// listServiceRequests
if (resource === 'serviceRequest') {
	if (operation === 'listServiceRequests') {

		const limit = this.getNodeParameter('limit', i) as number;
		const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
		const $filter = this.getNodeParameter('$filter', i) as string;

		 const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];


		let startingEntity = 0;
		let allItems: any[] = [];
		const numberOfEntities = 100;

		while (true) {
			let qs: any = {
				"$top": numberOfEntities,
				"$skip": startingEntity,
			};
			if ($filter) qs.$filter = $filter;
			if ($expandUI[0]) qs.$expand = $expandUI.join(",");

			const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceRequests';

			const options = {
				method: 'GET',
				qs,
				uri: endpoint,
				json: true,
				useQuerystring: true,
			} satisfies IRequestOptions;



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

// listUsers
if (resource === 'user') {
	if (operation === 'listUsers') {

		const limit = this.getNodeParameter('limit', i) as number;
		const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
		const $filter = this.getNodeParameter('$filter', i) as string;

		 const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];


		let startingEntity = 0;
		let allItems: any[] = [];
		const numberOfEntities = 100;

		while (true) {
			let qs: any = {
				"$top": numberOfEntities,
				"$skip": startingEntity,
			};
			if ($filter) qs.$filter = $filter;
			if ($expandUI[0]) qs.$expand = $expandUI.join(",");

			const endpoint = 'https://portal.mobilefieldreport.com/odata/Users';

			const options = {
				method: 'GET',
				qs,
				uri: endpoint,
				json: true,
				useQuerystring: true,
			} satisfies IRequestOptions;



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


// getServiceRequest
if (resource === 'serviceRequest') {
	if (operation === 'getServiceRequest') {

		let endpoint = ''

		 const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
		 const id = ServiceRequestUI.value
		 const ExternalId = this.getNodeParameter('ExternalId', i) as string;

		 id && !ExternalId? endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${id}L)` : endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests`
		 ExternalId ? qs.$filter = `ExternalId eq '${ExternalId}'` : '';

		 const $expandUI = this.getNodeParameter('$expand', i) as IDataObject[];
		 $expandUI[0] ? qs.$expand = $expandUI.join(",") : "";


		const options = {
			method: 'GET',
			qs,
			uri: endpoint,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;



	responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			options,
	);}
}

if (resource === 'report' && operation === 'generateReportFromReportDefinition') {
	const returnItems: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		let endpoint = `https://portal.mobilefieldreport.com/mfr/Report`;

		const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
		const ServiceRequestId = ServiceRequestUI.value;
		const ReportDefinitionCode = this.getNodeParameter('ReportDefinitionCode', i) as string;

		const body = {

			ServiceRequestId,
			ReportDefinitionCode,
			IsInvoice: false,
		};

		const optionsFirstRequest = {
			method: 'POST',
			body,
			qs,
			uri: endpoint,
			json: true,
			useQuerystring: true,
		} satisfies IRequestOptions;

		const responseDataFirstRequest = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			optionsFirstRequest,
		);

		const ReportDtoUri = responseDataFirstRequest.ReportDto.URI;
		const DocumentName = responseDataFirstRequest.ReportDto.DocumentName;

		const optionsSecondRequest = {
			method: 'GET',
			uri: ReportDtoUri,
			json: false,
			encoding: null,
		} satisfies IRequestOptions;

		const pdfBuffer = await this.helpers.requestWithAuthentication.call(
			this,
			'mfrApi',
			optionsSecondRequest,
		);

		const binaryData = await this.helpers.prepareBinaryData.call(
			this,
			pdfBuffer,
			DocumentName,
		);

		const newItem: INodeExecutionData = {
			json: items[i].json,
			binary: {
				file: binaryData,
			},
			pairedItem: { item: i },
		};

		returnItems.push(newItem);
	}

	return [returnItems];
}

// end

if(resource !== 'report' && operation !== 'generateReportFromReportDefinition'){
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);
}

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
