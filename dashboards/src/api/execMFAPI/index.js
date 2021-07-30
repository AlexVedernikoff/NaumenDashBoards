// @flow
import CommonAPI from 'api/commonAPI';
import type {DTOValue, Transport} from 'api/types';
import Frame from 'api/commonAPI/frame';

export const execMFTtransport: Transport = async (module: string, method: string, ...params: Array<DTOValue>) => {
	const data = await window.jsApi.restCallModule(module, method, ...params);
	return JSON.parse(JSON.stringify(data));
};

export default class ExecMFAPI extends CommonAPI {
	constructor () {
		super(execMFTtransport, new Frame());
	}
}
