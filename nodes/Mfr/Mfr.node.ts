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
				const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean
        let startingEntity = 0;
        let allCompanies: any[] = []; // Store all companies data
        let numberOfEntities = 100; // Max number of companies per page

        while (true) {
            const endpoint = `https://portal.mobilefieldreport.com/odata/Companies`;
            const options = {
                method: 'GET',
                qs: {
                    "$top": numberOfEntities,         // Number of records per page
                    "$skip": startingEntity,          // Skip based on starting entity
                },
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
