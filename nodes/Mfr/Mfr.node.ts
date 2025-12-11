import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	INodeListSearchItems,
	INodeListSearchResult,
	ILoadOptionsFunctions,
	INodePropertyOptions
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { companyFields, companyOperations } from './descriptions/CompanyDescription';
import { appointmentFields, AppointmentOperations } from './descriptions/AppointmentDescription';
import { itemTypeFields, ItemTypeOperations } from './descriptions/ItemTypeDescription';
import { serviceObjectFields, ServiceObjectOperations } from './descriptions/ServiceObjectDescription';
import { serviceRequestFields, ServiceRequestOperations } from './descriptions/ServiceRequestDescription';
import { DocumentFields, DocumentOperations } from './descriptions/DocumentDescription';
import { UserFields, UserOperations } from './descriptions/UserDescription';
import { ReportFields, ReportOperations } from './descriptions/ReportDescription';
import { mfrApiRequest } from './GenericFunctions';
import { contactFields, contactOperations } from './descriptions/ContactDescription';

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
			}
		],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionTypes.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionTypes.Main],

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
						name: 'Contact',
						value: 'contact',
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
				]
			},

			// COMPANY
			...companyOperations,
			...companyFields,

			// CONTACT
			...contactOperations,
			...contactFields,

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
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);

				for (const itemUnit of response.value) {
					returnData.push({
						name: itemUnit.Name,
						value: itemUnit.Id,
					});
				}

				return returnData;
			},

			async getServiceRequestsTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests`;
				const qs = {
					$filter: 'IsTemplate eq true'
				};
				const options = {
					method: 'GET',
					qs: qs,
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);

				for (const template of response.value) {
					returnData.push({
						name: 'Name: ' + template.Name + '; External ID: ' + template.ExternalId,
						value: template.Id,
					});
				}

				returnData.push({
					name: 'empty',
					value: '',
				});

				return returnData;
			},

			async getCostCenter(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = `https://portal.mobilefieldreport.com/odata/CostCenters`;
				const options = {
					method: 'GET',
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);

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
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);

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
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);

				for (const item of response.value) {
					returnData.push({
						name: item.Name || item.Id,
						value: item.Id,
					});
				}

				return returnData;
			},

			async getServiceObjectLoadOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceObjects`;

				let startingEntity = 0;
				let allServiceObjects: any[] = [];
				const numberOfEntities = 20;

				while (true) {
					const qs = {
						"$top": numberOfEntities,
						"$skip": startingEntity
					};

					const options = {
						method: 'GET',
						qs,
						url: endpoint,
						json: true,
					} satisfies IHttpRequestOptions;

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);

					allServiceObjects = allServiceObjects.concat(response.value);

					if (response.value.length < numberOfEntities) {
						break;
					}

					startingEntity += response.value.length;
				}

				for (const item of allServiceObjects) {
					returnData.push({
						name: item.Name || item.ExternalId,
						value: item.Id,
					});
				}

				return returnData;
			},

			async getContactsLoadOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const endpoint = `https://portal.mobilefieldreport.com/odata/Contacts`;

				let startingEntity = 0;
				let allContacts: any[] = [];
				const numberOfEntities = 20;

				while (true) {
					const qs = {
						"$top": numberOfEntities,
						"$skip": startingEntity
					};

					const options = {
						method: 'GET',
						qs,
						url: endpoint,
						json: true,
					} satisfies IHttpRequestOptions;

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);

					allContacts = allContacts.concat(response.value);

					if (response.value.length < numberOfEntities) {
						break;
					}

					startingEntity += response.value.length;
				}

				for (const item of allContacts) {
					returnData.push({
						name: item.Email,
						value: item.Id,
					});
				}

				return returnData;
			}
		},

		listSearch: {
			async searchCompanies(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/Companies';
				const qs: IDataObject = {};
				const options = {
					method: 'GET',
					qs,
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const searchResults = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);

				const results: INodeListSearchItems[] = searchResults.value
					.map((company: any) => ({
						name: company.Name,
						value: company.Id,
					}))
					.filter(
						(company: { name: string; value: { toString: () => string } }) =>
							!filter ||
							company.name.toLowerCase().includes(filter.toLowerCase()) ||
							company.value?.toString() === filter
					);

				return { results };
			},

			async searchContacts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/Contacts';
				const qs: IDataObject = {};
				const options = {
					method: 'GET',
					qs,
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const searchResults = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'mfrApi',
					options,
				);

				const results: INodeListSearchItems[] = searchResults.value
					.map((contact: any) => ({
						name: contact.Email || contact.Id,
						value: contact.Id,
					}))
					.filter(
						(contact: { name: string; value: { toString: () => string } }) =>
							!filter ||
							contact.name.toLowerCase().includes(filter.toLowerCase()) ||
							contact.value?.toString() === filter
					);

				return { results };
			},

			async searchServiceRequest(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceRequests';
				const options = {
					method: 'GET',
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const searchResults = await this.helpers.httpRequestWithAuthentication.call(
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
						(el: { name: string; value: { toString: () => string } }) =>
							!filter ||
							el.name.toLowerCase().includes(filter.toLowerCase()) ||
							el.value?.toString() === filter
					);

				return { results };
			},

			async getItemTypes(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/ItemTypes';
				const options = {
					method: 'GET',
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const searchResults = await this.helpers.httpRequestWithAuthentication.call(
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
						(el: { name: string; value: { toString: () => string } }) =>
							!filter ||
							el.name.includes(filter) ||
							el.value?.toString() === filter
					);

				return { results };
			},

			async getServiceObject(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceObjects';
				const options = {
					method: 'GET',
					url: endpoint,
					json: true,
				} satisfies IHttpRequestOptions;

				const searchResults = await this.helpers.httpRequestWithAuthentication.call(
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
						(el: { name: string; value: { toString: () => string } }) =>
							!filter ||
							el.name.toLowerCase().includes(filter.toLowerCase()) ||
							el.value?.toString() === filter
					);

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
			try {
				// ==================== COMPANY ====================

				// get company
				if (resource === 'company' && operation === 'get') {
					const companyUI = this.getNodeParameter('companyId', i) as IDataObject;
					const companyId = companyUI.value as string;

					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const $expandUI = additionalFields.$expand as string[] | undefined;

					if ($expandUI?.length) {
						qs.$expand = $expandUI.join(',');
					}

					const endpoint = `https://portal.mobilefieldreport.com/odata/Companies(${companyId}L)`;
					const options = {
						method: 'GET',
						qs,
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// list companies with pagination
				if (resource === 'company' && operation === 'listCompanies') {
					const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const limit = (additionalFields.limit as number) || 50;
					const $filter = additionalFields.$filter as string | undefined;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					let startingEntity = 0;
					let allCompanies: any[] = [];
					const numberOfEntities = 20;

					while (true) {
						const qs: IDataObject = {
							"$top": numberOfEntities,
							"$skip": startingEntity,
						};

						if ($filter) {
							qs.$filter = $filter;
						}
						if ($expandUI?.length) {
							qs.$expand = $expandUI.join(',');
						}

						const endpoint = `https://portal.mobilefieldreport.com/odata/Companies`;
						const options = {
							method: 'GET',
							qs,
							headers: {},
							url: endpoint,
							body: {},
							json: true,
						} satisfies IHttpRequestOptions;

						console.log('OPTIONS:', options);

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							options,
						);

						allCompanies = allCompanies.concat(response.value);

						if (allCompanies.length >= limit && !fetchAllResults) {
							allCompanies = allCompanies.slice(0, limit);
							break;
						}

						if (response.value.length < numberOfEntities) {
							break;
						}

						startingEntity += response.value.length;
					}

					responseData = allCompanies;
				}

				// create company
				if (resource === 'company' && operation === 'createCompany') {
					const Name = this.getNodeParameter('Name', i) as string;
					const Location = this.getNodeParameter('Location', i) as IDataObject;
					const MainContact = this.getNodeParameter('MainContact', i) as IDataObject;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};

					if (Name) body.Name = Name;
					if (Location && Object.keys(Location).length > 0) body.Location = Location;
					if (MainContact && Object.keys(MainContact).length > 0) body.MainContact = MainContact;

					// Additional fields
					if (additionalFields.SupportTelephone) body.SupportTelephone = additionalFields.SupportTelephone;
					if (additionalFields.SupportFax) body.SupportFax = additionalFields.SupportFax;
					if (additionalFields.SupportMail) body.SupportMail = additionalFields.SupportMail;
					if (additionalFields.Note) body.Note = additionalFields.Note;
					if (additionalFields.ExternalId) body.ExternalId = additionalFields.ExternalId;
					if (additionalFields.IsPhysicalPerson !== undefined) body.IsPhysicalPerson = additionalFields.IsPhysicalPerson;

					const endpoint = `https://portal.mobilefieldreport.com/odata/Companies`;
					const options = {
						method: 'POST',
						qs,
						headers: {},
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// ==================== CONTACT ====================

				// list contacts with pagination
				if (resource === 'contact' && operation === 'listContacts') {
					const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const limit = (additionalFields.limit as number) || 50;
					const $filter = additionalFields.$filter as string | undefined;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					let startingEntity = 0;
					let allContacts: any[] = [];
					const numberOfEntities = 20;

					while (true) {
						const qs: any = {
							"$top": numberOfEntities,
							"$skip": startingEntity,
						};

						if ($filter) {
							qs.$filter = $filter;
						}
						if ($expandUI?.length) {
							qs.$expand = $expandUI.join(",");
						}

						const endpoint = `https://portal.mobilefieldreport.com/odata/Contacts`;
						const options = {
							method: 'GET',
							qs,
							headers: {},
							url: endpoint,
							body: {},
							json: true,
						} satisfies IHttpRequestOptions;

						console.log('OPTIONS:', options);

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							options,
						);

						allContacts = allContacts.concat(response.value);

						if (allContacts.length >= limit && !fetchAllResults) {
							allContacts = allContacts.slice(0, limit);
							break;
						}

						if (response.value.length < numberOfEntities) {
							break;
						}

						startingEntity += response.value.length;
					}

					responseData = allContacts;
				}

				// ==================== APPOINTMENT ====================

				// create appointment
				if (resource === 'appointment' && operation === 'createAppointment') {
					const ContactIdUI = this.getNodeParameter('ContactId', i) as IDataObject;
					const ContactId = ContactIdUI.value as string;
					const StartDateTime = this.getNodeParameter('StartDateTime', i) as string;
					const EndDateTime = this.getNodeParameter('EndDateTime', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};

					if (ContactId) body.ContactId = ContactId;
					if (StartDateTime) body.StartDateTime = StartDateTime;
					if (EndDateTime) body.EndDateTime = EndDateTime;
					if (additionalFields.Type) body.Type = additionalFields.Type;

					const endpoint = `https://portal.mobilefieldreport.com/odata/Appointments`;
					const options = {
						method: 'POST',
						qs,
						headers: {},
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// ==================== ITEM TYPE ====================

				// create item type
				if (resource === 'itemType' && operation === 'createItemType') {
					const NameOrNumber = this.getNodeParameter('NameOrNumber', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};

					if (NameOrNumber) body.NameOrNumber = NameOrNumber;

					// Additional fields
					if (additionalFields.UnitId) body.UnitId = additionalFields.UnitId;
					if (additionalFields.Type) body.Type = additionalFields.Type;
					if (additionalFields.ExternalId) body.ExternalId = additionalFields.ExternalId;
					if (additionalFields.Costs) body.Costs = additionalFields.Costs;
					if (additionalFields.Price) body.Price = additionalFields.Price;
					if (additionalFields.Manufacture) body.Manufacture = additionalFields.Manufacture;
					if (additionalFields.VAT) body.VAT = additionalFields.VAT;
					if (additionalFields.Description) body.Description = additionalFields.Description;
					if (additionalFields.GlobalTradeItemNr) body.GlobalTradeItemNr = additionalFields.GlobalTradeItemNr;

					const endpoint = `https://portal.mobilefieldreport.com/odata/ItemTypes`;
					const options = {
						method: 'POST',
						qs,
						headers: {},
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// get item type
				if (resource === 'itemType' && operation === 'getItemType') {
					let endpoint = '';
					const idUI = this.getNodeParameter('id', i) as IDataObject;
					const id = idUI.value;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const ExternalId = additionalFields.ExternalId as string;

					if (id && !ExternalId) {
						endpoint = `https://portal.mobilefieldreport.com/odata/ItemTypes(${id}L)`;
					} else {
						endpoint = `https://portal.mobilefieldreport.com/odata/ItemTypes`;
						if (ExternalId) qs.$filter = `ExternalId eq '${ExternalId}'`;
					}

					const options = {
						method: 'GET',
						qs,
						headers: {},
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// list item types
				if (resource === 'itemType' && operation === 'listItemTypes') {
					const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const limit = (additionalFields.limit as number) || 50;
					const $filter = additionalFields.$filter as string | undefined;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					let startingEntity = 0;
					let allItems: any[] = [];
					const numberOfEntities = 5;

					while (true) {
						const qs: any = {
							"$top": numberOfEntities,
							"$skip": startingEntity,
						};
						if ($filter) qs.$filter = $filter;
						if ($expandUI?.length) qs.$expand = $expandUI.join(",");

						const endpoint = 'https://portal.mobilefieldreport.com/odata/ItemTypes';
						const options = {
							method: 'GET',
							qs,
							url: endpoint,
							json: true,
						} satisfies IHttpRequestOptions;

						console.log('OPTIONS:', options);

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							options,
						);

						allItems = allItems.concat(response.value);

						if (allItems.length >= limit && !fetchAllResults) {
							allItems = allItems.slice(0, limit);
							break;
						}

						if (response.value.length < numberOfEntities) {
							break;
						}

						startingEntity += response.value.length;
					}

					responseData = allItems;
				}

				// ==================== SERVICE OBJECT ====================

				// create service object
if (resource === 'serviceObject' && operation === 'createServiceObject') {
	const Name = this.getNodeParameter('Name', i) as string;
	const Location = this.getNodeParameter('Location', i) as IDataObject;
	const companyUI = this.getNodeParameter('CompanyId', i) as IDataObject;
	const CompanyId = companyUI.value as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};

	if (Name) body.Name = Name;
	if (Location) body.Location = Location;
	if (CompanyId) body.CompanyId = CompanyId;
	if (additionalFields.ExternalId) body.ExternalId = additionalFields.ExternalId;

	const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceObjects`;
	const options = {
		method: 'POST',
		qs,
		headers: {},
		url: endpoint,
		body,
		json: true,
	} satisfies IHttpRequestOptions;

	console.log('OPTIONS:', options);

	responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'mfrApi',
		options,
	);
}

				// get service object
				if (resource === 'serviceObject' && operation === 'getServiceObject') {
					let endpoint = '';
					const idUI = this.getNodeParameter('id', i) as IDataObject;
					const id = idUI.value;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const ExternalId = additionalFields.ExternalId as string;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					if (id && !ExternalId) {
						endpoint = `https://portal.mobilefieldreport.com/odata/ServiceObjects(${id}L)`;
					} else {
						endpoint = `https://portal.mobilefieldreport.com/odata/ServiceObjects`;
						if (ExternalId) qs.$filter = `ExternalId eq '${ExternalId}'`;
					}

					if ($expandUI?.length) qs.$expand = $expandUI.join(",");

					const options = {
						method: 'GET',
						qs,
						url: endpoint,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// list service objects
				if (resource === 'serviceObject' && operation === 'listServiceObjects') {
					const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const limit = (additionalFields.limit as number) || 50;
					const $filter = additionalFields.$filter as string | undefined;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					let startingEntity = 0;
					let allItems: any[] = [];
					const numberOfEntities = 5;

					while (true) {
						const qs: any = {
							"$top": numberOfEntities,
							"$skip": startingEntity,
						};
						if ($filter) qs.$filter = $filter;
						if ($expandUI?.length) qs.$expand = $expandUI.join(",");

						const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceObjects';
						const options = {
							method: 'GET',
							qs,
							url: endpoint,
							json: true,
						} satisfies IHttpRequestOptions;

						console.log('OPTIONS:', options);

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							options,
						);

						allItems = allItems.concat(response.value);

						if (allItems.length >= limit && !fetchAllResults) {
							allItems = allItems.slice(0, limit);
							break;
						}

						if (response.value.length < numberOfEntities) {
							break;
						}

						startingEntity += response.value.length;
					}

					responseData = allItems;
				}

				// ==================== SERVICE REQUEST ====================

				// create service request
				if (resource === 'serviceRequest' && operation === 'createServiceRequest') {
					const Name = this.getNodeParameter('Name', i) as string;
					if (Name) body.Name = Name;

					const useJsonServiceObjects = this.getNodeParameter('useJsonServiceObjects', i) as boolean;
					if (useJsonServiceObjects) {
						const ServiceObjects = this.getNodeParameter('ServiceObjects', i) as string;
						if (ServiceObjects) body.ServiceObjects = JSON.parse(ServiceObjects);
					} else {
						const ServiceObjectUI = this.getNodeParameter('ServiceObjectsUi', i) as IDataObject;
						const ServiceObjects = ServiceObjectUI.value as IDataObject;
						if (ServiceObjects) body.ServiceObjects = ServiceObjects;
					}

					const useJsonAppointments = this.getNodeParameter('useJsonAppointments', i) as boolean;
					if (useJsonAppointments) {
						const Appointments = this.getNodeParameter('Appointments', i) as string;
						if (Appointments) body.Appointments = JSON.parse(Appointments);
					} else {
						const AppointmentsUI = this.getNodeParameter('AppointmentsUI', i) as IDataObject;
						const Appointments = AppointmentsUI.value as IDataObject;
						if (Appointments) body.Appointments = Appointments;
					}

					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};

					if (additionalFields.CreateFromServiceRequestTemplateId) {
						body.CreateFromServiceRequestTemplateId = additionalFields.CreateFromServiceRequestTemplateId;
					}
					if (additionalFields.State) body.State = additionalFields.State;
					if (additionalFields.Description) body.Description = additionalFields.Description;

					const CustomerIdUI = additionalFields.CustomerId as IDataObject | undefined;
					if (CustomerIdUI?.value) body.CustomerId = CustomerIdUI.value;

					if (additionalFields.ExternalId) body.ExternalId = additionalFields.ExternalId;
					if (additionalFields.TargetTimeInMinutes) body.TargetTimeInMinutes = additionalFields.TargetTimeInMinutes;
					if (additionalFields.DueDateRangeEnd) body.DueDateRangeEnd = additionalFields.DueDateRangeEnd;
					if (additionalFields.CostCenterId) body.CostCenterId = additionalFields.CostCenterId;
					if (additionalFields.Qualifications) body.Qualifications = additionalFields.Qualifications;

					const endpoint = `https://portal.mobilefieldreport.com/mfr/ServiceRequest/Deep`;
					const options = {
						method: 'POST',
						qs,
						headers: {},
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// add tags to service request
				if (resource === 'serviceRequest' && operation === 'addTagsToServiceRequest') {
					const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
					const ServiceRequest = ServiceRequestUI.value as string;
					const Tag = this.getNodeParameter('Tag', i) as string;

					body.url = `https://portal.mobilefieldreport.com/odata/Tags(${Tag}L)`;

					const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${ServiceRequest}L)/$links/Tags`;
					const options = {
						method: 'PUT',
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// remove tag from service request
				if (resource === 'serviceRequest' && operation === 'removeTagFromServiceRequest') {
					const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
					const ServiceRequest = ServiceRequestUI.value as string;
					const Tag = this.getNodeParameter('Tag', i) as string;

					body.url = `https://portal.mobilefieldreport.com/odata/Tags(${Tag}L)`;

					const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${ServiceRequest}L)/$links/Tags`;
					const options = {
						method: 'DELETE',
						url: endpoint,
						body,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// delete service request
				if (resource === 'serviceRequest' && operation === 'deleteServiceRequest') {
					const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
					const ServiceRequest = ServiceRequestUI.value as string;

					const endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${ServiceRequest}L)`;
					const options = {
						method: 'DELETE',
						url: endpoint,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// get service request
				if (resource === 'serviceRequest' && operation === 'getServiceRequest') {
					let endpoint = '';
					const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
					const id = ServiceRequestUI.value;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const ExternalId = additionalFields.ExternalId as string;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					if (id && !ExternalId) {
						endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests(${id}L)`;
					} else {
						endpoint = `https://portal.mobilefieldreport.com/odata/ServiceRequests`;
						if (ExternalId) qs.$filter = `ExternalId eq '${ExternalId}'`;
					}

					if ($expandUI?.length) qs.$expand = $expandUI.join(",");

					const options = {
						method: 'GET',
						qs,
						url: endpoint,
						json: true,
					} satisfies IHttpRequestOptions;

					console.log('OPTIONS:', options);

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mfrApi',
						options,
					);
				}

				// list service requests
				if (resource === 'serviceRequest' && operation === 'listServiceRequests') {
					const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const limit = (additionalFields.limit as number) || 50;
					const $filter = additionalFields.$filter as string | undefined;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					let startingEntity = 0;
					let allItems: any[] = [];
					const numberOfEntities = 5;

					while (true) {
						const qs: any = {
							"$top": numberOfEntities,
							"$skip": startingEntity,
						};
						if ($filter) qs.$filter = $filter;
						if ($expandUI?.length) qs.$expand = $expandUI.join(",");

						const endpoint = 'https://portal.mobilefieldreport.com/odata/ServiceRequests';
						const options = {
							method: 'GET',
							qs,
							url: endpoint,
							json: true,
						} satisfies IHttpRequestOptions;

						console.log('OPTIONS:', options);

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							options,
						);

						allItems = allItems.concat(response.value);

						if (allItems.length >= limit && !fetchAllResults) {
							allItems = allItems.slice(0, limit);
							break;
						}

						if (response.value.length < numberOfEntities) {
							break;
						}

						startingEntity += response.value.length;
					}

					responseData = allItems;
				}

				// ==================== DOCUMENT ====================

				// upload document
if (resource === 'document' && operation === 'uploadDocument') {
	const ServiceRequestUI = this.getNodeParameter('ServiceRequest', i) as IDataObject;
	const serviceRequestId = ServiceRequestUI.value;
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

	this.helpers.assertBinaryData(i, binaryPropertyName);
	const fileData = items[i].binary?.[binaryPropertyName];
	const bodyUploadDocument = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
	const filename = fileData?.fileName || 'file';
	const mimeType = fileData?.mimeType || 'application/octet-stream';

	type BinaryBuffer = Uint8Array & { readonly length: number };
	const MULTIPART_NEWLINE = '\r\n';

	function buildMultipartPayload(options: {
		fieldName: string;
		filename: string;
		contentType: string;
		data: BinaryBuffer;
	}) {
		const boundary = `----n8nLaunix${Date.now().toString(16)}${Math.random()
			.toString(16)
			.slice(2)}`;
		const safeFieldName = encodeURIComponent(options.fieldName);
		const safeFileName = encodeURIComponent(options.filename);
		const header = Buffer.from(
			`--${boundary}${MULTIPART_NEWLINE}` +
			`Content-Disposition: form-data; name="${safeFieldName}"; filename="${safeFileName}"${MULTIPART_NEWLINE}` +
			`Content-Type: ${options.contentType}${MULTIPART_NEWLINE}${MULTIPART_NEWLINE}`,
			'utf8',
		);
		const footer = Buffer.from(
			`${MULTIPART_NEWLINE}--${boundary}--${MULTIPART_NEWLINE}`,
			'utf8',
		);
		return {
			boundary,
			body: Buffer.concat([header, options.data, footer]),
		};
	}

	const payload = buildMultipartPayload({
		fieldName: 'file',
		filename,
		contentType: mimeType,
		data: bodyUploadDocument as unknown as BinaryBuffer,
	});

	const endpoint = `https://portal.mobilefieldreport.com/mfr/Document/UploadAndCreate`;
	const options: IHttpRequestOptions = {
		method: 'POST',
		url: endpoint,
		body: payload.body,
		headers: {
			'Content-Type': `multipart/form-data; boundary=${payload.boundary}`,
		},
		json: false,
	};

	responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'mfrApi',
		options,
	);

	if (typeof responseData === 'string') {
		responseData = JSON.parse(responseData);
	}

	const documentId = responseData.DocumentDto.Id;
	const uri = `https://portal.mobilefieldreport.com/mfr/ServiceRequest/${serviceRequestId}/Document/${documentId}`;
	await mfrApiRequest.call(this, 'PUT', '', {}, {}, uri);
}

				// ==================== USER ====================

				// list users
				if (resource === 'user' && operation === 'listUsers') {
					const fetchAllResults = this.getNodeParameter('fetchAllResults', i) as boolean;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject ?? {};
					const limit = (additionalFields.limit as number) || 50;
					const $filter = additionalFields.$filter as string | undefined;
					const $expandUI = additionalFields.$expand as string[] | undefined;

					let startingEntity = 0;
					let allItems: any[] = [];
					const numberOfEntities = 5;

					while (true) {
						const qs: any = {
							"$top": numberOfEntities,
							"$skip": startingEntity,
						};
						if ($filter) qs.$filter = $filter;
						if ($expandUI?.length) qs.$expand = $expandUI.join(",");

						const endpoint = 'https://portal.mobilefieldreport.com/odata/Users';
						const options = {
							method: 'GET',
							qs,
							url: endpoint,
							json: true,
						} satisfies IHttpRequestOptions;

						console.log('OPTIONS:', options);

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							options,
						);

						allItems = allItems.concat(response.value);

						if (allItems.length >= limit && !fetchAllResults) {
							allItems = allItems.slice(0, limit);
							break;
						}

						if (response.value.length < numberOfEntities) {
							break;
						}

						startingEntity += response.value.length;
					}

					responseData = allItems;
				}

				// ==================== REPORT ====================

				// generate report from report definition
				if (resource === 'report' && operation === 'generateReportFromReportDefinition') {
					const returnItems: INodeExecutionData[] = [];

					for (let j = 0; j < items.length; j++) {
						const endpoint = `https://portal.mobilefieldreport.com/mfr/Report`;
						const ServiceRequestUI = this.getNodeParameter('ServiceRequest', j) as IDataObject;
						const ServiceRequestId = ServiceRequestUI.value;
						const ReportDefinitionCode = this.getNodeParameter('ReportDefinitionCode', j) as string;

						const reportBody = {
							ServiceRequestId,
							ReportDefinitionCode,
							IsInvoice: false,
						};

						const optionsFirstRequest = {
							method: 'POST',
							body: reportBody,
							qs,
							url: endpoint,
							json: true,
						} satisfies IHttpRequestOptions;

						const responseDataFirstRequest = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							optionsFirstRequest,
						);

						const ReportDtourl = responseDataFirstRequest.ReportDto.URI;
						const DocumentName = responseDataFirstRequest.ReportDto.DocumentName;

						const optionsSecondRequest = {
							method: 'GET',
							url: ReportDtourl,
							encoding: 'arraybuffer',
						} satisfies IHttpRequestOptions;

						const pdfResponse = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'mfrApi',
							optionsSecondRequest,
						);

						let pdfBuffer: Buffer;

						if (Buffer.isBuffer(pdfResponse)) {
							pdfBuffer = pdfResponse;
						} else if (pdfResponse instanceof ArrayBuffer) {
							pdfBuffer = Buffer.from(pdfResponse);
						} else if (typeof pdfResponse === 'string') {
							pdfBuffer = Buffer.from(pdfResponse, 'latin1');
						} else {
							pdfBuffer = Buffer.from(pdfResponse);
						}

						const binaryData = await this.helpers.prepareBinaryData(
							pdfBuffer,
							DocumentName,
							'application/pdf',
						);

						const newItem: INodeExecutionData = {
							json: items[j].json,
							binary: {
								file: binaryData,
							}
						};

						returnItems.push(newItem);
					}

					return [returnItems];
				}

				// Build execution data
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
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
