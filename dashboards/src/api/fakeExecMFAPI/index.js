// @flow
import CommonAPI from 'api/commonAPI';
import type {DTOValue, Transport} from 'api/types';
import Frame from './frame';

const fakeTtransport: Transport = async (module: string, method: string, paramNames: Array<string>, ...params: Array<DTOValue>) => {
	try {
		const response = await fetch(`/sd/services/rest/execmf?accessKey=${process.env.ACCESS_KEY ?? ''}`, {
			body: JSON.stringify([{method, module, params}]),
			method: 'POST'
		});
		const {ok, status, statusText} = response;

		if (ok) {
			const data = await response.json();
			return JSON.parse(data[0]);
		}

		// eslint-disable-next-line no-throw-literal
		throw { responseText: await response.text(), status, statusText };
	} catch (e) {
		console.error('Fake transport: ', e);
		throw e;
	}
};

export default class FakeAPI extends CommonAPI {
	constructor () {
		super(fakeTtransport, new Frame());
	}
}
