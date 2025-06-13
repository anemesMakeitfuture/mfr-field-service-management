import { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IRequestOptions, JsonObject, NodeApiError } from "n8n-workflow";

export async function mfrApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {

	const options = {
		method,
		qs: query,
		headers: {},
		uri: uri || `https://portal.mobilefieldreport.com/odata${endpoint}`,
		body,
		json: true,
		useQuerystring: true,
	} satisfies IRequestOptions;


	try {

		return await this.helpers.requestWithAuthentication.call(this, 'mfrApi', options);


	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
