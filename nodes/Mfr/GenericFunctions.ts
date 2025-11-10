import { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IHttpRequestOptions, JsonObject, NodeApiError } from "n8n-workflow";

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
		url: uri || `https://portal.mobilefieldreport.com/odata${endpoint}`,
		body,
		json: true,
	} satisfies IHttpRequestOptions;


	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'mfrApi', options);


	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
